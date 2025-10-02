import { callSoapAction, type SoapRequestOptions } from '../api';

export type ConsultarEmpresasFiscalizadasParams = {
  cnpj: string;
  razaosocial: string;
};

export type ConsultarEmpresasFiscalizadasResult = {
  Empresa: Array<{
    AreaPPF: string;
    AutoridadePortuaria: string;
    CDMunicipio: string;
    ContratoEmpresa: {
      ContratoEmpresa: Record<string, unknown>[];
    };
    DSBairro: string;
    DSEndereco: string;
    DTAditamento: string;
    DTOutorga: string;
    EDComplemento: string;
    EERepresentante: string;
    Email: string;
    IDContratoArrendamento: number;
    Instalacao: string;
    ListaTipoEmpresa: {
      TipoEmpresa: Record<string, unknown>[];
    };
    Modalidade: string;
    NomeContato: string;
    NOMunicipio: string;
    NORazaoSocial: string;
    NORazaoSocialInstalacao: string;
    NORepresentante: string;
    NRAditamento: string;
    NRCEP: string;
    NRDocumentoSEI: string;
    NREndereco: number;
    NRInscricao: string;
    NRInscricaoInstalacao: string;
    NRInstrumento: string;
    NRResolucao: string;
    NRTelefone: string;
    NRTLO: string;
    QTDEmbarcacao: number;
    SGUF: string;
    STIntimacaoViaEmail: boolean;
    STIntimacaoViaTelefone: boolean;
    TPInscricao: number;
    VLMontanteInvestimento: string;
  }>;
};

export async function consultarEmpresasFiscalizadas(params: ConsultarEmpresasFiscalizadasParams, options?: SoapRequestOptions) {
  return callSoapAction<ConsultarEmpresasFiscalizadasResult>('ConsultarEmpresasFiscalizadas', params, options);
}
