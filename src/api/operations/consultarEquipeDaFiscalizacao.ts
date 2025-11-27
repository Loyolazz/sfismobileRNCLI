import { callSoapAction, type SoapRequestOptions } from '../api';

export type ConsultarEquipeDaFiscalizacaoParams = {
  idFiscalizacao: number;
};

export type ConsultarEquipeDaFiscalizacaoResult = {
  Equipe: Array<{
    IDEquipe: number;
    IDFiscalizacao: number;
    ListaFiscalizacao: {
      Fiscalizacao: Record<string, unknown>[];
    };
    NOCargo: string;
    NOUnidadeOrganizacional: string;
    NOUsuario: string;
    NRMatricula: number;
    STCoordenador: boolean;
  }>;
};

export async function consultarEquipeDaFiscalizacao(params: ConsultarEquipeDaFiscalizacaoParams, options?: SoapRequestOptions) {
  return callSoapAction<ConsultarEquipeDaFiscalizacaoResult>('ConsultarEquipeDaFiscalizacao', params, options);
}
