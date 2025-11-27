import React from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import theme from '@/theme';
import type { ServicosNaoAutorizadosStackParamList } from '../types';

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'AreaAtuacao'>;

export default function AreaAtuacao({ route, navigation }: Props) {
  const { prestador } = route.params;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ padding: theme.spacing.lg, gap: theme.spacing.lg, flex: 1 }}>
        <View style={{ gap: theme.spacing.xs }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.text }}>
            Selecione a área de atuação.
          </Text>
          <Text style={{ color: theme.colors.muted }}>
            {prestador.razaoSocial} • {prestador.documento}
          </Text>
        </View>

        <View style={{ gap: theme.spacing.md }}>
          <Pressable onPress={() => navigation.navigate('NavegacaoInterior', { prestador })} style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
              <Icon name="ferry" size={32} color={theme.colors.primaryDark} />
              <Text style={styles.cardTitle}>Navegação Interior</Text>
            </View>
            <Icon name="chevron-right" size={24} color={theme.colors.muted} style={{ position: 'absolute', right: 16 }} />
          </Pressable>

          <Pressable onPress={() => navigation.navigate('AreaPortuaria', { prestador })} style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
              <Icon name="crane" size={32} color={theme.colors.primaryDark} />
              <Text style={styles.cardTitle}>Área Portuária</Text>
            </View>
            <Icon name="chevron-right" size={24} color={theme.colors.muted} style={{ position: 'absolute', right: 16 }} />
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
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: theme.spacing.sm,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
  cardSubtitle: { color: theme.colors.muted },
};
