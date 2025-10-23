import React, { useCallback, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Pressable, Text, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { consultarPorEmbarcacao, type Empresa } from '@/api/operations/consultarEmpresas';
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
  const [touched, setTouched] = useState(false);

  const handleOpenEmpresa = useCallback(
    (empresa: Empresa) => {
      navigation.navigate('Detalhes', { empresa });
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
    if (!hasText(numero) && !hasText(nome)) {
      Alert.alert('Atenção', 'Preencha este campo!');
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

  const numeroStyles = useMemo(() => {
    const base = [styles.input];
    if (hasText(numero)) {
      base.push(styles.inputValid);
    } else if (touched) {
      base.push(styles.inputInvalid);
    }
    return base;
  }, [numero, touched]);

  const nomeStyles = useMemo(() => {
    const base = [styles.input];
    if (hasText(nome)) {
      base.push(styles.inputValid);
    } else if (touched && !hasText(numero)) {
      base.push(styles.inputInvalid);
    }
    return base;
  }, [nome, touched, numero]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Text style={styles.title}>Informe a embarcação</Text>
      <TextInput
        value={numero}
        onChangeText={(text) => {
          setNumero(formatImoCapitania(text));
          if (!touched && hasText(text)) {
            setTouched(true);
          }
        }}
        placeholder="IMO / Número Capitania"
        autoCapitalize="characters"
        autoCorrect={false}
        style={numeroStyles}
        editable={!loading}
      />
      <TextInput
        value={nome}
        onChangeText={(text) => {
          setNome(text);
          if (!touched && hasText(text)) {
            setTouched(true);
          }
        }}
        placeholder="Nome"
        autoCapitalize="characters"
        autoCorrect={false}
        style={nomeStyles}
        editable={!loading}
      />
      <Pressable
        style={({ pressed }) => [
          styles.button,
          (pressed || loading) && styles.buttonPressed,
          !hasText(numero) && !hasText(nome) && styles.buttonDisabled,
        ]}
        onPress={handleSearch}
        disabled={loading}
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
