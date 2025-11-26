import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, SafeAreaView, Text, TextInput } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { listarServidores, type ListarServidoresResult } from '@/api/operations';
import type { ServicosNaoAutorizadosStackParamList } from '@/types/types';

import styles from './styles';

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'Equipe'>;

type Servidor = ListarServidoresResult['Servidor'][number];

export default function Equipe({ navigation, route }: Props) {
  const { areaAtuacao, instalacao, interior, prestador } = route.params;
  const [busca, setBusca] = useState('');
  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [selecionados, setSelecionados] = useState<Servidor[]>([]);
  const [carregando, setCarregando] = useState(false);

  const carregarServidores = useCallback(async () => {
    try {
      setCarregando(true);
      const resposta = await listarServidores();
      const lista = (resposta as ListarServidoresResult | undefined)?.Servidor ?? [];
      setServidores(lista);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar a equipe.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarServidores();
  }, [carregarServidores]);

  const filtrados = useMemo(() => {
    const termo = busca.toUpperCase();
    return servidores.filter((srv) => srv.NOUsuario.toUpperCase().includes(termo));
  }, [busca, servidores]);

  const alternarSelecao = useCallback(
    (item: Servidor) => {
      setSelecionados((atual) => {
        const existe = atual.some((srv) => srv.NRMatriculaServidor === item.NRMatriculaServidor);
        if (existe) return atual.filter((srv) => srv.NRMatriculaServidor !== item.NRMatriculaServidor);
        return [...atual, item];
      });
    },
    [],
  );

  const handleProsseguir = useCallback(() => {
    if (selecionados.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos um servidor.');
      return;
    }

    navigation.navigate('DescricaoFiscalizacao', {
      prestador,
      areaAtuacao,
      interior,
      instalacao,
      equipe: selecionados,
    });
  }, [areaAtuacao, instalacao, interior, navigation, prestador, selecionados]);

  const renderItem = useCallback(
    ({ item }: { item: Servidor }) => {
      const marcado = selecionados.some((srv) => srv.NRMatriculaServidor === item.NRMatriculaServidor);
      return (
        <Pressable
          style={({ pressed }) => [styles.item, (pressed || marcado) && styles.itemSelecionado]}
          onPress={() => alternarSelecao(item)}
        >
          <Text style={styles.itemNome}>{item.NOUsuario}</Text>
          <Text style={styles.itemCargo}>{item.NOCargo}</Text>
          {marcado ? <Text style={styles.badge}>Selecionado</Text> : null}
        </Pressable>
      );
    },
    [alternarSelecao, selecionados],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <TextInput
        value={busca}
        onChangeText={setBusca}
        placeholder="Buscar servidor"
        style={styles.input}
        editable={!carregando}
      />

      <FlatList
        data={filtrados}
        keyExtractor={(item) => `${item.NRMatriculaServidor}`}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={<Text style={styles.vazio}>{carregando ? 'Carregando...' : 'Nenhum servidor'}</Text>}
      />

      <Pressable
        style={({ pressed }) => [styles.botao, pressed && styles.botaoPressed]}
        onPress={handleProsseguir}
        accessibilityRole="button"
      >
        <Text style={styles.botaoTexto}>PROSSEGUIR</Text>
      </Pressable>
    </SafeAreaView>
  );
}
