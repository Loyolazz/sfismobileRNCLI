import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, SafeAreaView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import theme from '@/theme';
import { filtroLabel } from '../mockData';
import { buscarPrestadoresServico } from '../services';
import type { Prestador, ServicosNaoAutorizadosStackParamList } from '../types';

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'ResultadoPesquisa'>;

export default function ResultadoPesquisa({ route, navigation }: Props) {
  const { filtro, termo, resultados } = route.params;
  const [dados, setDados] = useState<Prestador[]>(resultados);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDados(resultados);
  }, [resultados]);

  useEffect(() => {
    let active = true;
    const termoPesquisa = termo.trim();
    if (resultados.length === 0 && termoPesquisa) {
      setLoading(true);
      buscarPrestadoresServico(filtro, termoPesquisa)
        .then(itens => {
          if (active) setDados(itens);
        })
        .catch(error => {
          console.warn('[ServicosNaoAutorizados] Falha ao refazer busca', error);
          Alert.alert('Erro', 'Não foi possível atualizar os resultados.');
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }

    return () => {
      active = false;
    };
  }, [filtro, resultados.length, termo]);

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

  const lista = dados.length ? dados : resultados;
  const headerResumo = `${lista.length} Prestadores encontrados.`;

  const renderCard = ({ item }: { item: Prestador }) => (
    <Pressable
      onPress={() => navigation.navigate('AreaAtuacao', { prestador: item })}
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.md,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        gap: theme.spacing.xs,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 1,
      }}
    >
      <Text style={{ fontWeight: '800', color: theme.colors.text, fontSize: 16 }}>
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.primaryDark }}>{headerResumo}</Text>
            <Text style={{ color: theme.colors.muted }}>{`Filtro utilizado: ${filtroLabel[filtro]} - ${termo}`}</Text>
          </View>

          <Pressable
            onPress={handleCadastrar}
            style={{
              backgroundColor: '#6CB6E3',
              paddingVertical: theme.spacing.sm,
              paddingHorizontal: theme.spacing.md,
              borderRadius: theme.radius.md,
            }}
          >
            <Text style={{ color: theme.colors.surface, fontWeight: '700' }}>CADASTRAR</Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={theme.colors.primaryDark} />
            <Text style={{ marginTop: theme.spacing.sm, color: theme.colors.muted }}>
              Buscando prestadores...
            </Text>
          </View>
        ) : lista.length === 0 ? (
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
            data={lista}
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
