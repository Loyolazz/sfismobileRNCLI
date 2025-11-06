import React, { useCallback, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Pressable, Text, FlatList, Alert } from 'react-native';
import type { StyleProp, TextStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { consultarPorInstalacao, type Empresa } from '@/api/operations/consultarEmpresas';
import EmpresaCard from '../../../../../components/EmpresaCard';
import { hasText } from '@/utils/formatters';
import type { ConsultarAutorizadasStackParamList } from '@/types/types';
import { navegarParaFluxo } from '../../utils/navegacaoFluxo';
import styles from './styles';

export default function Instalacao() {
  const navigation = useNavigation<NativeStackNavigationProp<ConsultarAutorizadasStackParamList>>();
  const [query, setQuery] = useState('');
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [touched, setTouched] = useState(false);

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

  const renderItem = useCallback(
    ({ item }: { item: Empresa }) => (
      <EmpresaCard
        empresa={item}
        onPress={() => handleOpenEmpresa(item)}
        onHistorico={() => handleOpenHistorico(item)}
      />
    ),
    [handleOpenEmpresa, handleOpenHistorico],
  );

  const handleSearch = useCallback(async () => {
    setTouched(true);
    if (!hasText(query)) {
      Alert.alert('Atenção', 'Preencha este campo!');
      return;
    }
    try {
      setLoading(true);
      const result = await consultarPorInstalacao(query);
      setEmpresas(result);
      setSearchCompleted(true);
    } catch {
      Alert.alert('Erro', 'Não foi possível consultar empresas');
    } finally {
      setLoading(false);
    }
  }, [query]);

  const inputStyles = useMemo<StyleProp<TextStyle>>(() => {
    if (hasText(query)) {
      return [styles.input, styles.inputValid];
    }
    if (touched) {
      return [styles.input, styles.inputInvalid];
    }
    return styles.input;
  }, [query, touched]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Text style={styles.title}>Informe a instalação</Text>
      <TextInput
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          if (!touched && hasText(text)) {
            setTouched(true);
          }
        }}
        placeholder="Nome"
        autoCapitalize="characters"
        autoCorrect={false}
        style={inputStyles}
        editable={!loading}
      />
      <Pressable
        style={({ pressed }) => [
          styles.button,
          (pressed || loading) && styles.buttonPressed,
          !hasText(query) && styles.buttonDisabled,
        ]}
        onPress={handleSearch}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Pesquisando...' : 'Pesquisar'}
        </Text>
      </Pressable>
      <FlatList
        data={empresas}
        keyExtractor={(item, index) => `${item.NRInscricao}-${index}`}
        renderItem={renderItem}
        ListHeaderComponent={
          empresas.length > 0 ? (
            <Text style={styles.count}>
              {empresas.length === 1
                ? '1 empresa encontrada.'
                : `${empresas.length} empresas encontradas.`}
            </Text>
          ) : null
        }
        contentContainerStyle={
          empresas.length === 0 && searchCompleted ? styles.emptyContainer : undefined
        }
        ListEmptyComponent={
          !loading && searchCompleted ? (
            <Text style={styles.empty}>Nenhuma empresa encontrada.</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
