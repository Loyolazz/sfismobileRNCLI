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
    console.warn(`[${tag}] body:`, typeof data === 'string' ? data.slice(0, 400) : data);
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
      if (value === null || value === undefined) {
        root.ele(`tem:${key}`);
      } else {
        root.ele(`tem:${key}`).txt(String(value));
      }
    });
  }

  return root.end();
}

async function axiosSoapPost(action: string, xmlBody: string, signal?: AbortSignal): Promise<string> {
  try {
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
  } catch (firstError) {
    explainAxiosError(firstError, 'SOAP12');
    try {
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
    } catch (fallbackError) {
      explainAxiosError(fallbackError, 'SOAP11');
      throw fallbackError;
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

