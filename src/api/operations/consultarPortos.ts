import { callSoapAction, type SoapRequestOptions } from '../api';

export type ConsultarPortosParams = {
  nome: string;
};

export type ConsultarPortosResult = {
  InstalacoesPortuariasSIGTAQ: Array<{
    bairro: string;
    cdbigrama: string;
    cdcentroide: string;
    cdinstalacaoportuaria: string;
    cdterminal: string;
    cdtrigrama: string;
    cep: string;
    cidade: string;
    cnpj: string;
    companhia: string;
    complemento: string;
    endereco: string;
    estado: string;
    fonte: string;
    gestao: string;
    idcidade: string;
    idregiaohidrografica: number;
    latitude: string;
    legislacao: string;
    localizacao: string;
    longitude: string;
    modalidade: string;
    nome: string;
    numero: number;
    observacao: string;
    pais: string;
    profundidade: number;
    regiaohidrografica: string;
    situacao: string;
    tipo: string;
    uf: string;
  }>;
};

export async function consultarPortos(params: ConsultarPortosParams, options?: SoapRequestOptions) {
  return callSoapAction<ConsultarPortosResult>('ConsultarPortos', params, options);
}
