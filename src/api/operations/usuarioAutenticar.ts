import { callSoapAction, type SoapRequestOptions } from '../api';

export type UsuarioAutenticarParams = {
  loginUsuario: string;
  senhaUsuario: string;
};

export type Servidor = {
  IDUsuario: number;
  NOLoginUsuario: string;
  EEFuncionario: string;
  NRMatricula: number;
  STAtivo: boolean | null;

  NRMatriculaServidor: number;
  NOUsuario: string;
  IDUnidadeOrganizacional: number;
  NOUnidadeOrganizacional: string;
  SGUnidade: string;
  NOCargo: string;
  NRCPF: string;
  Foto: string;
  IDPostoAvancado: boolean | null;
  IDUnidadeOrganizacionalPostoAvancado: boolean | null;
  IDPerfilFiscalizacao: number | null;
  Token?: string;
  [k: string]: unknown;
};

export type AuthResult = {
  servidor: Servidor;
  token: string;
};

export type UsuarioAutenticarResult = {
  DSRetornoAutenticacao: string;
  DSSenha: string;
  EEFuncionario: string;
  IDUsuario: number;
  NOLoginUsuario: string;
  NRMatricula: string;
  servidor: Servidor;
  STAtivo: boolean;
};

export async function usuarioAutenticar(
  params: UsuarioAutenticarParams,
  options?: SoapRequestOptions,
): Promise<AuthResult> {
  console.log('[API] usuarioAutenticar chamada', { loginUsuario: params.loginUsuario });
  const result = await callSoapAction<UsuarioAutenticarResult | { servidor?: Servidor }>(
    'UsuarioAutenticar',
    params,
    options,
  );

  const servidor = ((result as any)?.servidor as Servidor) ?? (result as unknown as Servidor) ?? ({} as Servidor);
  const authCode = Number((result as any)?.DSRetornoAutenticacao ?? 1);
  const idUsuario = Number((result as any)?.IDUsuario ?? servidor.IDUsuario);

  if (authCode === 0 || idUsuario <= 0) {
    console.log('[API] usuarioAutenticar falha', { authCode, idUsuario });
    throw new Error('Usuário ou senha inválidos.');
  }

  const token = String(
    servidor.Token ??
      servidor.IDUsuario ??
      (result as any)?.IDUsuario ??
      (result as any)?.NOLoginUsuario ??
      'auth-ok',
  );

  console.log('[API] usuarioAutenticar retorno', { token, servidor });

  return { servidor, token };
}
