import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo } from 'react';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

import { formatCnpj } from '@/utils/formatters';
import type { DrawerParamList } from '@/types/types';

import styles from './styles';

type EquipeRouteProp = RouteProp<DrawerParamList, 'Equipe'>;

export default function Equipe(): React.JSX.Element {
  const route = useRoute<EquipeRouteProp>();
  const empresa = useMemo(() => route.params?.empresa, [route.params?.empresa]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      {empresa ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{empresa.NORazaoSocial}</Text>
          <Text style={styles.cardSubtitle}>{`CNPJ ${formatCnpj(empresa.NRInscricao)}`}</Text>
          {empresa.Modalidade ? <Text style={styles.cardInfo}>{empresa.Modalidade}</Text> : null}
          {empresa.Instalacao ? <Text style={styles.cardInfo}>{empresa.Instalacao}</Text> : null}
          {empresa.NOMunicipio || empresa.SGUF ? (
            <Text style={styles.cardInfo}>
              {[empresa.NOMunicipio, empresa.SGUF].filter(Boolean).join(' • ')}
            </Text>
          ) : null}
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Equipe de fiscalização</Text>
          <Text style={styles.cardInfo}>
            Selecione uma empresa autorizada para visualizar os detalhes vinculados.
          </Text>
        </View>
      )}

      <View style={styles.placeholder}>
        <Text style={styles.placeholderTitle}>Tela em desenvolvimento</Text>
        <Text style={styles.placeholderDescription}>
          Em breve será possível selecionar a equipe de fiscalização e os servidores responsáveis diretamente pelo aplicativo.
        </Text>
        <Text style={styles.placeholderNote}>
          Enquanto isso, utilize o sistema legado para definir a equipe vinculada à fiscalização.
        </Text>
      </View>
    </SafeAreaView>
  );
}
