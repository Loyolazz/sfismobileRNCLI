import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, SafeAreaView, Text, TextInput } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { consultarIrregularidades, type ConsultarIrregularidadesResult } from '@/api/operations';
import type { ServicosNaoAutorizadosStackParamList } from '@/types/types';

import styles from './styles';

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'Irregularidades'>;

type Irregularidade = ConsultarIrregularidadesResult['Irregularidade'][number];

export default function Irregularidades({ navigation, route }: Props) {
  const { areaAtuacao, descricao, equipe, instalacao, interior, prestador } = route.params;
  const [busca, setBusca] = useState('');
  const [lista, setLista] = useState<Irregularidade[]>([]);
  const [selecionadas, setSelecionadas] = useState<Irregularidade[]>([]);
  const [carregando, setCarregando] = useState(false);

  const carregarIrregularidades = useCallback(async () => {
    try {
      setCarregando(true);
      const resposta = await consultarIrregularidades({ norma: '' });
      const irregularidades = (resposta as ConsultarIrregularidadesResult | undefined)?.Irregularidade ?? [];
      setLista(irregularidades);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar irregularidades.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarIrregularidades();
  }, [carregarIrregularidades]);

  const filtradas = useMemo(() => {
    const termo = busca.toUpperCase();
    return lista.filter((item) => item.DSIrregularidade.toUpperCase().includes(termo));
  }, [busca, lista]);

  const alternarSelecao = useCallback(
    (item: Irregularidade) => {
      setSelecionadas((atual) => {
        const existe = atual.some((ir) => ir.IDIrregularidade === item.IDIrregularidade);
        if (existe) return atual.filter((ir) => ir.IDIrregularidade !== item.IDIrregularidade);
        return [...atual, item];
      });
    },
    [],
  );

  const handleConfirmar = useCallback(() => {
    if (selecionadas.length === 0) {
      Alert.alert('Atenção', 'Selecione ao menos uma irregularidade.');
      return;
    }

    navigation.navigate('ResultadoFiscalizacao', {
      prestador,
      areaAtuacao,
      interior,
      instalacao,
      equipe,
      descricao,
      irregularidades: selecionadas,
    });
  }, [areaAtuacao, descricao, equipe, instalacao, interior, navigation, prestador, selecionadas]);

  const renderItem = useCallback(
    ({ item }: { item: Irregularidade }) => {
      const marcado = selecionadas.some((ir) => ir.IDIrregularidade === item.IDIrregularidade);
      return (
        <Pressable
          style={({ pressed }) => [styles.card, (pressed || marcado) && styles.cardSelecionado]}
          onPress={() => alternarSelecao(item)}
        >
          <Text style={styles.cardTitulo}>{item.DSIrregularidade}</Text>
          {marcado ? <Text style={styles.badge}>Selecionada</Text> : null}
        </Pressable>
      );
    },
    [alternarSelecao, selecionadas],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <TextInput
        value={busca}
        onChangeText={setBusca}
        placeholder="Buscar irregularidade"
        style={styles.input}
        editable={!carregando}
      />

      <FlatList
        data={filtradas}
        keyExtractor={(item) => `${item.IDIrregularidade}`}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={<Text style={styles.vazio}>{carregando ? 'Carregando...' : 'Nenhum item'}</Text>}
      />

      <Pressable
        style={({ pressed }) => [styles.botao, pressed && styles.botaoPressed]}
        onPress={handleConfirmar}
        accessibilityRole="button"
      >
        <Text style={styles.botaoTexto}>CONFIRMAR</Text>
      </Pressable>
    </SafeAreaView>
  );
}
