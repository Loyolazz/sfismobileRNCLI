import axios, { AxiosError } from "axios";
import { create } from "xmlbuilder2";
import { XMLParser } from "fast-xml-parser";

const SERVICE_URL = "https://sfismobile.antaq.gov.br/AntaqService/Services.asmx";

const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true });

function buildEnvelope(action: string, params?: Record<string, any>) {
  const root = create({ version: "1.0" })
    .ele("soap:Envelope", {
      "xmlns:soap": "http://www.w3.org/2003/05/soap-envelope",
      "xmlns:tem": "http://tempori.org",
    })
    .ele("soap:Header").up()
    .ele("soap:Body")
    .ele(`tem:${action}`);

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === null || v === undefined) root.ele(`tem:${k}`);
      else root.ele(`tem:${k}`).txt(String(v));
    }
  }
  return root.end();
}

function explainAxiosError(err: unknown, tag = "ERR") {
  const ax = err as AxiosError;
  console.warn(`[${tag}] message:`, ax.message);
  if (ax.cause) console.warn(`[${tag}] cause:`, (ax as any).cause);
  try { console.warn(`[${tag}] toJSON:`, JSON.stringify(ax.toJSON?.(), null, 2)); } catch {}
  if (ax.response) {
    console.warn(`[${tag}] status:`, ax.response.status);
    console.warn(`[${tag}] headers:`, ax.response.headers);
    const data = ax.response.data as any;
    console.warn(`[${tag}] body:`, typeof data === "string" ? data.slice(0, 400) : data);
  }
}

async function axiosSoapPost(action: string, xmlBody: string, signal?: AbortSignal): Promise<string> {
  try {
    const r = await axios.post<string>(SERVICE_URL, xmlBody, {
      transformRequest: v => v,
      transitional: { forcedJSONParsing: false },
      responseType: "text",
      timeout: 30000,
      signal,
      headers: {
        "Content-Type": `application/soap+xml; charset=utf-8; action="http://tempori.org/${action}"`,
        "Accept": "application/soap+xml",
      },
    });
    console.log("[SOAP12] status:", r.status);
    return r.data;
  } catch (e12) {
    explainAxiosError(e12, "SOAP12");
    try {
      const r2 = await axios.post<string>(SERVICE_URL, xmlBody, {
        transformRequest: v => v,
        transitional: { forcedJSONParsing: false },
        responseType: "text",
        timeout: 30000,
        signal,
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
          "SOAPAction": `"http://tempori.org/${action}"`,
          "Accept": "text/xml",
        },
      });
      console.log("[SOAP11] status:", r2.status);
      return r2.data;
    } catch (e11) {
      explainAxiosError(e11, "SOAP11");
      throw e11; // ainda é “Network Error”? então é rede/TLS.
    }
  }
}

function pick<T = any>(obj: any, paths: string[]): T | undefined {
  for (const p of paths) {
    const parts = p.split(".");
    let cur: any = obj, ok = true;
    for (const k of parts) {
      if (cur && Object.prototype.hasOwnProperty.call(cur, k)) cur = cur[k];
      else { ok = false; break; }
    }
    if (ok) return cur as T;
  }
  return undefined;
}

export async function soapRequest(action: string, params?: Record<string, any>, options?: { signal?: AbortSignal; }) {
  const xml = buildEnvelope(action, params);
  console.log("[SOAP] body >>>\n", xml);

  const raw = await axiosSoapPost(action, xml, options?.signal);
  console.log("[SOAP] raw(xml) <<<\n", (raw || "").slice(0, 800));

  const parsed = parser.parse(raw);
  console.log("[SOAP] parsed(json) <<<\n", JSON.stringify(parsed, null, 2));
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
