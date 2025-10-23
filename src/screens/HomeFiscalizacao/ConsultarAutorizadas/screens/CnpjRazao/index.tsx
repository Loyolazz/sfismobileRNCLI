import React, { useState, useCallback, useMemo } from 'react';
import { Alert, FlatList, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { buscarEmpresasAutorizadas, type Empresa } from '@/api/operations/consultarEmpresas';
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
  const [touched, setTouched] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrValue, setQrValue] = useState('');

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
    const q = query.trim();
    setTouched(true);
    if (!hasText(q)) {
      Alert.alert('Atenção', 'Preencha este campo!');
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

  const inputStyles = useMemo(() => {
    const base = [styles.input];
    if (hasText(query)) {
      base.push(styles.inputValid);
    } else if (touched) {
      base.push(styles.inputInvalid);
    }
    return base;
  }, [query, touched]);

  const handleOpenQrModal = useCallback(() => {
    setQrValue('');
    setQrModalVisible(true);
  }, []);

  const handleCloseQrModal = useCallback(() => {
    setQrModalVisible(false);
    setQrValue('');
  }, []);

  const handleConfirmQr = useCallback(() => {
    const value = qrValue.trim();
    if (!hasText(value)) {
      Alert.alert('Atenção', 'Preencha este campo!');
      return;
    }
    setQuery(value.toUpperCase().slice(0, 35));
    setTouched(true);
    setQrModalVisible(false);
  }, [qrValue]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Text style={styles.label}>Digite o CNPJ ou Razão Social</Text>

      <TextInput
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          if (!touched && hasText(text)) {
            setTouched(true);
          }
        }}
        placeholder="CNPJ ou Razão Social"
        autoCapitalize="characters"
        autoCorrect={false}
        returnKeyType="search"
        onSubmitEditing={handleSearch}
        editable={!loading}
        style={inputStyles}
      />

      <Pressable
        style={({ pressed }) => [
          styles.button,
          (pressed || loading) && styles.buttonPressed,
          !hasText(query) && styles.buttonDisabled,
        ]}
        onPress={handleSearch}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel="Pesquisar empresas por CNPJ ou Razão Social"
      >
        <Text style={styles.buttonText}>{loading ? 'Pesquisando...' : 'Pesquisar'}</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}
        onPress={handleOpenQrModal}
        accessibilityRole="button"
        accessibilityLabel="Informar empresa via QRCode"
      >
        <Text style={styles.secondaryButtonText}>Prefiro informar o QRCode</Text>
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

      <Modal visible={qrModalVisible} transparent animationType="fade" onRequestClose={handleCloseQrModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Ler QRCode manualmente</Text>
            <Text style={styles.modalDescription}>
              Informe o valor contido no QRCode para preencher a pesquisa automaticamente.
            </Text>
            <TextInput
              value={qrValue}
              onChangeText={setQrValue}
              placeholder="Código do QRCode"
              autoCapitalize="characters"
              autoCorrect={false}
              style={[styles.input, hasText(qrValue) ? styles.inputValid : styles.inputInvalid]}
            />
            <View style={styles.modalActions}>
              <Pressable
                style={({ pressed }) => [styles.modalButtonSecondary, pressed && styles.modalButtonSecondaryPressed]}
                onPress={handleCloseQrModal}
                accessibilityRole="button"
                accessibilityLabel="Cancelar leitura de QRCode"
              >
                <Text style={styles.modalButtonSecondaryText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.modalButton, pressed && styles.modalButtonPressed]}
                onPress={handleConfirmQr}
                accessibilityRole="button"
                accessibilityLabel="Confirmar valor do QRCode"
              >
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
