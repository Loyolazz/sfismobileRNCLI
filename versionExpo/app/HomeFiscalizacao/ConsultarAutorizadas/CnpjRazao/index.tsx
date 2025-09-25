// app/(empresa)/CnpjRazao.tsx
import React, { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, TextInput, Pressable, Text, FlatList, StyleSheet, Alert } from 'react-native';
import theme from '@/src/theme';
import { buscarEmpresasAutorizadas, type Empresa } from '@/src/api/consultarEmpresas';

export default function CnpjRazao() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(false);

  const formatCnpj = (raw: string) => {
    const d = (raw ?? '').replace(/\D/g, '');
    if (d.length !== 14) return raw;
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
  };

  const formatDate = (raw?: string) => {
    if (!raw || raw.startsWith('01/01/1900')) return '';
    const [dd, mm, rest] = raw.split('/');
    const [yyyy] = (rest ?? '').split(' ');
    return `${dd}/${mm}/${yyyy}`;
  };

  const handleSearch = useCallback(async () => {
    const q = query.trim();
    if (!q) {
      Alert.alert('Atenção', 'Digite um CNPJ ou Razão Social.');
      return;
    }
    try {
      setLoading(true);
      const result = await buscarEmpresasAutorizadas(q);
      setData(Array.isArray(result) ? result : []);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível consultar empresas.');
    } finally {
      setLoading(false);
    }
  }, [query]);

  const Item = ({ item }: { item: Empresa }) => {
    const travessia = (item.Modalidade ?? '').toLowerCase().includes('travessia');
    return (
        <View style={styles.item}>
          <Text style={styles.itemTitle}>{item.NORazaoSocial}</Text>
          <Text style={styles.itemSubtitle}>
            CNPJ: {formatCnpj(item.NRInscricao)}
            {item.SGUF ? ` • ${item.SGUF}` : ''}
            {item.NOMunicipio ? ` - ${item.NOMunicipio}` : ''}
            {item.isAutoridadePortuaria ? ' • Autoridade Portuária' : ''}
          </Text>

          {!!item.DSEndereco && <Text style={styles.itemRow}>Endereço: <Text style={styles.bold}>{item.DSEndereco}</Text></Text>}
          {!!item.Modalidade && <Text style={styles.itemRow}>Modalidade: <Text style={styles.bold}>{item.Modalidade}</Text></Text>}
          {!!item.NRInstrumento && (
              <Text style={styles.itemRow}>
                {item.DescricaoNRInstrumento ? item.DescricaoNRInstrumento : `Instrumento: ${item.NRInstrumento}`}
              </Text>
          )}
          {!!formatDate(item.DTAditamento) && (
              <Text style={styles.itemRow}>Data Último Aditamento: <Text style={styles.bold}>{formatDate(item.DTAditamento)}</Text></Text>
          )}
          {!!item.NRAditamento && (
              <Text style={styles.itemRow}>Termo: <Text style={styles.bold}>{item.NRAditamento}</Text></Text>
          )}
          {typeof item.QTDEmbarcacao === 'number' && (
              <Text style={styles.itemRow}>Embarcações: <Text style={styles.bold}>{item.QTDEmbarcacao}</Text></Text>
          )}

          {!!item.Instalacao && (
              <Text style={styles.itemRow}>
                {travessia ? 'Travessia' : 'Instalação'}: <Text style={styles.bold}>{item.Instalacao}</Text>
              </Text>
          )}

          {!!item.NRInscricaoInstalacao && item.NRInscricaoInstalacao !== item.NRInscricao && (
              <Text style={styles.itemRow}>
                CNPJ Instalação: <Text style={styles.bold}>{formatCnpj(item.NRInscricaoInstalacao)}</Text>
              </Text>
          )}
          {!!item.NORazaoSocialInstalacao && item.NRInscricaoInstalacao !== item.NRInscricao && (
              <Text style={styles.itemRow}>
                Razão Social Instalação: <Text style={styles.bold}>{item.NORazaoSocialInstalacao}</Text>
              </Text>
          )}
        </View>
    );
  };

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
              !query.trim() && styles.buttonDisabled,
            ]}
            onPress={handleSearch}
            disabled={loading || !query.trim()}
            accessibilityRole="button"
            accessibilityLabel="Pesquisar empresas por CNPJ ou Razão Social"
        >
          <Text style={styles.buttonText}>{loading ? 'Pesquisando...' : 'Pesquisar'}</Text>
        </Pressable>

        <FlatList
            data={data}
            keyExtractor={(item, index) => `${item.NRInscricao}-${item.NRInstrumento ?? ''}-${index}`}
            renderItem={Item}
            contentContainerStyle={data.length === 0 ? { flexGrow: 1 } : undefined}
            ListEmptyComponent={!loading ? <Text style={styles.empty}>Nenhuma empresa encontrada.</Text> : null}
        />
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.md, backgroundColor: theme.colors.surface },
  label: { marginBottom: theme.spacing.sm, ...theme.typography.heading },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.muted,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  buttonPressed: { opacity: 0.85 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { ...theme.typography.button, color: theme.colors.surface },

  item: {
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.background,
    gap: 2,
  },
  itemTitle: { fontWeight: '600', color: theme.colors.text },
  itemSubtitle: { color: theme.colors.muted, marginBottom: 2 },
  itemRow: { color: theme.colors.muted, marginTop: 2 },
  bold: { color: theme.colors.text, fontWeight: '600' },
  empty: { textAlign: 'center', color: theme.colors.muted, marginTop: theme.spacing.lg },
});
