import { callSoapAction, type SoapRequestOptions } from '../api';

export type InserirPrestadorServicoParams = {
  codigoMunicipio: string;
  complementoEndereco: string;
  descricaoEndereco: string;
  nomeBairro: string;
  nomePrestadorServico: string;
  numeroCEP: string;
  numeroEndereco: number;
  numeroInscricao: string;
  siglauf: string;
  tipoAreaAtuacao: string;
  tipoInscricao: string;
};

export type InserirPrestadorServicoResult = {
  AreaPPF: string;
  AutoridadePortuaria: string;
  CDMunicipio: string;
  ContratoEmpresa: {
    ContratoEmpresa: Array<{
      CDContrato: string;
      IDClassificaoSubclassificaoCarga: string;
      IDClassificaoSubclassificaoCargaPai: string;
      IDContratoArrendamento: string;
      IDGrupoMercadoria: string;
      IDNaturezaCarga: string;
      IDTipoServico: string;
      NOClassificacaoCarga: string;
      NOGrupoMercadoria: string;
      NOTipoServico: string;
      NRCnpj: string;
      NRVersao: string;
      VLAreaTotal: string;
    }>;
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
    TipoEmpresa: Array<{
      DSTipoEmpresa: string;
      IDTipoEmpresa: number;
      NRinscricao: string;
    }>;
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
};

export async function inserirPrestadorServico(params: InserirPrestadorServicoParams, options?: SoapRequestOptions) {
  return callSoapAction<InserirPrestadorServicoResult>('InserirPrestadorServico', params, options);
}
