export type DocumentoTipo = 'cnpj' | 'cpf' | 'razao';

export type Prestador = {
  id: string;
  razaoSocial: string;
  documento: string;
  documentoTipo: DocumentoTipo;
  endereco: string;
  municipio?: string;
  uf?: string;
};

export type AreaAtuacao =
  | { tipo: 'navegacao'; transporte: string; trechos: string[] }
  | { tipo: 'portuaria'; registro: string; tup?: string; observacoes?: string };

export type Instalacao = {
  nome: string;
  tipo: string;
  endereco: string;
  complemento?: string;
  latitude?: string;
  longitude?: string;
};

export type Servidor = { id: string; nome: string; funcao: string };

export type Irregularidade = { id: string; descricao: string };

export type Anexo = { id: string; nome: string; obrigatorio?: boolean };

export type ServicosNaoAutorizadosStackParamList = {
  ConsultaPrestador: undefined;
  ResultadoPesquisa: {
    filtro: DocumentoTipo;
    termo: string;
    resultados: Prestador[];
  };
  CadastroPrestador:
    | {
        onFinalizarCadastro?: (prestador: Prestador) => void;
      }
    | undefined;
  AreaAtuacao: { prestador: Prestador };
  NavegacaoInterior: { prestador: Prestador };
  AreaPortuaria: { prestador: Prestador };
  CadastrarInstalacao: { prestador: Prestador; area: AreaAtuacao };
  Equipe: { prestador: Prestador; area: AreaAtuacao; instalacao: Instalacao };
  DescricaoFiscalizacao: {
    prestador: Prestador;
    area: AreaAtuacao;
    instalacao: Instalacao;
    equipe: Servidor[];
  };
  SelecaoIrregularidades: {
    prestador: Prestador;
    area: AreaAtuacao;
    instalacao: Instalacao;
    equipe: Servidor[];
    descricao: string;
  };
  ResultadoFiscalizacao: {
    prestador: Prestador;
    area: AreaAtuacao;
    instalacao: Instalacao;
    equipe: Servidor[];
    descricao: string;
    irregularidades: Irregularidade[];
  };
  AutoInfracao: {
    prestador: Prestador;
    area: AreaAtuacao;
    instalacao: Instalacao;
    equipe: Servidor[];
    descricao: string;
    irregularidades: Irregularidade[];
  };
  Processo: {
    prestador: Prestador;
    area: AreaAtuacao;
    instalacao: Instalacao;
    equipe: Servidor[];
    descricao: string;
    irregularidades: Irregularidade[];
  };
  ReenviarDocumentos: { anexos: Anexo[] };
};
