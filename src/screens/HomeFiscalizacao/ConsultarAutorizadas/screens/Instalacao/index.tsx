import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Pressable, Text, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { consultarPorInstalacao, type Empresa } from '@/api/operations/consultarEmpresas';
import EmpresaCard from '../../../../../components/EmpresaCard';
import { hasText } from '@/utils/formatters';
import type { ConsultarAutorizadasStackParamList } from '@/types/types';
import styles from './styles';

export default function Instalacao() {
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
    if (!hasText(query)) {
      Alert.alert('Atenção', 'Informe o nome da instalação.');
      return;
    }
    try {
      setLoading(true);
      const result = await consultarPorInstalacao(query);
      setData(result);
      setPesquisaRealizada(true);
    } catch {
      Alert.alert('Erro', 'Não foi possível consultar empresas');
    } finally {
      setLoading(false);
    }
  }, [query]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Text style={styles.title}>Informe a instalação</Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Nome"
        autoCapitalize="characters"
        autoCorrect={false}
        style={styles.input}
        editable={!loading}
      />
      <Pressable
        style={({ pressed }) => [
          styles.button,
          (pressed || loading) && styles.buttonPressed,
          !hasText(query) && styles.buttonDisabled,
        ]}
        onPress={handleSearch}
        disabled={loading || !hasText(query)}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Pesquisando...' : 'Pesquisar'}
        </Text>
      </Pressable>
      <FlatList
        data={data}
        keyExtractor={(item, index) => `${item.NRInscricao}-${index}`}
        renderItem={renderItem}
        ListHeaderComponent={
          data.length > 0 ? (
            <Text style={styles.count}>
              {data.length === 1
                ? '1 empresa encontrada.'
                : `${data.length} empresas encontradas.`}
            </Text>
          ) : null
        }
        contentContainerStyle={
          data.length === 0 && pesquisaRealizada ? styles.emptyContainer : undefined
        }
        ListEmptyComponent={
          !loading && pesquisaRealizada ? (
            <Text style={styles.empty}>Nenhuma empresa encontrada.</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
