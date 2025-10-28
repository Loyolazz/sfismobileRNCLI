import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { Empresa } from '@/api/operations/consultarEmpresas';
import { mapearFluxoMigracao } from '@/utils/fluxo';
import type { ConsultarAutorizadasStackParamList } from '@/types/types';

export type ConsultarAutorizadasNavigation = NativeStackNavigationProp<
  ConsultarAutorizadasStackParamList
>;

export function navegarParaFluxo(
  navigation: ConsultarAutorizadasNavigation,
  empresa: Empresa,
): void {
  const fluxo = mapearFluxoMigracao(empresa);

  if (fluxo.tipo === 'MAPA') {
    navigation.navigate('Mapa', { empresa });
    return;
  }

  if (fluxo.tipo === 'FROTA' || fluxo.tipo === 'TRAVESSIA') {
    navigation.navigate('Frota', { empresa, fluxoTipo: fluxo.tipo });
    return;
  }

  navigation.navigate('Detalhes', { empresa });
}
