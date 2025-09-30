import React, { useState, useCallback, useMemo } from 'react';
import { Alert, FlatList, Pressable, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { buscarEmpresasAutorizadas, type Empresa } from '@/api/consultarEmpresas';
import EmpresaCard from '../../../../../components/EmpresaCard';
import { hasText } from '@/utils/formatters';
import type { ConsultarAutorizadasStackParamList } from '@/types/types';
import styles from './styles';

export default function CnpjRazao() {
  const navigation = useNavigation<NativeStackNavigationProp<ConsultarAutorizadasStackParamList>>();
  const [query, setQuery] = useState('');
  const [data, setData] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(false);
  const [pesquisaRealizada, setPesquisaRealizada] = useState(false);

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

  const handleSearch = useCallback(async () => {
    const q = query.trim();
    if (!hasText(q)) {
      Alert.alert('Atenção', 'Digite um CNPJ ou Razão Social.');
      return;
    }
    try {
      setLoading(true);
      const result = await buscarEmpresasAutorizadas(q);
      setData(Array.isArray(result) ? result : []);
      setPesquisaRealizada(true);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível consultar empresas.');
    } finally {
      setLoading(false);
    }
  }, [query]);

  const emptyListStyle = useMemo(
    () => (data.length === 0 && pesquisaRealizada ? styles.emptyList : undefined),
    [data.length, pesquisaRealizada],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Text style={styles.label}>Digite o CNPJ ou Razão Social</Text>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="CNPJ ou Razão Social"
        autoCapitalize="characters"
        autoCorrect={false}
        returnKeyType="search"
        onSubmitEditing={handleSearch}
        editable={!loading}
        style={styles.input}
      />

      <Pressable
        style={({ pressed }) => [
          styles.button,
          (pressed || loading) && styles.buttonPressed,
          !hasText(query) && styles.buttonDisabled,
        ]}
        onPress={handleSearch}
        disabled={loading || !hasText(query)}
        accessibilityRole="button"
        accessibilityLabel="Pesquisar empresas por CNPJ ou Razão Social"
      >
        <Text style={styles.buttonText}>{loading ? 'Pesquisando...' : 'Pesquisar'}</Text>
      </Pressable>

      <FlatList
        data={data}
        keyExtractor={(item, index) => `${item.NRInscricao}-${item.NRInstrumento ?? ''}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={emptyListStyle}
        ListEmptyComponent={
          !loading && pesquisaRealizada ? (
            <Text style={styles.empty}>Nenhuma empresa encontrada.</Text>
          ) : null
        }
        ListHeaderComponent={
          data.length > 0 ? (
            <Text style={styles.count}>
              {data.length === 1 ? '1 empresa encontrada.' : `${data.length} empresas encontradas.`}
            </Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
