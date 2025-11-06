import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import SelectField, { type SelectOption } from '@/components/SelectField';
import { consultarPorModalidade, type Empresa } from '@/api/operations/consultarEmpresas';
import EmpresaCard from '../../../../../components/EmpresaCard';
import type { ConsultarAutorizadasStackParamList } from '@/types/types';
import { navegarParaFluxo } from '../../utils/navegacaoFluxo';
import {
  AREAS_DE_CONSULTA,
  normalizarBusca,
  type ModalidadeArea,
  type ModalidadeItem,
  type ModalidadeTipo,
} from '../../../../../utils/modalidades';
import styles from './styles';
import { mensagemBloqueioNavegacaoMaritima } from '@/utils/empresas';

export default function Modalidade(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<ConsultarAutorizadasStackParamList>>();
  const [selectedArea, setSelectedArea] = useState<ModalidadeArea | null>(null);
  const [selectedType, setSelectedType] = useState<ModalidadeTipo | null>(null);
  const [selectedModality, setSelectedModality] = useState<ModalidadeItem | null>(null);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchCompleted, setSearchCompleted] = useState(false);

  const areaOptions = useMemo<Array<SelectOption<ModalidadeArea>>>(
    () => AREAS_DE_CONSULTA.map((area) => ({ label: area.label, value: area })),
    [],
  );

  const typeOptions = useMemo<Array<SelectOption<ModalidadeTipo>>>(() => {
    if (!selectedArea) return [];
    return selectedArea.tipos.map((type) => ({ label: type.label, value: type }));
  }, [selectedArea]);

  const modalityOptions = useMemo<Array<SelectOption<ModalidadeItem>>>(() => {
    if (!selectedType) return [];
    return selectedType.modalidades.map((modality) => ({ label: modality.label, value: modality }));
  }, [selectedType]);

  const handleOpenEmpresa = useCallback(
    (empresa: Empresa) => {
      navegarParaFluxo(navigation, empresa);
    },
    [navigation],
  );

  const handleOpenHistorico = useCallback(
    (empresa: Empresa) => {
      navigation.navigate('Historico', { empresa });
    },
    [navigation],
  );

  const bloqueioMaritimo = useMemo(
    () => selectedArea?.id === 'navegacao' && selectedType?.id === 'maritima',
    [selectedArea, selectedType],
  );

  const renderItem = useCallback(
    ({ item }: { item: Empresa }) => (
      <EmpresaCard
        empresa={item}
        onPress={
          bloqueioMaritimo ? undefined : () => handleOpenEmpresa(item)
        }
        onHistorico={
          bloqueioMaritimo ? undefined : () => handleOpenHistorico(item)
        }
      />
    ),
    [bloqueioMaritimo, handleOpenEmpresa, handleOpenHistorico],
  );

  const handleSelectArea = useCallback((option: SelectOption<ModalidadeArea>) => {
    setSelectedArea(option.value);
    setSelectedType(null);
    setSelectedModality(null);
    setEmpresas([]);
    setSearchCompleted(false);
  }, []);

  const handleSelectType = useCallback((option: SelectOption<ModalidadeTipo>) => {
    setSelectedType(option.value);
    setSelectedModality(null);
    setEmpresas([]);
    setSearchCompleted(false);
  }, []);

  const handleSelectModality = useCallback((option: SelectOption<ModalidadeItem>) => {
    setSelectedModality(option.value);
    setEmpresas([]);
    setSearchCompleted(false);
  }, []);

  const handleSearch = useCallback(async () => {
    if (!selectedModality) {
      Alert.alert('Atenção', 'Selecione uma modalidade para prosseguir.');
      return;
    }

    try {
      setLoading(true);
      const normalizedTerm = normalizarBusca(selectedModality);
      const result = await consultarPorModalidade(normalizedTerm);
      setEmpresas(result);
      setSearchCompleted(true);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível consultar empresas.');
    } finally {
      setLoading(false);
    }
  }, [selectedModality]);

  const headerMessage = useMemo(() => {
    if (empresas.length === 0) return null;
    return empresas.length === 1
      ? '1 empresa encontrada.'
      : `${empresas.length} empresas encontradas.`;
  }, [empresas.length]);

  const bloqueioMensagem = useMemo(() => {
    if (!bloqueioMaritimo) return null;
    return `${mensagemBloqueioNavegacaoMaritima} Consulte o sistema legado.`;
  }, [bloqueioMaritimo]);

  const renderHeader = useCallback(() => {
    if (!headerMessage && !bloqueioMensagem) {
      return null;
    }
    return (
      <View style={styles.headerLista}>
        {bloqueioMensagem ? <Text style={styles.alerta}>{bloqueioMensagem}</Text> : null}
        {headerMessage ? <Text style={styles.contador}>{headerMessage}</Text> : null}
      </View>
    );
  }, [bloqueioMensagem, headerMessage]);

  const renderSeparator = useCallback(() => <View style={styles.separator} />, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.formulario}>
        <Text style={styles.titulo}>Selecione a área de consulta.</Text>

        <SelectField
          label="Área"
          placeholder="Selecione"
          value={selectedArea ? { label: selectedArea.label, value: selectedArea } : undefined}
          options={areaOptions}
          onSelect={handleSelectArea}
          disabled={loading}
          testID="select-area"
        />

        <SelectField
          label="Tipo"
          placeholder={selectedArea ? 'Selecione' : 'Escolha a área primeiro'}
          value={selectedType ? { label: selectedType.label, value: selectedType } : undefined}
          options={typeOptions}
          onSelect={handleSelectType}
          disabled={loading || !selectedArea}
          testID="select-tipo"
        />

        <SelectField
          label="Modalidade"
          placeholder={selectedType ? 'Selecione' : 'Escolha o tipo primeiro'}
          value={
            selectedModality
              ? { label: selectedModality.label, value: selectedModality }
              : undefined
          }
          options={modalityOptions}
          onSelect={handleSelectModality}
          disabled={loading || !selectedType}
          testID="select-modalidade"
        />

        <Pressable
          style={({ pressed }) => [
            styles.botao,
            (pressed || loading) && styles.botaoPressionado,
            (!selectedModality || loading) && styles.botaoDesabilitado,
          ]}
          onPress={handleSearch}
          disabled={loading || !selectedModality}
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
        contentContainerStyle={[
          styles.listContent,
          empresas.length === 0 && searchCompleted ? styles.listaVazia : null,
        ]}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          !loading && searchCompleted ? (
            <Text style={styles.nenhumResultado}>Nenhuma empresa encontrada.</Text>
          ) : null
        }
        ItemSeparatorComponent={renderSeparator}
      />
    </SafeAreaView>
  );
}
