import { callSoapAction, type SoapRequestOptions } from '../api';

export type ConsultarContatoParams = {
  nrInscricao: string;
};

export type ConsultarContatoResult = {
  Contato: Array<{
    Bairro: string;
    Cep: string;
    Cnpj: string;
    CnpjAssociado: string;
    Complemento: string;
    Cpf: string;
    DataNascimento: string;
    Email: string;
    Endereco: string;
    ExpressaoCargo: string;
    ExpressaoTratamento: string;
    ExpressaoVocativo: string;
    IdCargo: string;
    IdCidade: string;
    IdContato: string;
    IdContatoAssociado: string;
    IdEstado: string;
    IdPais: string;
    IdTipoContato: string;
    Matricula: string;
    MatriculaOab: string;
    Nome: string;
    NomeCidade: string;
    NomeContatoAssociado: string;
    NomePais: string;
    NomeTipoContato: string;
    Observacao: string;
    OrgaoExpedidor: string;
    Rg: string;
    Sigla: string;
    SiglaEstado: string;
    SinAtivo: string;
    SinEnderecoAssociado: string;
    SitioInternet: string;
    StaGenero: string;
    StaNatureza: string;
    StaOperacao: string;
    TelefoneCelular: string;
    TelefoneFixo: string;
  }>;
};

export async function consultarContato(params: ConsultarContatoParams, options?: SoapRequestOptions) {
  return callSoapAction<ConsultarContatoResult>('ConsultarContato', params, options);
}
