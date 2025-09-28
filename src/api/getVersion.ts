// src/services/getversion.ts
import { soapRequest, extractSoapResult } from "./antaq";

/** Chama o método GetVersion e retorna a string de versão */
export async function getVersion(): Promise<string> {
  const parsed = await soapRequest("GetVersion");
  const version = extractSoapResult(parsed, "GetVersion");

  console.log("[GetVersion] result:", version);

  if (typeof version === "string") return version;
  if (version != null) return String(version);

  throw new Error("GetVersionResult não encontrado na resposta SOAP.");
}
