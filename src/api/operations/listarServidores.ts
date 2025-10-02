import { callSoapAction, type SoapRequestOptions } from '../api';

export type ListarServidoresResult = {
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

export async function listarServidores(options?: SoapRequestOptions) {
  return callSoapAction<ListarServidoresResult>('ListarServidores', undefined, options);
}
