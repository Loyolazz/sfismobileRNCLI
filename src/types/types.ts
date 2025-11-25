export type DrawerParamList = {
    Home: { showReleases?: string | string[] } | undefined;
    MinhasFiscalizacoes: undefined;
    FiscalizacaoRotina: undefined;
    ConsultarAutorizadas: undefined;
    Equipe:
        | {
              empresa?: import('@/api/operations/consultarEmpresas').Empresa;
          }
        | undefined;
    RelatorioUsuario: undefined;
    Antaq: undefined;
    Tutorial: undefined;
    NovidadesVersao: undefined;
    SituacaoServico: undefined;
    EmAndamento: undefined;
    PainelEmpresas: undefined;
    EsquemasOperacionais: undefined;
    ServicosNaoAutorizados: undefined;
    Notificacoes: undefined;
};

export type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    HomeDrawer: { showReleases?: string | string[] } | undefined;
};

export type ConsultarAutorizadasStackParamList = {
    Menu: undefined;
    CnpjRazao: undefined;
    Modalidade: undefined;
    Embarcacao: undefined;
    Instalacao: undefined;
    Detalhes: {
        empresa: import('@/api/operations/consultarEmpresas').Empresa;
    };
    Frota: {
        empresa: import('@/api/operations/consultarEmpresas').Empresa;
        fluxoTipo?: 'FROTA' | 'TRAVESSIA';
    };
    Mapa: {
        empresa: import('@/api/operations/consultarEmpresas').Empresa;
    };
    Historico: {
        empresa: import('@/api/operations/consultarEmpresas').Empresa;
    };
};

export type PrestadorServico =
    import('@/api/operations/listarPrestadoresServicos').ListarPrestadoresServicosResult['Empresa'][number];

export type NovoPrestadorServico = {
    STCadastrarNovo: true;
    TPInscricao: 1 | 2;
    NRInscricao: string;
    NORazaoSocial: string;
    DSEndereco: string;
    EDComplemento?: string;
    NREndereco: string;
    NRCEP: string;
    DSBairro: string;
    SGUF: string;
    CDMunicipio: string;
    NOMunicipio?: string;
};

export type PrestadorSelecionado = PrestadorServico | NovoPrestadorServico;

export type ServicosNaoAutorizadosStackParamList = {
    Consultar: undefined;
    ListaPrestadores: {
        prestadores: PrestadorServico[];
        filtro: { termo: string; tipo: 'cnpj' | 'cpf' | 'razaosocial' };
    };
    CadastrarPrestador: undefined;
    AreaAtuacao: { prestador: PrestadorSelecionado };
    AreaPortuaria: { prestador: PrestadorSelecionado };
};
