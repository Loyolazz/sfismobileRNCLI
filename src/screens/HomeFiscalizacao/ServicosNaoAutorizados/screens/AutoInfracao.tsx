import React from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import theme from '@/theme';
import { anexosPadrao } from '../mockData';
import type { ServicosNaoAutorizadosStackParamList } from '../types';

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'AutoInfracao'>;

export default function AutoInfracao({ route, navigation }: Props) {
  const { prestador, area, instalacao, equipe, descricao, irregularidades } = route.params;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.md }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.text }}>
          Auto de Infração Emitido
        </Text>

        <View style={styles.card}>
          <Text style={styles.title}>Auto Nº 2024/001</Text>
          <Text style={styles.subtitle}>Prestador: {prestador.razaoSocial}</Text>
          <Text style={styles.subtitle}>Instalação: {instalacao.nome}</Text>
          <Text style={styles.subtitle}>Irregularidades: {irregularidades.length || 'Nenhuma'} </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Documentos emitidos</Text>
          {anexosPadrao.map(item => (
            <Text key={item.id} style={styles.subtitle}>
              • {item.nome}
            </Text>
          ))}
        </View>

        <Pressable
          onPress={() => navigation.navigate('Processo', { prestador, area, instalacao, equipe, descricao, irregularidades })}
          style={styles.primaryButton}
        >
          <Text style={{ color: theme.colors.surface, fontWeight: '700' }}>VER PROCESSO</Text>
        </Pressable>

        <Pressable onPress={() => navigation.goBack()} style={styles.secondaryButton}>
          <Text style={{ color: theme.colors.text, fontWeight: '700' }}>VOLTAR</Text>
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
  secondaryButton: {
    backgroundColor: '#E2E8F0',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
};
