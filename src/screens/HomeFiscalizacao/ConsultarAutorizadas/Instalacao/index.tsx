import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Pressable, Text, FlatList, StyleSheet, Alert } from 'react-native';
import theme from '@/theme';
import { consultarPorInstalacao, Empresa } from '@/api/consultarEmpresas';
import EmpresaCard from '../components/EmpresaCard';
import { hasText } from '@/utils/formatters';

export default function Instalacao() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!hasText(query)) {
      Alert.alert('Atenção', 'Informe o nome da instalação.');
      return;
    }
    try {
      setLoading(true);
      const result = await consultarPorInstalacao(query);
      setData(result);
    } catch {
      Alert.alert('Erro', 'Não foi possível consultar empresas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Text style={styles.label}>Informe a Instalação</Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Nome da instalação"
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
        <Text style={styles.buttonText}>{loading ? 'Pesquisando...' : 'Pesquisar'}</Text>
      </Pressable>
      <FlatList
        data={data}
        keyExtractor={(item, index) => `${item.NRInscricao}-${index}`}
        renderItem={({ item }) => <EmpresaCard empresa={item} />}
        ListHeaderComponent={
          data.length > 0 ? (
            <Text style={styles.count}>
              {data.length === 1 ? '1 empresa encontrada.' : `${data.length} empresas encontradas.`}
            </Text>
          ) : null
        }
        ListEmptyComponent={!loading ? (
          <Text style={styles.empty}>Nenhuma empresa encontrada.</Text>
        ) : null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.md, backgroundColor: theme.colors.surface },
  label: { marginBottom: theme.spacing.sm, color: theme.colors.text },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.muted,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  buttonPressed: { opacity: 0.85 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { ...theme.typography.button },
  empty: { textAlign: 'center', color: theme.colors.muted, marginTop: theme.spacing.md },
  count: { ...theme.typography.caption, color: theme.colors.muted, marginBottom: theme.spacing.sm },
});
