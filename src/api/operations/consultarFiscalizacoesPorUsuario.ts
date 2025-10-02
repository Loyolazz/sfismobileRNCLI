import { callSoapAction, type SoapRequestOptions } from '../api';

export type ConsultarFiscalizacoesPorUsuarioParams = {
  matricula: number;
};

export type ConsultarFiscalizacoesPorUsuarioResult = {
  IDEquipe: number;
  IDFiscalizacao: number;
  ListaFiscalizacao: {
    Fiscalizacao: Array<{
      CDBiGrama: string;
      CDTriGrama: string;
      DSDenunciante: string;
      DSLatitude: string;
      DSLocalFiscalizacao: string;
      DSLongitude: string;
      DSMotivoFiscalizacao: string;
      DSNotaExplicativa: string;
      DSOrigem: string;
      DSSituacao: string;
      DSTipoInstalacaoPortuaria: string;
      DTProgramada: string;
      Equipe: Record<string, unknown>;
      IDFiscalizacao: number;
      IDOrigemFiscalizacaoEventual: number;
      IDPAF: number;
      IDSituacao: number;
      IDSuperintendencia: number;
      IDTerminal: number;
      IDTipoInstalacaoPortuaria: number;
      IDTipoTransporte: number;
      IDTrechoLinha: number;
      IDUnidadeOrganizacional: number;
      IDUsuarioExclusao: number;
      NOLoginUsuario: string;
      NRAno: number;
      NRNumeroIdentidade: string;
      ObjetoFiscalizado: Record<string, unknown>;
      ProcedimentoFiscalizacao: Record<string, unknown>;
      SGSuperintendencia: string;
      SGUFIdentidade: string;
      SGUnidade: string;
      SGUnidadePostoAvancado: string;
      STAprovado: boolean;
      TpExtraordinaria: string;
      TPFiscalizacao: string;
      TPNaturezaFiscalizacao: string;
    }>;
  };
  NOCargo: string;
  NOUnidadeOrganizacional: string;
  NOUsuario: string;
  NRMatricula: number;
  STCoordenador: boolean;
};

export async function consultarFiscalizacoesPorUsuario(params: ConsultarFiscalizacoesPorUsuarioParams, options?: SoapRequestOptions) {
  return callSoapAction<ConsultarFiscalizacoesPorUsuarioResult>('ConsultarFiscalizacoesPorUsuario', params, options);
}
