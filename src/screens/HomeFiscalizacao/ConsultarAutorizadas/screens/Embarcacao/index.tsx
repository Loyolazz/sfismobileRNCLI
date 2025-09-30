import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Pressable, Text, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { consultarPorEmbarcacao, type Empresa } from '@/api/consultarEmpresas';
import EmpresaCard from '../../../../../components/EmpresaCard';
import { formatImoCapitania, hasText } from '@/utils/formatters';
import type { ConsultarAutorizadasStackParamList } from '@/types/types';
import styles from './styles';

export default function Embarcacao() {
  const navigation = useNavigation<NativeStackNavigationProp<ConsultarAutorizadasStackParamList>>();
  const [numero, setNumero] = useState('');
  const [nome, setNome] = useState('');
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
    if (!hasText(numero) && !hasText(nome)) {
      Alert.alert('Atenção', 'Informe ao menos um filtro para pesquisar.');
      return;
    }
    try {
      setLoading(true);
      const primary = hasText(numero) ? numero : nome;
      let result = await consultarPorEmbarcacao(primary);

      if (result.length === 0 && hasText(numero) && hasText(nome)) {
        result = await consultarPorEmbarcacao(nome);
      }

      setData(result);
      setPesquisaRealizada(true);
    } catch {
      Alert.alert('Erro', 'Não foi possível consultar empresas');
    } finally {
      setLoading(false);
    }
  }, [nome, numero]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Text style={styles.title}>Informe a embarcação</Text>
      <TextInput
        value={numero}
        onChangeText={(text) => setNumero(formatImoCapitania(text))}
        placeholder="IMO / Número Capitania"
        autoCapitalize="characters"
        autoCorrect={false}
        style={styles.input}
        editable={!loading}
      />
      <TextInput
        value={nome}
        onChangeText={setNome}
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
          !hasText(numero) && !hasText(nome) && styles.buttonDisabled,
        ]}
        onPress={handleSearch}
        disabled={loading || (!hasText(numero) && !hasText(nome))}
      >
        <Text style={styles.buttonText}>{loading ? 'Pesquisando...' : 'Pesquisar'}</Text>
      </Pressable>
      <FlatList
        data={data}
        keyExtractor={(item, index) => `${item.NRInscricao}-${index}`}
        renderItem={renderItem}
        ListHeaderComponent={
          data.length > 0 ? (
            <Text style={styles.count}>
              {data.length === 1 ? '1 empresa encontrada.' : `${data.length} empresas encontradas.`}
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
