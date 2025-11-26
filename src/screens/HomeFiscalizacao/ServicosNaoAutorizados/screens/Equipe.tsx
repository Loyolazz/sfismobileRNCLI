import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import theme from '@/theme';
import { buscarServidoresFiscalizacao } from '../services';
import type { Servidor, ServicosNaoAutorizadosStackParamList } from '../types';

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'Equipe'>;

export default function Equipe({ route, navigation }: Props) {
  const { prestador, area, instalacao } = route.params;
  const [busca, setBusca] = useState('');
  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [selecionados, setSelecionados] = useState<Servidor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    buscarServidoresFiscalizacao()
      .then(lista => {
        if (active) setServidores(lista);
      })
      .catch(error => {
        console.warn('[ServicosNaoAutorizados] Falha ao carregar servidores', error);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) {
      return servidores;
    }
    return servidores.filter(s => s.nome.toLowerCase().includes(termo));
  }, [busca, servidores]);

  const toggle = (servidor: Servidor) => {
    setSelecionados(prev => {
      if (prev.some(item => item.id === servidor.id)) {
        return prev.filter(item => item.id !== servidor.id);
      }
      return [...prev, servidor];
    });
  };

  const prosseguir = () => {
    navigation.navigate('DescricaoFiscalizacao', {
      prestador,
      area,
      instalacao,
      equipe: selecionados,
    });
  };

  const renderItem = ({ item }: { item: Servidor }) => {
    const ativo = selecionados.some(s => s.id === item.id);
    return (
      <Pressable onPress={() => toggle(item)} style={[styles.card, ativo && styles.cardAtivo]}>
        <Text style={{ fontWeight: '700', color: theme.colors.text }}>{item.nome}</Text>
        <Text style={{ color: theme.colors.muted }}>{item.funcao}</Text>
        <Text style={{ color: ativo ? theme.colors.primary : theme.colors.muted, marginTop: 4 }}>
          {ativo ? 'Selecionado' : 'Tocar para incluir'}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ padding: theme.spacing.lg, gap: theme.spacing.md, flex: 1 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.text }}>Equipe</Text>
        <Text style={{ color: theme.colors.muted }}>
          Pesquise e selecione um ou mais servidores para compor a fiscalização.
        </Text>

        <TextInput
          placeholder="Buscar servidor"
        placeholderTextColor={theme.colors.muted}
        value={busca}
        onChangeText={setBusca}
        style={styles.input}
      />

        {loading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={theme.colors.primaryDark} />
            <Text style={{ marginTop: theme.spacing.sm, color: theme.colors.muted }}>
              Carregando servidores...
            </Text>
          </View>
        ) : (
          <FlatList
            data={filtrados}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sm }} />}
            ListEmptyComponent={
              <View
                style={{
                  padding: theme.spacing.lg,
                  alignItems: 'center',
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.radius.md,
                }}
              >
                <Text style={{ fontWeight: '700', color: theme.colors.text }}>
                  Nenhum servidor encontrado
                </Text>
                <Text style={{ color: theme.colors.muted, marginTop: theme.spacing.xs, textAlign: 'center' }}>
                  Ajuste a busca ou tente novamente mais tarde.
                </Text>
              </View>
            }
            contentContainerStyle={{ paddingBottom: theme.spacing.lg }}
          />
        )}

        <Pressable
          onPress={prosseguir}
          style={{
            backgroundColor: theme.colors.primaryDark,
            paddingVertical: theme.spacing.md,
            borderRadius: theme.radius.md,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: theme.colors.surface, fontWeight: '700' }}>PROSSEGUIR</Text>
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
  cardAtivo: {
    borderColor: theme.colors.primaryDark,
  },
};
