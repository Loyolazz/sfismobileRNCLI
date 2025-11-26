import React from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import theme from '@/theme';
import type { ServicosNaoAutorizadosStackParamList } from '../types';

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'AreaAtuacao'>;

export default function AreaAtuacao({ route, navigation }: Props) {
  const { prestador } = route.params;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ padding: theme.spacing.lg, gap: theme.spacing.md, flex: 1 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.text }}>
          Selecione a área de atuação
        </Text>

        <Text style={{ color: theme.colors.muted }}>
          Prestador: {prestador.razaoSocial} • {prestador.documento}
        </Text>

        <View style={{ gap: theme.spacing.md }}>
          <Pressable
            onPress={() => navigation.navigate('NavegacaoInterior', { prestador })}
            style={styles.card}
          >
            <Text style={styles.cardTitle}>Navegação Interior</Text>
            <Text style={styles.cardSubtitle}>
              Selecione o tipo de transporte e os trechos/linhas para prosseguir.
            </Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('AreaPortuaria', { prestador })}
            style={styles.card}
          >
            <Text style={styles.cardTitle}>Área Portuária</Text>
            <Text style={styles.cardSubtitle}>
              Informe registro, TUP ou outras informações do terminal.
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: theme.spacing.xs,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
  cardSubtitle: { color: theme.colors.muted },
};
