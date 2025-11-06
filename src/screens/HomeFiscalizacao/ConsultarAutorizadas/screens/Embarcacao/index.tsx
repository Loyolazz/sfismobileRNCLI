import React, { useCallback, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Pressable, Text, FlatList, Alert } from 'react-native';
import type { StyleProp, TextStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { consultarPorEmbarcacao, type Empresa } from '@/api/operations/consultarEmpresas';
import EmpresaCard from '../../../../../components/EmpresaCard';
import { formatImoCapitania, hasText } from '@/utils/formatters';
import type { ConsultarAutorizadasStackParamList } from '@/types/types';
import { navegarParaFluxo } from '../../utils/navegacaoFluxo';
import styles from './styles';

export default function Embarcacao() {
  const navigation = useNavigation<NativeStackNavigationProp<ConsultarAutorizadasStackParamList>>();
  const [registration, setRegistration] = useState('');
  const [vesselName, setVesselName] = useState('');
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
    if (!hasText(registration) && !hasText(vesselName)) {
      Alert.alert('Atenção', 'Preencha este campo!');
      return;
    }
    try {
      setLoading(true);
      const primary = hasText(registration) ? registration : vesselName;
      let result = await consultarPorEmbarcacao(primary);

      if (result.length === 0 && hasText(registration) && hasText(vesselName)) {
        result = await consultarPorEmbarcacao(vesselName);
      }

      setEmpresas(result);
      setSearchCompleted(true);
    } catch {
      Alert.alert('Erro', 'Não foi possível consultar empresas');
    } finally {
      setLoading(false);
    }
  }, [registration, vesselName]);

  const registrationInputStyles = useMemo<StyleProp<TextStyle>>(() => {
    if (hasText(registration)) {
      return [styles.input, styles.inputValid];
    }
    if (touched) {
      return [styles.input, styles.inputInvalid];
    }
    return styles.input;
  }, [registration, touched]);

  const nameInputStyles = useMemo<StyleProp<TextStyle>>(() => {
    if (hasText(vesselName)) {
      return [styles.input, styles.inputValid];
    }
    if (touched && !hasText(registration)) {
      return [styles.input, styles.inputInvalid];
    }
    return styles.input;
  }, [vesselName, touched, registration]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Text style={styles.title}>Informe a embarcação</Text>
      <TextInput
        value={registration}
        onChangeText={(text) => {
          setRegistration(formatImoCapitania(text));
          if (!touched && hasText(text)) {
            setTouched(true);
          }
        }}
        placeholder="IMO / Número Capitania"
        autoCapitalize="characters"
        autoCorrect={false}
        style={registrationInputStyles}
        editable={!loading}
      />
      <TextInput
        value={vesselName}
        onChangeText={(text) => {
          setVesselName(text);
          if (!touched && hasText(text)) {
            setTouched(true);
          }
        }}
        placeholder="Nome"
        autoCapitalize="characters"
        autoCorrect={false}
        style={nameInputStyles}
        editable={!loading}
      />
      <Pressable
        style={({ pressed }) => [
          styles.button,
          (pressed || loading) && styles.buttonPressed,
          !hasText(registration) && !hasText(vesselName) && styles.buttonDisabled,
        ]}
        onPress={handleSearch}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Pesquisando...' : 'Pesquisar'}</Text>
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
