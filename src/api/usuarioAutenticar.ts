import { soapRequest } from "./api";

/** Estrutura típica que volta do serviço (ajuste/estenda se necessário) */
export type Servidor = {
  // Do resultado de alto nível:
  IDUsuario: number;
  NOLoginUsuario: string;
  EEFuncionario: string;
  NRMatricula: number;
  STAtivo: boolean | null;

  // Campos do nó "servidor" (achatados para dentro de Servidor):
  NRMatriculaServidor: number;
  NOUsuario: string;
  IDUnidadeOrganizacional: number;
  NOUnidadeOrganizacional: string;
  SGUnidade: string;
  NOCargo: string;
  NRCPF: string;

  /** Base64 puro vindo do SOAP. Útil para montar o data URI na <Image /> */
  Foto: string;

  /** Nil no SOAP -> null aqui */
  IDPostoAvancado: boolean  | null;
  IDUnidadeOrganizacionalPostoAvancado: boolean  | null;

  IDPerfilFiscalizacao: number | null;

  /** Campo extra opcional seu (token JWT, etc.), caso exista no seu fluxo */
  Token?: string;
  [k: string]: any;
};

export type AuthResult = {
  servidor: Servidor;
  token: string;
};

/**
 * Autentica usando o serviço SOAP e retorna um objeto normalizado
 * no padrão do projeto (usando soapRequest de ./antaq).
 */
export async function usuarioAutenticar(
    usuario: string,
    senha: string
): Promise<AuthResult> {
  const parsed = await soapRequest("UsuarioAutenticar", {
    loginUsuario: usuario,
    senhaUsuario: senha,
  });

  // Exibe toda a resposta da API para conferência
  //console.log("Resposta completa de UsuarioAutenticar:", parsed);

  // Mesmo caminho usado no getVersion.ts, só que para UsuarioAutenticar:
  const result =
      parsed?.Envelope?.Body?.UsuarioAutenticarResponse?.UsuarioAutenticarResult;

  // Mostra o resultado normalizado extraído da resposta
  //console.log("Resultado extraído:", result);

  // Alguns ambientes retornam os campos já na raiz; outros aninham em <servidor>
  const servidor: Servidor =
      (result?.servidor as Servidor) ?? (result as Servidor) ?? {};

  // Detalha as informações do servidor retornadas pela API
  //console.log("Dados do servidor:", servidor);

  // DSRetornoAutenticacao = 0 ou IDUsuario <= 0 indicam falha na autenticação
  const authCode = Number((result as any)?.DSRetornoAutenticacao ?? 1);
  const idUsuario = Number((result as any)?.IDUsuario ?? servidor.IDUsuario);
  if (authCode === 0 || idUsuario <= 0) {
    throw new Error("Usuário ou senha inválidos.");
  }

  // Gera um token consistente (usa Token se existir; senão algum identificador estável)
  const token = String(
      servidor.Token ??
      servidor.IDUsuario ??
      servidor.NOLoginUsuario ??
      "auth-ok"
  );

  // Confirma o token que será utilizado
  ///console.log("Token gerado:", token);

  return { servidor, token };
}
