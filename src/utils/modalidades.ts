export type ModalidadeItem = {
  id: string;
  label: string;
  searchTerm?: string;
};

export type ModalidadeTipo = {
  id: string;
  label: string;
  modalidades: ModalidadeItem[];
};

export type ModalidadeArea = {
  id: string;
  label: string;
  tipos: ModalidadeTipo[];
};

export const AREAS_DE_CONSULTA: ModalidadeArea[] = [
  {
    id: 'portuaria',
    label: 'Portuária',
    tipos: [
      {
        id: 'porto-publico',
        label: 'Porto Público',
        modalidades: [{ id: 'porto-publico', label: 'Porto Público' }],
      },
      {
        id: 'terminais-publicos',
        label: 'Terminais Públicos',
        modalidades: [
          { id: 'arrendamento', label: 'Arrendamento' },
          { id: 'contrato-transicao', label: 'Contrato de Transição' },
          { id: 'contrato-uso-temporario', label: 'Contrato de Uso temporário', searchTerm: 'Contrato de Uso Temporário' },
        ],
      },
      {
        id: 'terminais-privados',
        label: 'Terminais Privados',
        modalidades: [
          { id: 'tup', label: 'Terminal de uso privado', searchTerm: 'Terminal de Uso Privado' },
          { id: 'etd', label: 'Estação de transbordo de cargas', searchTerm: 'Estação de Transbordo de Cargas' },
          { id: 'ipt', label: 'Instalação portuária de turismo', searchTerm: 'Instalação Portuária de Turismo' },
          { id: 'registro', label: 'Registro' },
        ],
      },
      {
        id: 'operadores-portuarios',
        label: 'Operadores Portuários',
        modalidades: [{ id: 'operador-portuario', label: 'Operador Portuário' }],
      },
    ],
  },
  {
    id: 'navegacao',
    label: 'Navegação',
    tipos: [
      {
        id: 'maritima',
        label: 'Marítima',
        modalidades: [
          { id: 'apoio-maritimo', label: 'Apoio Marítimo' },
          { id: 'apoio-portuario', label: 'Apoio Portuário' },
          { id: 'cabotagem', label: 'Cabotagem' },
          { id: 'longo-curso', label: 'Longo Curso' },
          {
            id: 'embarcacao-em-construcao',
            label: 'Embarcação em Construção',
            searchTerm: 'Embarcação em Construção',
          },
        ],
      },
      {
        id: 'interior',
        label: 'Interior',
        modalidades: [
          { id: 'longitudinal-misto', label: 'Longitudinal Misto' },
          {
            id: 'longitudinal-passageiros',
            label: 'Longitudinal de Passageiros',
            searchTerm: 'Longitudinal de Passageiros',
          },
          {
            id: 'longitudinal-carga',
            label: 'Longitudinal de Carga',
            searchTerm: 'Longitudinal de Carga',
          },
          { id: 'travessia', label: 'Travessia' },
        ],
      },
    ],
  },
];

export function normalizarBusca(modalidade: ModalidadeItem): string {
  return (modalidade.searchTerm ?? modalidade.label).trim();
}
