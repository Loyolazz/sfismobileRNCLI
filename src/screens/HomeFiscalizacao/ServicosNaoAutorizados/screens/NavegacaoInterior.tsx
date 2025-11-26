import React, { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import theme from '@/theme';
import type { ServicosNaoAutorizadosStackParamList } from '../types';

const tiposTransporte = [
  'Transporte Regular de Passageiros',
  'Transporte de Cargas',
  'Transporte de Veículos',
];

const trechosPorTipo: Record<string, string[]> = {
  'Transporte Regular de Passageiros': ['Linha 112 - Centro / Ilha', 'Linha 208 - Ribeirinho', 'Linha 350 - Hidroviário'],
  'Transporte de Cargas': ['Trecho Industrial', 'Trecho Rio Negro'],
  'Transporte de Veículos': ['Travessia Principal', 'Travessia Alternativa'],
};

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'NavegacaoInterior'>;

export default function NavegacaoInterior({ navigation, route }: Props) {
  const { prestador } = route.params;
  const [tipoSelecionado, setTipoSelecionado] = useState<string>('Transporte Regular de Passageiros');
  const [trechoSelecionado, setTrechoSelecionado] = useState<string | null>(null);

  const trechos = useMemo(() => trechosPorTipo[tipoSelecionado] ?? [], [tipoSelecionado]);

  const handleProsseguir = () => {
    const area = {
      tipo: 'navegacao' as const,
      transporte: tipoSelecionado,
      trechos: trechoSelecionado ? [trechoSelecionado] : trechos,
    };
    navigation.navigate('CadastrarInstalacao', { prestador, area });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.md }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.text }}>
          Navegação Interior
        </Text>
        <Text style={{ color: theme.colors.muted }}>
          Informe o tipo de transporte e selecione o trecho/linha para seguir com a fiscalização.
        </Text>

        <View style={{ gap: theme.spacing.sm }}>
          {tiposTransporte.map(tipo => {
            const ativo = tipo === tipoSelecionado;
            return (
              <Pressable
                key={tipo}
                onPress={() => {
                  setTipoSelecionado(tipo);
                  setTrechoSelecionado(null);
                }}
                style={{
                  padding: theme.spacing.md,
                  borderRadius: theme.radius.md,
                  backgroundColor: ativo ? '#E5EEF6' : theme.colors.surface,
                  borderWidth: 1,
                  borderColor: ativo ? theme.colors.primary : '#E2E8F0',
                }}
              >
                <Text style={{ fontWeight: '700', color: theme.colors.text }}>{tipo}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={{ gap: theme.spacing.sm }}>
          <Text style={{ fontWeight: '700', color: theme.colors.text }}>Trechos / Linhas</Text>
          {trechos.map(trecho => {
            const ativo = trechoSelecionado ? trecho === trechoSelecionado : false;
            return (
              <Pressable
                key={trecho}
                onPress={() => setTrechoSelecionado(trecho)}
                style={{
                  padding: theme.spacing.md,
                  borderRadius: theme.radius.md,
                  backgroundColor: ativo ? theme.colors.primaryDark : theme.colors.surface,
                  borderWidth: 1,
                  borderColor: ativo ? theme.colors.primaryDark : '#E2E8F0',
                }}
              >
                <Text style={{ color: ativo ? theme.colors.surface : theme.colors.text, fontWeight: '600' }}>{trecho}</Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={handleProsseguir}
          style={{
            backgroundColor: theme.colors.primaryDark,
            paddingVertical: theme.spacing.md,
            borderRadius: theme.radius.md,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: theme.colors.surface, fontWeight: '700' }}>PROSSEGUIR</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
