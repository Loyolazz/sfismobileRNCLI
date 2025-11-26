import { Anexo, DocumentoTipo, Irregularidade, Prestador, Servidor } from './types';

export const prestadoresBase: Prestador[] = [
  {
    id: '1',
    razaoSocial: 'NAVEGAR TRANSPORTES',
    documento: '12.345.678/0001-90',
    documentoTipo: 'cnpj',
    endereco: 'Av. Atlântica, 1000 - Centro',
    municipio: 'Belém',
    uf: 'PA',
  },
  {
    id: '2',
    razaoSocial: 'RIO ACIMA SERVIÇOS',
    documento: '987.654.321-00',
    documentoTipo: 'cpf',
    endereco: 'Rua das Flores, 250 - Bairro Novo',
    municipio: 'Manaus',
    uf: 'AM',
  },
  {
    id: '3',
    razaoSocial: 'EMBARCAÇÕES SOL DO NORTE',
    documento: '45.698.321/0001-12',
    documentoTipo: 'cnpj',
    endereco: 'Rod. BR 316, km 5 - Área Portuária',
    municipio: 'Santarém',
    uf: 'PA',
  },
];

export const servidores: Servidor[] = [
  { id: 's1', nome: 'Maria Souza', funcao: 'Chefe de equipe' },
  { id: 's2', nome: 'João Pereira', funcao: 'Agente de campo' },
  { id: 's3', nome: 'Carla Nogueira', funcao: 'Técnica' },
  { id: 's4', nome: 'Rafael Lima', funcao: 'Analista' },
];

export const irregularidades: Irregularidade[] = [
  { id: 'i1', descricao: 'Prestação de serviço sem autorização' },
  { id: 'i2', descricao: 'Embarcação fora das especificações' },
  { id: 'i3', descricao: 'Ausência de documentação obrigatória' },
  { id: 'i4', descricao: 'Equipe sem certificação' },
];

export const anexosPadrao: Anexo[] = [
  { id: 'a1', nome: 'Comprovante fotográfico', obrigatorio: true },
  { id: 'a2', nome: 'Relatório descritivo' },
  { id: 'a3', nome: 'Áudio da fiscalização' },
];

export const filtroLabel: Record<DocumentoTipo, string> = {
  cnpj: 'CNPJ',
  cpf: 'CPF',
  razao: 'Razão Social',
};
