import { callSoapAction, type SoapRequestOptions } from '../api';

export type UsuarioAutenticarParams = {
  loginUsuario: string;
  senhaUsuario: string;
};

export type UsuarioAutenticarResult = {
  DSRetornoAutenticacao: string;
  DSSenha: string;
  EEFuncionario: string;
  IDUsuario: number;
  NOLoginUsuario: string;
  NRMatricula: string;
  servidor: {
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
  };
  STAtivo: boolean;
};

export async function usuarioAutenticar(params: UsuarioAutenticarParams, options?: SoapRequestOptions) {
  return callSoapAction<UsuarioAutenticarResult>('UsuarioAutenticar', params, options);
}
