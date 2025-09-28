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

  // rótulo do instrumento (no gestor_bd.js o Cordova troca conforme modalidade)
  const descInstrumento =
      modalidade?.match(/Cabotagem|Apoio Portuario|Apoio Maritimo/i)
          ? `Termo de Autorização: ${str(x?.NRInstrumento)}`
          : `Instrumento: ${str(x?.NRInstrumento)}`;

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

    Modalidade: modalidade,
    NRInstrumento: str(x?.NRInstrumento),
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
