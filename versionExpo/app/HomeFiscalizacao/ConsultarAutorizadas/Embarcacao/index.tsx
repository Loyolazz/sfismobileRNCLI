import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, TextInput, Pressable, Text, FlatList, StyleSheet, Alert } from 'react-native';
import theme from '@/src/theme';
import { consultarPorEmbarcacao, Empresa } from '@/src/api/consultarEmpresas';

export default function Embarcacao() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const result = await consultarPorEmbarcacao(query);
      setData(result);
    } catch {
      Alert.alert('Erro', 'Não foi possível consultar empresas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Text style={styles.label}>Informe a Embarcação</Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Embarcação"
        style={styles.input}
      />
      <Pressable style={styles.button} onPress={handleSearch} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Pesquisando...' : 'Pesquisar'}</Text>
      </Pressable>
      <FlatList
        data={data}
        keyExtractor={(item, index) => `${item.NRInscricao}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.NORazaoSocial}</Text>
            <Text style={styles.itemSubtitle}>CNPJ: {item.NRInscricao}</Text>
          </View>
        )}
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
  buttonText: { ...theme.typography.button },
  item: { paddingVertical: theme.spacing.sm, borderBottomWidth: 1, borderBottomColor: theme.colors.background },
  itemTitle: { fontWeight: '600', color: theme.colors.text },
  itemSubtitle: { color: theme.colors.muted },
  empty: { textAlign: 'center', color: theme.colors.muted, marginTop: theme.spacing.md },
});
