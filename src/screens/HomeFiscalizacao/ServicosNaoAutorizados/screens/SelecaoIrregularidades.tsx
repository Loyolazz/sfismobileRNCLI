import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import theme from '@/theme';
import { irregularidades } from '../mockData';
import type { Irregularidade, ServicosNaoAutorizadosStackParamList } from '../types';

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'SelecaoIrregularidades'>;

export default function SelecaoIrregularidades({ route, navigation }: Props) {
  const { prestador, area, instalacao, equipe, descricao } = route.params;
  const [busca, setBusca] = useState('');
  const [selecionadas, setSelecionadas] = useState<Irregularidade[]>([]);

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return irregularidades;
    return irregularidades.filter(item => item.descricao.toLowerCase().includes(termo));
  }, [busca]);

  const toggle = (item: Irregularidade) => {
    setSelecionadas(prev => {
      if (prev.some(ir => ir.id === item.id)) {
        return prev.filter(ir => ir.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const confirmar = () => {
    navigation.navigate('ResultadoFiscalizacao', {
      prestador,
      area,
      instalacao,
      equipe,
      descricao,
      irregularidades: selecionadas,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ padding: theme.spacing.lg, gap: theme.spacing.md, flex: 1 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.text }}>
          Seleção de Irregularidades
        </Text>
        <Text style={{ color: theme.colors.muted }}>
          Pesquise e selecione as irregularidades encontradas.
        </Text>

        <TextInput
          placeholder="Buscar irregularidade"
          placeholderTextColor={theme.colors.muted}
          value={busca}
          onChangeText={setBusca}
          style={styles.input}
        />

        <FlatList
          data={filtradas}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            const ativo = selecionadas.some(ir => ir.id === item.id);
            return (
              <Pressable onPress={() => toggle(item)} style={[styles.card, ativo && styles.cardAtivo]}>
                <Text style={{ color: theme.colors.text }}>{item.descricao}</Text>
                <Text style={{ color: ativo ? theme.colors.primary : theme.colors.muted, marginTop: 4 }}>
                  {ativo ? 'Selecionada' : 'Tocar para selecionar'}
                </Text>
              </Pressable>
            );
          }}
          ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sm }} />}
          contentContainerStyle={{ paddingBottom: theme.spacing.lg }}
        />

        <Pressable
          onPress={confirmar}
          style={{
            backgroundColor: theme.colors.primaryDark,
            paddingVertical: theme.spacing.md,
            borderRadius: theme.radius.md,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: theme.colors.surface, fontWeight: '700' }}>CONFIRMAR</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    padding: theme.spacing.md,
    fontSize: 16,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardAtivo: { borderColor: theme.colors.primaryDark },
};
