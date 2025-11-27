import axios, { AxiosError } from 'axios';
import { create } from 'xmlbuilder2';
import { XMLParser } from 'fast-xml-parser';

import { REQUEST_TIMEOUT_MS, SERVICE_BASE_URL, SOAP_NAMESPACE } from './config';

const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true });

export type SoapRequestOptions = {
  signal?: AbortSignal;
};

function explainAxiosError(err: unknown, tag = 'ERR') {
  const ax = err as AxiosError;
  console.warn(`[${tag}] message:`, ax.message);
  if (ax.cause) console.warn(`[${tag}] cause:`, (ax as any).cause);
  try {
    const payload = ax.toJSON?.();
    if (payload) {
      console.warn(`[${tag}] toJSON:`, JSON.stringify(payload, null, 2));
    }
  } catch {}
  if (ax.response) {
    console.warn(`[${tag}] status:`, ax.response.status);
    console.warn(`[${tag}] headers:`, ax.response.headers);
    const data = ax.response.data as any;
    console.warn(`[${tag}] body:`, typeof data === 'string' ? data.slice(0, 1000) : data);
  }
}

export function buildSoapEnvelope(action: string, params?: Record<string, unknown>) {
  const root = create({ version: '1.0' })
    .ele('soap:Envelope', {
      'xmlns:soap': 'http://www.w3.org/2003/05/soap-envelope',
      'xmlns:tem': SOAP_NAMESPACE,
    })
    .ele('soap:Header')
    .up()
    .ele('soap:Body')
    .ele(`tem:${action}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      if (typeof value === 'string' && value.trim() === '') return;
      root.ele(`tem:${key}`).txt(String(value));
    });
  }

  return root.end();
}

async function axiosSoapPost(
  action: string,
  params: Record<string, unknown> | undefined,
  signal?: AbortSignal,
): Promise<string> {
  // Primeiro tenta SOAP 1.1 (preferido por servidores .NET/ASMX antigos)
  try {
    const xmlBody = buildSoapEnvelope(action, params, true);
    console.log('[SOAP11] Tentando SOAP 1.1 com body >>>\n', xmlBody);
    const response = await axios.post<string>(SERVICE_BASE_URL, xmlBody, {
      baseURL: undefined,
      transformRequest: v => v,
      transitional: { forcedJSONParsing: false },
      responseType: 'text',
      timeout: REQUEST_TIMEOUT_MS,
      signal,
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        SOAPAction: `"${SOAP_NAMESPACE}/${action}"`,
        Accept: 'text/xml',
      },
    });
    console.log('[SOAP11] status:', response.status);
    return response.data;
  } catch (firstError) {
    explainAxiosError(firstError, 'SOAP11');
    // Fallback: SOAP 1.1 sem aspas no SOAPAction
    try {
      const xmlBody = buildSoapEnvelope(action, params, true);
      console.log('[SOAP11-NOQ] Tentando SOAP 1.1 sem aspas no SOAPAction >>>\n', xmlBody);
      const response = await axios.post<string>(SERVICE_BASE_URL, xmlBody, {
        baseURL: undefined,
        transformRequest: v => v,
        transitional: { forcedJSONParsing: false },
        responseType: 'text',
        timeout: REQUEST_TIMEOUT_MS,
        signal,
        headers: {
          'Content-Type': 'text/xml; charset=utf-8',
          SOAPAction: `${SOAP_NAMESPACE}/${action}`,
          Accept: 'text/xml',
        },
      });
      console.log('[SOAP11-NOQ] status:', response.status);
      return response.data;
    } catch (secondError) {
      explainAxiosError(secondError, 'SOAP11-NOQ');
      // Último fallback: SOAP 1.2
      try {
        const xmlBody = buildSoapEnvelope(action, params, false);
        console.log('[SOAP12] Tentando fallback SOAP 1.2 >>>\n', xmlBody);
        const response = await axios.post<string>(SERVICE_BASE_URL, xmlBody, {
          baseURL: undefined,
          transformRequest: v => v,
          transitional: { forcedJSONParsing: false },
          responseType: 'text',
          timeout: REQUEST_TIMEOUT_MS,
          signal,
          headers: {
            'Content-Type': `application/soap+xml; charset=utf-8; action="${SOAP_NAMESPACE}/${action}"`,
            Accept: 'application/soap+xml',
          },
        });
        console.log('[SOAP12] status:', response.status);
        return response.data;
      } catch (fallbackError) {
        explainAxiosError(fallbackError, 'SOAP12');
        throw fallbackError;
      }
    }
  }
}

function pick<T = any>(obj: any, paths: string[]): T | undefined {
  for (const path of paths) {
    const keys = path.split('.');
    let current: any = obj;
    let found = true;
    for (const key of keys) {
      if (current && Object.prototype.hasOwnProperty.call(current, key)) {
        current = current[key];
      } else {
        found = false;
        break;
      }
    }
    if (found) {
      return current as T;
    }
  }
  return undefined;
}

export async function soapRequest(
  action: string,
  params?: Record<string, unknown>,
  options?: SoapRequestOptions,
) {
  const xml = buildSoapEnvelope(action, params);
  console.log('[SOAP] body >>>\n', xml);

  const raw = await axiosSoapPost(action, xml, options?.signal);
  console.log('[SOAP] raw(xml) <<<\n', (raw || '').slice(0, 800));

  const parsed = parser.parse(raw);
  console.log('[SOAP] parsed(json) <<<\n', JSON.stringify(parsed, null, 2));
  return parsed;
}

export function extractSoapResult(parsed: any, action: string): any {
  const responseTag = `${action}Response`;
  const resultTag = `${action}Result`;
  const candidates = [
    `Envelope.Body.${responseTag}.${resultTag}`,
    `Envelope.Body.tem:${responseTag}.tem:${resultTag}`,
    `soap:Envelope.soap:Body.${responseTag}.${resultTag}`,
    `soap:Envelope.soap:Body.tem:${responseTag}.tem:${resultTag}`,
    `${responseTag}.${resultTag}`,
  ];
  return pick(parsed, candidates);
}

