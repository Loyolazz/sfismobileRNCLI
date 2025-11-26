import React from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import theme from '@/theme';
import type { ServicosNaoAutorizadosStackParamList } from '../types';

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'ResultadoFiscalizacao'>;

export default function ResultadoFiscalizacao({ route, navigation }: Props) {
  const { prestador, area, instalacao, equipe, descricao, irregularidades } = route.params;

  const resumoArea = area.tipo === 'navegacao'
    ? `${area.transporte} - ${area.trechos.join(', ')}`
    : `${area.registro}${area.tup ? ` / ${area.tup}` : ''}`;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.md }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.text }}>
          Resultado da Fiscalização
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Prestador</Text>
          <Text style={styles.cardValue}>{prestador.razaoSocial}</Text>
          <Text style={styles.cardValue}>{prestador.documento}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Área</Text>
          <Text style={styles.cardValue}>{resumoArea}</Text>
          <Text style={styles.cardValue}>{instalacao.nome}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Equipe</Text>
          {equipe.length === 0 ? (
            <Text style={styles.cardValue}>Nenhum servidor selecionado</Text>
          ) : (
            equipe.map(member => (
              <Text key={member.id} style={styles.cardValue}>
                • {member.nome} ({member.funcao})
              </Text>
            ))
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Descrição</Text>
          <Text style={styles.cardValue}>{descricao || 'Não informada'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Irregularidades</Text>
          {irregularidades.length === 0 ? (
            <Text style={styles.cardValue}>Nenhuma irregularidade selecionada</Text>
          ) : (
            irregularidades.map(item => (
              <Text key={item.id} style={styles.cardValue}>
                • {item.descricao}
              </Text>
            ))
          )}
        </View>

        <Pressable
          onPress={() => navigation.navigate('Processo', { prestador, area, instalacao, equipe, descricao, irregularidades })}
          style={styles.secondaryButton}
        >
          <Text style={{ color: theme.colors.text, fontWeight: '700' }}>FINALIZAR SEM AUTO</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('AutoInfracao', { prestador, area, instalacao, equipe, descricao, irregularidades })}
          style={styles.primaryButton}
        >
          <Text style={{ color: theme.colors.surface, fontWeight: '700' }}>EMITIR AUTO</Text>
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
  cardTitle: { fontWeight: '700', color: theme.colors.text },
  cardValue: { color: theme.colors.text },
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
