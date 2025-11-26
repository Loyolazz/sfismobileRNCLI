import React, { useMemo } from 'react';
import { FlatList, Pressable, SafeAreaView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import theme from '@/theme';
import { filtroLabel, prestadoresBase } from '../mockData';
import type { Prestador, ServicosNaoAutorizadosStackParamList } from '../types';

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'ResultadoPesquisa'>;

export default function ResultadoPesquisa({ route, navigation }: Props) {
  const { filtro, termo, resultados } = route.params;

  const dados = useMemo<Prestador[]>(() => {
    if (resultados.length) {
      return resultados;
    }

    const termoNormalizado = termo.trim().toLowerCase();
    if (!termoNormalizado) {
      return [];
    }

    const fallback = prestadoresBase.filter(item =>
      item.razaoSocial.toLowerCase().includes(termoNormalizado),
    );

    return fallback;
  }, [resultados, termo]);

  const handleCadastrar = () => {
    navigation.navigate('CadastroPrestador', {
      onFinalizarCadastro: prestador => {
        navigation.replace('ResultadoPesquisa', {
          filtro,
          termo: prestador.razaoSocial,
          resultados: [prestador],
        });
      },
    });
  };

  const headerResumo = `${dados.length || resultados.length} localizada(s)`;

  const renderCard = ({ item }: { item: Prestador }) => (
    <Pressable
      onPress={() => navigation.navigate('AreaAtuacao', { prestador: item })}
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        gap: theme.spacing.xs,
        borderWidth: 1,
        borderColor: '#E2E8F0',
      }}
    >
      <Text style={{ fontWeight: '800', color: theme.colors.text }}>
        {item.razaoSocial.toUpperCase()}
      </Text>
      <Text style={{ fontWeight: '700', color: theme.colors.text }}>
        {`${item.documentoTipo === 'cnpj' ? 'CNPJ' : item.documentoTipo === 'cpf' ? 'CPF' : 'Doc'}: ${item.documento.toUpperCase()}`}
      </Text>
      <Text style={{ fontWeight: '700', color: theme.colors.text }}>
        Endereço: {item.endereco}
        {item.municipio ? ` - ${item.municipio}` : ''}
        {item.uf ? ` - ${item.uf}` : ''}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ padding: theme.spacing.lg, gap: theme.spacing.md, flex: 1 }}>
        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.text }}>
            {headerResumo}
          </Text>
          <Text style={{ color: theme.colors.muted }}>
            {`Filtro utilizado: ${filtroLabel[filtro]} - ${termo}`}
          </Text>
        </View>

        <Pressable
          onPress={handleCadastrar}
          style={{
            backgroundColor: theme.colors.primaryDark,
            paddingVertical: theme.spacing.sm,
            borderRadius: theme.radius.md,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: theme.colors.surface, fontWeight: '700' }}>Cadastrar</Text>
        </Pressable>

        {dados.length === 0 ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radius.md,
              padding: theme.spacing.lg,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.text }}>
              Nenhuma empresa localizada
            </Text>
            <Text style={{ color: theme.colors.muted, textAlign: 'center', marginTop: theme.spacing.sm }}>
              Revise os filtros utilizados ou cadastre um novo prestador para seguir com a fiscalização.
            </Text>
          </View>
        ) : (
          <FlatList
            data={dados}
            keyExtractor={item => item.id}
            renderItem={renderCard}
            ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sm }} />}
            contentContainerStyle={{ paddingBottom: theme.spacing.lg }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
