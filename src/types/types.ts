export type DrawerParamList = {
    Home: { showReleases?: string | string[] } | undefined;
    MinhasFiscalizacoes: undefined;
    FiscalizacaoRotina: undefined;
    ConsultarAutorizadas: undefined;
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
    Mapa: {
        empresa: import('@/api/operations/consultarEmpresas').Empresa;
    };
};
