import React from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import theme from '@/theme';
import { anexosPadrao } from '../mockData';
import type { ServicosNaoAutorizadosStackParamList } from '../types';

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'Processo'>;

export default function Processo({ route, navigation }: Props) {
  const { prestador, area, instalacao, equipe, descricao, irregularidades } = route.params;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.md }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.text }}>
          Processo
        </Text>

        <View style={styles.card}>
          <Text style={styles.title}>Fiscalização Registrada</Text>
          <Text style={styles.subtitle}>{prestador.razaoSocial}</Text>
          <Text style={styles.subtitle}>{instalacao.nome}</Text>
          <Text style={styles.subtitle}>
            Irregularidades: {irregularidades.length > 0 ? irregularidades.length : 'Nenhuma'}
          </Text>
          <Text style={styles.subtitle}>
            Equipe: {equipe.length > 0 ? `${equipe.length} servidor(es)` : 'Não informada'}
          </Text>
          <Text style={styles.subtitle}>
            Área: {area.tipo === 'navegacao' ? area.transporte : area.registro}
          </Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            Descrição: {descricao || 'Não informada'}
          </Text>
        </View>

        <Pressable
          onPress={() => navigation.navigate('ReenviarDocumentos', { anexos: anexosPadrao })}
          style={styles.primaryButton}
        >
          <Text style={{ color: theme.colors.surface, fontWeight: '700' }}>REENVIAR DOCUMENTOS</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  title: { fontWeight: '700', color: theme.colors.text },
  subtitle: { color: theme.colors.text },
  primaryButton: {
    backgroundColor: theme.colors.primaryDark,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
};
