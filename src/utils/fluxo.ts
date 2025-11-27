import type { Empresa } from '@/api/operations/consultarEmpresas';

export type FluxoTipo = 'MAPA' | 'FROTA' | 'TRAVESSIA';

export type PassoMigracao = {
  titulo: string;
  descricao: string;
  referencia?: string;
};

export type FluxoMigracao = {
  tipo: FluxoTipo;
  titulo: string;
  descricao: string;
  legadoArquivo: string;
  passos: PassoMigracao[];
};

const passoPersistirEmpresa: PassoMigracao = {
  titulo: 'Persistir empresa selecionada',
  descricao:
    "O fluxo legado guarda a autorização em sessionStorage.setItem('arEmpresa', angular.toJson(empresa)).",
  referencia: 'empresa.listarAutorizadas.js > $scope.detalhar',
};

const passoHistorico: PassoMigracao = {
  titulo: 'Exibir histórico de fiscalizações',
  descricao:
    'Após carregar a tela de destino o legado mantém disponível o modal modal_historico com processos em andamento, sancionadores julgados e autos de infração.',
  referencia: 'empresa.listarAutorizadas.html > #modal_historico',
};

type FluxoConfig = {
  tipo: FluxoTipo;
  titulo: string;
  descricao: string;
  legadoArquivo: string;
  passosEspecificos: PassoMigracao[];
};

function criarFluxo(config: FluxoConfig): FluxoMigracao {
  return {
    tipo: config.tipo,
    titulo: config.titulo,
    descricao: config.descricao,
    legadoArquivo: config.legadoArquivo,
    passos: [passoPersistirEmpresa, ...config.passosEspecificos, passoHistorico],
  };
}

function fluxoMapa(empresa: Empresa): FluxoMigracao {
  const descricaoAutoridade =
    'Autorizações de instalação portuária são direcionadas para empresa.geo.html, onde o Google Maps destaca o terminal e camadas auxiliares.';
  const descricaoSemFrota =
    'Quando a autorização não possui frota cadastrada, o Cordova também redireciona para empresa.geo.html para focar na instalação portuária.';

  return criarFluxo({
    tipo: 'MAPA',
    titulo: 'Visualizar instalação no mapa (empresa.geo.html)',
    descricao: empresa.isAutoridadePortuaria ? descricaoAutoridade : descricaoSemFrota,
    legadoArquivo: 'empresa.geo.html',
    passosEspecificos: [
      {
        titulo: 'Carregar dados da instalação',
        descricao:
          'O controlador chama gestorCarregarDadosInstalacoesPortuarias(NRInscricao, Instalacao, Modalidade) para obter os pontos e metadados que alimentam o mapa.',
        referencia: 'empresa.listarAutorizadas.js > gestorCarregarDadosInstalacoesPortuarias',
      },
      {
        titulo: 'Renderizar mapa com Google Maps',
        descricao:
          'A página empresa.geo.html injeta googlemaps.js (API v3.53) para centralizar o mapa e exibir marcadores e rotas associadas.',
        referencia: 'empresa.geo.html / googlemaps.js',
      },
    ],
  });
}

function fluxoFrota(empresa: Empresa): FluxoMigracao {
  const modalidade = empresa.Modalidade ? empresa.Modalidade.trim() : 'a modalidade selecionada';
  return criarFluxo({
    tipo: 'FROTA',
    titulo: 'Listar trechos e frota (empresa.trecho.html)',
    descricao: `Autorizadas de ${modalidade} com frota cadastrada abrem empresa.trecho.html para detalhar linhas, trechos e embarcações vinculadas.`,
    legadoArquivo: 'empresa.trecho.html',
    passosEspecificos: [
      {
        titulo: 'Buscar frota e trechos',
        descricao:
          'O legado dispara gestorCarregarDadosTrechoLinhaTipoTransporteListar(NRInscricao, NRInstrumento, Instalacao) para receber os trechos com suas embarcações.',
        referencia: 'empresa.listarAutorizadas.js > gestorCarregarDadosTrechoLinhaTipoTransporteListar',
      },
      {
        titulo: 'Apresentar detalhes operacionais',
        descricao:
          'A tela empresa.trecho.html mostra a tabela de trechos, filtros por modalidade e permite navegar para a frota de cada linha.',
        referencia: 'empresa.trecho.html / empresa.trecho.js',
      },
    ],
  });
}

function fluxoTravessia(empresa: Empresa): FluxoMigracao {
  const modalidade = empresa.Modalidade ? empresa.Modalidade.trim() : 'Travessia';
  return criarFluxo({
    tipo: 'TRAVESSIA',
    titulo: 'Detalhar frota de travessia (empresa.embarcacao.html)',
    descricao: `Autorizadas de ${modalidade} utilizam empresa.embarcacao.html para listar embarcações e equipes alocadas por sentido da travessia.`,
    legadoArquivo: 'empresa.embarcacao.html',
    passosEspecificos: [
      {
        titulo: 'Registrar origem da navegação',
        descricao:
          "O legado define sessionStorage.setItem('origemEmbarcacao', 'empresa.listarAutorizadas.html') para manter o retorno ao resultado da busca.",
        referencia: 'empresa.listarAutorizadas.js > sessionStorage.setItem("origemEmbarcacao", ...)',
      },
      {
        titulo: 'Consultar frota alocada',
        descricao:
          'Em seguida o app chama gestorCarregarDadosFrotaAlocada(NRInscricao, NRInstrumento, "F") para recuperar as embarcações vigentes.',
        referencia: 'empresa.listarAutorizadas.js > gestorCarregarDadosFrotaAlocada',
      },
      {
        titulo: 'Renderizar grid de embarcações',
        descricao:
          'A view empresa.embarcacao.html apresenta a frota, permite filtros por situação e integra ações de impressão/exportação.',
        referencia: 'empresa.embarcacao.html / empresa.embarcacao.js',
      },
    ],
  });
}

export function mapearFluxoMigracao(empresa: Empresa): FluxoMigracao {
  const qtdEmbarcacao = Number.isFinite(empresa.QTDEmbarcacao)
    ? (empresa.QTDEmbarcacao as number)
    : Number(empresa.QTDEmbarcacao ?? 0);
  const possuiFrota = Number.isFinite(qtdEmbarcacao) && qtdEmbarcacao > 0;
  const travessia = (empresa.Modalidade ?? '').toLowerCase().includes('travessia');

  if (empresa.isAutoridadePortuaria || !possuiFrota) {
    return fluxoMapa(empresa);
  }

  if (travessia) {
    return fluxoTravessia(empresa);
  }

  return fluxoFrota(empresa);
}
