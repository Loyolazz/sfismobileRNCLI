import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, SafeAreaView, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  listarTipoTransporte,
  type ListarTipoTransporteResult,
  listarTrechoLinhaTipoTransporte,
  type ListarTrechoLinhaTipoTransporteResult,
} from '@/api/operations';
import SelectField, { type SelectOption } from '@/components/SelectField';
import type { ServicosNaoAutorizadosStackParamList } from '@/types/types';

import styles from './styles';

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'NavegacaoInterior'>;

type TipoTransporteOption = SelectOption<number>;
type TrechoOption = SelectOption<number>;

export default function NavegacaoInterior({ navigation, route }: Props) {
  const { prestador } = route.params;
  const [tiposTransporte, setTiposTransporte] = useState<TipoTransporteOption[]>([]);
  const [trechos, setTrechos] = useState<TrechoOption[]>([]);
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoTransporteOption | undefined>();
  const [trechoSelecionado, setTrechoSelecionado] = useState<TrechoOption | undefined>();
  const [carregandoTipos, setCarregandoTipos] = useState(false);
  const [carregandoTrechos, setCarregandoTrechos] = useState(false);

  const carregarTipos = useCallback(async () => {
    try {
      setCarregandoTipos(true);
      const resposta = await listarTipoTransporte();
      const lista = (resposta as ListarTipoTransporteResult | undefined)?.TipoTransporte ?? [];
      setTiposTransporte(lista.map((item) => ({ label: item.DSTipoTransporte, value: item.IDTipoTransporte })));
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar os tipos de transporte.');
    } finally {
      setCarregandoTipos(false);
    }
  }, []);

  const carregarTrechos = useCallback(
    async (tipo?: TipoTransporteOption) => {
      if (!tipo) return;
      try {
        setCarregandoTrechos(true);
        const resposta = await listarTrechoLinhaTipoTransporte();
        const lista =
          (resposta as ListarTrechoLinhaTipoTransporteResult | undefined)?.TrechoLinhaTipoTransporteListar ?? [];
        const trechosFiltrados = lista.filter((item) => item.IDTipoTransporte === tipo.value);
        setTrechos(
          trechosFiltrados.map<TrechoOption>((item) => ({
            label: `${item.Modalidade} - ${item.Instalacao}`,
            value: item.IDTrechoLinha,
          })),
        );
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Não foi possível carregar trechos para o tipo selecionado.');
      } finally {
        setCarregandoTrechos(false);
      }
    },
    [],
  );

  useEffect(() => {
    carregarTipos();
  }, [carregarTipos]);

  useEffect(() => {
    setTrechoSelecionado(undefined);
    carregarTrechos(tipoSelecionado);
  }, [carregarTrechos, tipoSelecionado]);

  const descricaoSelecionados = useMemo(() => {
    if (!tipoSelecionado || !trechoSelecionado) return '';
    return `${tipoSelecionado.label} - ${trechoSelecionado.label}`;
  }, [tipoSelecionado, trechoSelecionado]);

  const handleProsseguir = useCallback(() => {
    if (!tipoSelecionado || !trechoSelecionado) {
      Alert.alert('Atenção', 'Selecione o tipo de transporte e o trecho.');
      return;
    }

    navigation.navigate('Instalacao', {
      prestador,
      areaAtuacao: { tipo: 'interior', descricao: 'Navegação Interior' },
      interior: {
        tipoTransporte: tipoSelecionado.value,
        trechoLinha: trechoSelecionado.value,
        descricao: descricaoSelecionados,
      },
    });
  }, [descricaoSelecionados, navigation, prestador, tipoSelecionado, trechoSelecionado]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Text style={styles.titulo}>Selecione o tipo de transporte e o trecho.</Text>

      <SelectField
        label={carregandoTipos ? 'Carregando tipos...' : 'Tipos de Transporte'}
        value={tipoSelecionado}
        options={tiposTransporte}
        onSelect={setTipoSelecionado}
        disabled={carregandoTipos}
      />

      <SelectField
        label={carregandoTrechos ? 'Carregando trechos...' : 'Trechos/Linhas'}
        value={trechoSelecionado}
        options={trechos}
        onSelect={setTrechoSelecionado}
        disabled={carregandoTrechos || !tipoSelecionado}
      />

      <Pressable
        style={({ pressed }) => [styles.botao, pressed && styles.botaoPressed]}
        onPress={handleProsseguir}
        accessibilityRole="button"
        accessibilityLabel="Prosseguir para instalação"
      >
        <Text style={styles.botaoTexto}>PROSSEGUIR</Text>
      </Pressable>

      {descricaoSelecionados ? <Text style={styles.resumo}>{descricaoSelecionados}</Text> : null}
    </SafeAreaView>
  );
}
