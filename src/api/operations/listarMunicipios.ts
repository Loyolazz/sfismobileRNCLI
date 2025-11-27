import { callSoapAction, type SoapRequestOptions } from '../api';

export type ListarMunicipiosParams = {
  nomemunicipio: string;
  siglauf: string;
};

export type ListarMunicipiosResult = {
  Municipio: Array<{
    CDMunicipio: string;
    NOMunicipio: string;
    SGUF: string;
  }>;
};

export async function listarMunicipios(params: ListarMunicipiosParams, options?: SoapRequestOptions) {
  return callSoapAction<ListarMunicipiosResult>('ListarMunicipios', params, options);
}
