import { callSoapAction, type SoapRequestOptions } from '../api';

export type ConsultarEmpresasParams = {
  cnpjRazaosocial: string;
};

export type ConsultarEmpresasResult = {
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

export async function consultarEmpresas(params: ConsultarEmpresasParams, options?: SoapRequestOptions) {
  return callSoapAction<ConsultarEmpresasResult>('ConsultarEmpresas', params, options);
}
