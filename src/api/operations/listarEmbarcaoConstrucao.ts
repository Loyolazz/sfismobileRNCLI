import { callSoapAction, type SoapRequestOptions } from '../api';

export type ListarEmbarcaoConstrucaoResult = {
  EmbarcacaoConstrucao: Array<{
    DSObservacao: string;
    DSObservacaoEvolucao: string;
    DSTipoEmbarcacao: string;
    DTApresentacaoCronograma: string;
    DTConclusaoConstrucao: string;
    DTInicioConstrucao: string;
    DTLancamento: string;
    DTTermoCompromisso: string;
    IDAgenteFinanceiro: number;
    IDClassificacaoEmbarcacao: number;
    IDEmbarcacaoConstrucao: number;
    IDEstaleiroConstrucao: number;
    IDTipoEmbarcacao: number;
    IDTipoMaterialCasco: number;
    NOEmbarcacao: string;
    NRCasco: string;
    NRInscricao: string;
    NRLicencaMarinha: string;
    QTMotor: number;
    QTTripulante: number;
    STAtraso: boolean;
    STAtrasoForcaMaior: boolean;
    STComprovacaoPesoLeve: boolean;
    STConstrucao: number;
    STCronograma: boolean;
    STGarantiaOutorga: boolean;
    TPInscricao: number;
    VLArqueacaoBruta: number;
    VLBHP: number;
    VLBoca: number;
    VLCaladoMaximo: number;
    VLCapacidadePassageiros: number;
    VLComprimento: number;
    VLPesoLeveEdificado: number;
    VLPesoLeveEdificadoEvolucao: number;
    VLPesoLeveTotal: number;
    VLPontal: number;
    VLTPB: number;
    VLTTE: number;
  }>;
};

export async function listarEmbarcaoConstrucao(options?: SoapRequestOptions) {
  return callSoapAction<ListarEmbarcaoConstrucaoResult>('ListarEmbarcaoConstrucao', undefined, options);
}
