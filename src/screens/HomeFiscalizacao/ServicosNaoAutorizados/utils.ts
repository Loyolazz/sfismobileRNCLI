import {
  cadastrarPrestadorServicoNaoAutorizado,
  type InserirPrestadorServicoParams,
  vincularPrestadorServicoNaoAutorizado,
} from '@/api/servicosNaoAutorizados';
import { digitsOnly } from '@/utils/documents';
import type { PrestadorSelecionado } from '@/types/types';

export async function salvarAreaPrestador(prestador: PrestadorSelecionado, tipoAreaAtuacao: string) {
  if ('STCadastrarNovo' in prestador && prestador.STCadastrarNovo) {
    const payload: InserirPrestadorServicoParams = {
      codigoMunicipio: prestador.CDMunicipio,
      complementoEndereco: prestador.EDComplemento ?? '',
      descricaoEndereco: prestador.DSEndereco,
      nomeBairro: prestador.DSBairro,
      nomePrestadorServico: prestador.NORazaoSocial,
      numeroCEP: digitsOnly(`${prestador.NRCEP}`),
      numeroEndereco: Number(digitsOnly(`${prestador.NREndereco}`)) || 0,
      numeroInscricao: prestador.NRInscricao,
      siglauf: prestador.SGUF,
      tipoAreaAtuacao,
      tipoInscricao: prestador.TPInscricao.toString(),
    };

    await cadastrarPrestadorServicoNaoAutorizado(payload);
    return;
  }

  const tipoInscricao = prestador.TPInscricao === 1 ? 'cnpj' : 'cpf';
  await vincularPrestadorServicoNaoAutorizado({
    numeroInscricao: prestador.NRInscricao,
    tipoAreaAtuacao,
    tipoInscricao,
  });
}
