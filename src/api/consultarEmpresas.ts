// src/api/consultarEmpresas.ts
import { soapRequest, extractSoapResult } from '@/api/antaq';

export type TipoEmpresa = {
  IDTipoEmpresa: number;
  DSTipoEmpresa: string;
  NRinscricao?: string;
};

export type Empresa = {
  NORazaoSocial: string;
  TPInscricao?: number;
  NRInscricao: string;
  DSEndereco?: string;
  SGUF?: string;
  NOMunicipio?: string;
  DSBairro?: string;
  NRCEP?: string | number;
  QTDEmbarcacao?: number;
  AreaPPF?: string;

  // Campos “explodidos” por autorização (Cordova):
  Modalidade?: string;
  NRInstrumento?: string;
  DescricaoNRInstrumento?: string;
  DTAditamento?: string;
  NRAditamento?: string;
  Instalacao?: string;
  NRInscricaoInstalacao?: string;
  NORazaoSocialInstalacao?: string;
  IDTipoInstalacaoPortuaria?: string;

  // Decoração que o Cordova cria
  icone?: string;
  norma?: string | number;

  // Pedidos anteriores: manter isto
  isAutoridadePortuaria?: boolean;
  NomeContato?: string;
  Email?: string;
  AutoridadePortuaria?: string;
  NRResolucao?: string;
  NRDocumentoSEI?: string;
  NRTelefone?: string;
  NORepresentante?: string;
  EERepresentante?: string;
  STIntimacaoViaTelefone?: boolean;
  STIntimacaoViaEmail?: boolean;
  IDContratoArrendamento?: number;

  ListaTipoEmpresa?: TipoEmpresa[] | null;
};

// --------- BUSCA (resumo) - continua disponível, se quiser o “cartão” único
export async function buscarEmpresasCnpjRazao(termo: string): Promise<Empresa[]> {
  const parsed = await soapRequest('ConsultarEmpresas', { cnpjRazaosocial: termo });
  const result = extractSoapResult(parsed, 'ConsultarEmpresas');

  // Pode vir objeto único; normaliza para array
  const empresa = result?.Empresa ?? result;
  const list = Array.isArray(empresa) ? empresa : [empresa].filter(Boolean);

  return list.map(mapEmpresaResumo);
}

// --------- NOVO: BUSCA AUTORIZAÇÕES (igual ao Cordova)
type FiltroAutorizadas = {
  cnpjRazaosocial?: string;
  modalidade?: string;
  embarcacao?: string;
  instalacao?: string;
};

async function consultarEmpresasAutorizadas(payload: FiltroAutorizadas): Promise<Empresa[]> {
  const parsed = await soapRequest('ConsultarEmpresasAutorizadas', payload);
  const result = extractSoapResult(parsed, 'ConsultarEmpresasAutorizadas');

  // No serviço legado normalmente vem um array de autorizações
  const itens = Array.isArray(result?.d) ? result.d : (result?.Empresa ?? result);
  const list: any[] = Array.isArray(itens) ? itens : [itens].filter(Boolean);

  return list.map(mapEmpresaAutorizadaLikeCordova);
}

export async function buscarEmpresasAutorizadas(
    termo: string,
    modalidade: string = ''
): Promise<Empresa[]> {
  return consultarEmpresasAutorizadas({ cnpjRazaosocial: termo, modalidade });
}

export async function consultarPorModalidade(modalidade: string): Promise<Empresa[]> {
  return consultarEmpresasAutorizadas({ modalidade });
}

export async function consultarPorEmbarcacao(embarcacao: string): Promise<Empresa[]> {
  return consultarEmpresasAutorizadas({ embarcacao });
}

export async function consultarPorInstalacao(instalacao: string): Promise<Empresa[]> {
  return consultarEmpresasAutorizadas({ instalacao });
}

/* --------------------------------- mappers -------------------------------- */

function mapEmpresaResumo(x: any): Empresa {
  return {
    NORazaoSocial: str(x?.NORazaoSocial),
    TPInscricao: num(x?.TPInscricao),
    NRInscricao: str(x?.NRInscricao),
    DSEndereco: str(x?.DSEndereco),
    SGUF: str(x?.SGUF),
    NOMunicipio: str(x?.NOMunicipio),
    DSBairro: str(x?.DSBairro),
    NRCEP: str(x?.NRCEP),
    QTDEmbarcacao: num(x?.QTDEmbarcacao),
    ListaTipoEmpresa: normalizeListaTipoEmpresa(x?.ListaTipoEmpresa),
  };
}

function mapEmpresaAutorizadaLikeCordova(x: any): Empresa {
  const modalidade = str(x?.Modalidade);
  const idInstPort = str(x?.IDTipoInstalacaoPortuaria);
  const isAutoridadePortuaria = !!idInstPort;

  const numeroInstrumento = str(x?.NRInstrumento).trim();
  const descInstrumento = numeroInstrumento
    ? modalidade?.match(/Cabotagem|Apoio Portuario|Apoio Maritimo/i)
      ? `Termo de Autorização: ${numeroInstrumento}`
      : `Instrumento: ${numeroInstrumento}`
    : '';

  // ícone aproximado do Cordova
  const icone = isAutoridadePortuaria ? 'img/icon-terminal.png' : 'img/icon-embarca.png';

  return {
    NORazaoSocial: str(x?.NORazaoSocial),
    TPInscricao: num(x?.TPInscricao),
    NRInscricao: str(x?.NRInscricao),
    DSEndereco: str(x?.DSEndereco),
    SGUF: str(x?.SGUF),
    NOMunicipio: str(x?.NOMunicipio),
    DSBairro: str(x?.DSBairro),
    NRCEP: str(x?.NRCEP),
    QTDEmbarcacao: num(x?.QTDEmbarcacao),
    AreaPPF: str(x?.AreaPPF),

    Modalidade: modalidade,
    NRInstrumento: numeroInstrumento,
    DescricaoNRInstrumento: descInstrumento,
    DTAditamento: str(x?.DTAditamento),
    NRAditamento: str(x?.NRAditamento),
    Instalacao: str(x?.Instalacao),
    NRInscricaoInstalacao: str(x?.NRInscricaoInstalacao),
    NORazaoSocialInstalacao: str(x?.NORazaoSocialInstalacao),
    IDTipoInstalacaoPortuaria: idInstPort,

    icone,
    norma: x?.norma, // se o serviço devolver
    isAutoridadePortuaria,
    NomeContato: str(x?.NomeContato),
    Email: str(x?.Email),
    AutoridadePortuaria: str(x?.AutoridadePortuaria),
    NRResolucao: str(x?.NRResolucao),
    NRDocumentoSEI: str(x?.NRDocumentoSEI),
    NRTelefone: str(x?.NRTelefone),
    NORepresentante: str(x?.NORepresentante),
    EERepresentante: str(x?.EERepresentante),
    STIntimacaoViaTelefone: bool(x?.STIntimacaoViaTelefone),
    STIntimacaoViaEmail: bool(x?.STIntimacaoViaEmail),
    IDContratoArrendamento: num(x?.IDContratoArrendamento),
  };
}

function normalizeListaTipoEmpresa(src: any): TipoEmpresa[] | null {
  if (!src) return null;
  const arr = Array.isArray(src?.TipoEmpresa) ? src.TipoEmpresa : [src?.TipoEmpresa].filter(Boolean);
  return arr.map((t: any) => ({
    IDTipoEmpresa: num(t?.IDTipoEmpresa),
    DSTipoEmpresa: str(t?.DSTipoEmpresa),
    NRinscricao: str(t?.NRinscricao),
  }));
}

function str(v: any): string {
  if (v == null) return '';
  // xml-js pode vir como objeto { "@_nil": "true" }
  if (typeof v === 'object' && v['@_nil']) return '';
  return String(v);
}
function num(v: any): number | undefined {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function bool(v: any): boolean | undefined {
  if (v == null) return undefined;
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v === 1;
  if (typeof v === 'string') return v.toLowerCase() === 'true' || v === '1';
  return undefined;
}
