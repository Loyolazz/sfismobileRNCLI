const ICON_EMBARCACAO = 'img/icon-embarca.png';
const ICON_TERMINAL = 'img/icon-terminal.png';
const ICON_OPERADOR = 'img/icone-operario.png';

export const ICONES_AUTORIZACAO = {
  EMBARCACAO: ICON_EMBARCACAO,
  TERMINAL: ICON_TERMINAL,
  OPERADOR: ICON_OPERADOR,
} as const;

export type RegraModalidade = {
  icone?: string;
  norma?: string;
  idTipoInstalacaoPortuaria?: string;
  prefixoInstrumento?: string;
  forcarMapa?: boolean;
};

const RN_18 = 'RN 18';
const RN_13 = 'RN 13';
const NORMA_3274 = '3274';
const NORMA_1274 = '1274';
const NORMA_1558 = '1558';
const NORMA_912 = '912';

const textoSemAcento = (valor: string): string =>
  valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const normalizarModalidade = (modalidade?: string): string => {
  if (!modalidade) return '';
  return textoSemAcento(modalidade).replace(/\s+/g, ' ').trim();
};

export function removerAcentos(valor?: string): string {
  if (!valor) return '';
  return textoSemAcento(valor).toUpperCase();
}

export function obterRegraModalidade(modalidade?: string): RegraModalidade {
  const normalizada = normalizarModalidade(modalidade);
  if (!normalizada) {
    return { icone: ICON_TERMINAL, norma: NORMA_3274, forcarMapa: true };
  }

  if (normalizada.includes('travessia')) {
    return { icone: ICON_EMBARCACAO, norma: NORMA_1274 };
  }

  if (normalizada.includes('longitudinal de carga')) {
    return { icone: ICON_EMBARCACAO, norma: NORMA_1558 };
  }

  if (normalizada.includes('longitudinal de passageiros') || normalizada.includes('longitudinal misto')) {
    return { icone: ICON_EMBARCACAO, norma: NORMA_912 };
  }

  if (normalizada.includes('embarcacao em construcao')) {
    return { icone: ICON_EMBARCACAO, norma: RN_18 };
  }

  if (
    normalizada.includes('apoio maritimo') ||
    normalizada.includes('apoio portuario') ||
    normalizada.includes('cabotagem') ||
    normalizada.includes('longo curso')
  ) {
    return { icone: ICON_EMBARCACAO, norma: RN_18 };
  }

  if (normalizada.includes('afretamento')) {
    return { icone: ICON_TERMINAL, norma: RN_18, forcarMapa: true };
  }

  if (normalizada.includes('arrendamento')) {
    return { icone: ICON_TERMINAL, norma: NORMA_3274, idTipoInstalacaoPortuaria: '7', forcarMapa: true };
  }

  if (normalizada.includes('contrato de transicao')) {
    return { icone: ICON_TERMINAL, norma: NORMA_3274, idTipoInstalacaoPortuaria: '7', forcarMapa: true };
  }

  if (normalizada.includes('contrato de uso temporario')) {
    return { icone: ICON_TERMINAL, norma: NORMA_3274, idTipoInstalacaoPortuaria: '7', forcarMapa: true };
  }

  if (normalizada.includes('estacao de transbordo de cargas')) {
    return { icone: ICON_TERMINAL, norma: NORMA_3274, idTipoInstalacaoPortuaria: '3', forcarMapa: true };
  }

  if (normalizada.includes('instalacao portuaria de turismo')) {
    return { icone: ICON_TERMINAL, norma: NORMA_3274, idTipoInstalacaoPortuaria: '5', forcarMapa: true };
  }

  if (normalizada.includes('operador portuario')) {
    return { icone: ICON_OPERADOR, norma: NORMA_3274, idTipoInstalacaoPortuaria: '6', forcarMapa: true };
  }

  if (normalizada.includes('porto publico')) {
    return { icone: ICON_TERMINAL, norma: NORMA_3274, idTipoInstalacaoPortuaria: '1', forcarMapa: true };
  }

  if (normalizada.startsWith('registro - estaleiro ate')) {
    return { icone: ICON_TERMINAL, norma: RN_13, idTipoInstalacaoPortuaria: '1', prefixoInstrumento: 'TA - ', forcarMapa: true };
  }

  if (normalizada.startsWith('registro - estaleiro')) {
    return { icone: ICON_TERMINAL, norma: RN_13, idTipoInstalacaoPortuaria: '1', prefixoInstrumento: 'TA - ', forcarMapa: true };
  }

  if (normalizada.includes('registro - instalacao de apoio')) {
    return { icone: ICON_TERMINAL, norma: RN_13, idTipoInstalacaoPortuaria: '8', forcarMapa: true };
  }

  if (normalizada.includes('registro - instalacao portuaria publica de pequeno porte')) {
    return { icone: ICON_TERMINAL, norma: RN_13, idTipoInstalacaoPortuaria: '8', forcarMapa: true };
  }

  if (normalizada.includes('registro - instalacao para transferencia de petroleo')) {
    return { icone: ICON_TERMINAL, norma: RN_13, idTipoInstalacaoPortuaria: '1', forcarMapa: true };
  }

  if (normalizada.includes('registro - instalacao rudimentar')) {
    return { icone: ICON_TERMINAL, norma: RN_13, idTipoInstalacaoPortuaria: '1', forcarMapa: true };
  }

  if (normalizada.includes('registro - instalacao temporaria')) {
    return { icone: ICON_TERMINAL, norma: RN_13, idTipoInstalacaoPortuaria: '1', forcarMapa: true };
  }

  if (normalizada.includes('terminal de uso privado')) {
    return { icone: ICON_TERMINAL, norma: NORMA_3274, idTipoInstalacaoPortuaria: '2', forcarMapa: true };
  }

  return { icone: ICON_TERMINAL, norma: NORMA_3274, forcarMapa: true };
}

export function aplicarPrefixoInstrumento(valor: string, prefixo?: string): string {
  if (!valor || !prefixo) return valor;
  return valor.startsWith(prefixo) ? valor : `${prefixo}${valor}`;
}
