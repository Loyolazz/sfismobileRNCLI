import { callSoapAction, type SoapRequestOptions } from '../api';

export type ListarEsquemasOperacionaisResult = {
  EsquemasOperacionais: Array<{
    CDLocalChegada: string;
    CDLocalPartida: string;
    CDSemanaChegada: string;
    CDSemanaPartida: string;
    ChegadaDiaSemana: string;
    HRChegada: string;
    HRPartida: string;
    IDEsquemaOperacional: number;
    IDEsquemaOperacionalItinerario: number;
    NRInscricao: string;
    NROrdem: number;
    PartidaDiaSemana: string;
    PartidaPorto: string;
    PortoChegada: string;
    Sentido: string;
    STIdaVolta: number;
    UFChegada: string;
    UFPartida: string;
    VLLatitudeChegada: string;
    VLLatitudePartida: string;
    VLLongitudeChegada: string;
    VLLongitudePartida: string;
  }>;
};

export async function listarEsquemasOperacionais(options?: SoapRequestOptions) {
  return callSoapAction<ListarEsquemasOperacionaisResult>('ListarEsquemasOperacionais', undefined, options);
}
