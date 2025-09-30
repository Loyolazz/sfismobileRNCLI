import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import SelectField, { type SelectOption } from '@/components/SelectField';
import { consultarPorModalidade, type Empresa } from '@/api/consultarEmpresas';
import EmpresaCard from '../../../../../components/EmpresaCard';
import type { ConsultarAutorizadasStackParamList } from '@/types/types';
import {
  AREAS_DE_CONSULTA,
  normalizarBusca,
  type ModalidadeArea,
  type ModalidadeItem,
  type ModalidadeTipo,
} from '../../../../../utils/modalidades';
import styles from './styles';

export default function Modalidade(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<ConsultarAutorizadasStackParamList>>();
  const [areaSelecionada, setAreaSelecionada] = useState<ModalidadeArea | null>(null);
  const [tipoSelecionado, setTipoSelecionado] = useState<ModalidadeTipo | null>(null);
  const [modalidadeSelecionada, setModalidadeSelecionada] = useState<ModalidadeItem | null>(null);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(false);
  const [pesquisaRealizada, setPesquisaRealizada] = useState(false);

  const areaOptions = useMemo<Array<SelectOption<ModalidadeArea>>>(
    () => AREAS_DE_CONSULTA.map((area) => ({ label: area.label, value: area })),
    [],
  );

  const tipoOptions = useMemo<Array<SelectOption<ModalidadeTipo>>>(() => {
    if (!areaSelecionada) return [];
    return areaSelecionada.tipos.map((tipo) => ({ label: tipo.label, value: tipo }));
  }, [areaSelecionada]);

  const modalidadeOptions = useMemo<Array<SelectOption<ModalidadeItem>>>(() => {
    if (!tipoSelecionado) return [];
    return tipoSelecionado.modalidades.map((modalidade) => ({ label: modalidade.label, value: modalidade }));
  }, [tipoSelecionado]);

  const handleOpenEmpresa = useCallback(
    (empresa: Empresa) => {
      navigation.navigate('Detalhes', { empresa });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Empresa }) => (
      <EmpresaCard empresa={item} onPress={() => handleOpenEmpresa(item)} />
    ),
    [handleOpenEmpresa],
  );

  const handleSelectArea = useCallback((option: SelectOption<ModalidadeArea>) => {
    setAreaSelecionada(option.value);
    setTipoSelecionado(null);
    setModalidadeSelecionada(null);
    setEmpresas([]);
    setPesquisaRealizada(false);
  }, []);

  const handleSelectTipo = useCallback((option: SelectOption<ModalidadeTipo>) => {
    setTipoSelecionado(option.value);
    setModalidadeSelecionada(null);
    setEmpresas([]);
    setPesquisaRealizada(false);
  }, []);

  const handleSelectModalidade = useCallback((option: SelectOption<ModalidadeItem>) => {
    setModalidadeSelecionada(option.value);
    setEmpresas([]);
    setPesquisaRealizada(false);
  }, []);

  const handlePesquisar = useCallback(async () => {
    if (!modalidadeSelecionada) {
      Alert.alert('Atenção', 'Selecione uma modalidade para prosseguir.');
      return;
    }

    try {
      setLoading(true);
      const termo = normalizarBusca(modalidadeSelecionada);
      const resultado = await consultarPorModalidade(termo);
      setEmpresas(resultado);
      setPesquisaRealizada(true);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível consultar empresas.');
    } finally {
      setLoading(false);
    }
  }, [modalidadeSelecionada]);

  const headerMensagem = useMemo(() => {
    if (empresas.length === 0) return null;
    return empresas.length === 1
      ? '1 empresa encontrada.'
      : `${empresas.length} empresas encontradas.`;
  }, [empresas.length]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.formulario}>
        <Text style={styles.titulo}>Selecione a área de consulta.</Text>

        <SelectField
          label="Área"
          placeholder="Selecione"
          value={areaSelecionada ? { label: areaSelecionada.label, value: areaSelecionada } : undefined}
          options={areaOptions}
          onSelect={handleSelectArea}
          disabled={loading}
          testID="select-area"
        />

        <SelectField
          label="Tipo"
          placeholder={areaSelecionada ? 'Selecione' : 'Escolha a área primeiro'}
          value={tipoSelecionado ? { label: tipoSelecionado.label, value: tipoSelecionado } : undefined}
          options={tipoOptions}
          onSelect={handleSelectTipo}
          disabled={loading || !areaSelecionada}
          testID="select-tipo"
        />

        <SelectField
          label="Modalidade"
          placeholder={tipoSelecionado ? 'Selecione' : 'Escolha o tipo primeiro'}
          value={
            modalidadeSelecionada
              ? { label: modalidadeSelecionada.label, value: modalidadeSelecionada }
              : undefined
          }
          options={modalidadeOptions}
          onSelect={handleSelectModalidade}
          disabled={loading || !tipoSelecionado}
          testID="select-modalidade"
        />

        <Pressable
          style={({ pressed }) => [
            styles.botao,
            (pressed || loading) && styles.botaoPressionado,
            (!modalidadeSelecionada || loading) && styles.botaoDesabilitado,
          ]}
          onPress={handlePesquisar}
          disabled={loading || !modalidadeSelecionada}
          accessibilityRole="button"
          accessibilityLabel="Pesquisar empresas pela modalidade selecionada"
        >
          <Text style={styles.botaoTexto}>{loading ? 'Pesquisando...' : 'Pesquisar'}</Text>
        </Pressable>
      </View>

      <FlatList
        data={empresas}
        keyExtractor={(item, index) => `${item.NRInscricao}-${item.NRInstrumento ?? ''}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={
          empresas.length === 0 && pesquisaRealizada ? styles.listaVazia : undefined
        }
        ListHeaderComponent={headerMensagem ? <Text style={styles.contador}>{headerMensagem}</Text> : null}
        ListEmptyComponent={
          !loading && pesquisaRealizada ? (
            <Text style={styles.nenhumResultado}>Nenhuma empresa encontrada.</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
