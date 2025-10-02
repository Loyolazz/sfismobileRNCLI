import { callSoapAction, type SoapRequestOptions } from '../api';

export type ConsultarServidoresParams = {
  IdUnidadeOrganizacional: string;
  Matricula: string;
  NomeUsuario: string;
  Sigla: string;
};

export type ConsultarServidoresResult = {
  Servidor: Array<{
    DSPostoAvancado: string;
    Foto: string;
    IDPerfilFiscalizacao: number;
    IDPostoAvancado: number;
    IDUnidadeOrganizacional: number;
    IDUnidadeOrganizacionalPostoAvancado: number;
    NOCargo: string;
    NOUnidadeOrganizacional: string;
    NOUnidadeOrganizacionalPostoAvancado: string;
    NOUsuario: string;
    NRCPF: string;
    NRMatriculaServidor: number;
    SGUnidade: string;
    SGUnidadePostoAvancado: string;
  }>;
};

export async function consultarServidores(params: ConsultarServidoresParams, options?: SoapRequestOptions) {
  return callSoapAction<ConsultarServidoresResult>('ConsultarServidores', params, options);
}
