import { callSoapAction, type SoapRequestOptions } from '../api';

export type ContratoArredamentoConsultarParams = {
  CDContrato: string;
};

export type ContratoArredamentoConsultarResult = {
  ContratoArrendamento: Array<{
    CDContrato: string;
    CDHash: string;
    CDTrigrama: string;
    DOCContrato: string;
    DSDestinacao: string;
    DSExercida: string;
    DSIdentificacao: string;
    DSPassivelLicitacao: string;
    DTAssinatura: string;
    DTAssinaturaAditivo: string;
    DTcriacao: string;
    DTDesocupacao: string;
    DTEditalLicitacao: string;
    DTFimContrato: string;
    DTInicialContrato: string;
    DTOperacao: string;
    DTPublicacao: string;
    DTVigenciaContrato: string;
    IDContratoArrendamento: string;
    IDTerminal: string;
    IDTipoLicitacao: string;
    MMObjeto: string;
    NOContrato: string;
    NOFantasiaEmpresa: string;
    NOInstalacao: string;
    NOJustificativaHomologacao: string;
    NomeArquivo: string;
    NONomeInstrumento: string;
    NORazaoSocial: string;
    NORenovacao: string;
    NOTipoOutorga: string;
    NOUsuarioCadastro: string;
    NRCnpj: string;
    NRCNPJInstalacao: string;
    NREditalLicitacao: string;
    NRPrazoContrato: string;
    NRPrazoContratoDias: string;
    NRPrazoContratoMeses: string;
    NRVersao: string;
    STContrato: string;
    STExpiracao: string;
    STHomogacao: string;
    STInicioContrato: string;
    STLicitacaoPrevia: string;
    TPContrato: string;
    VLWACC: string;
  }>;
};

export async function contratoArredamentoConsultar(params: ContratoArredamentoConsultarParams, options?: SoapRequestOptions) {
  return callSoapAction<ContratoArredamentoConsultarResult>('ContratoArredamentoConsultar', params, options);
}
