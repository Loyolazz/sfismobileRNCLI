import { StyleSheet } from 'react-native';

import theme from '@/theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  cabecalho: { padding: 16 },
  total: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
  filtro: { marginTop: 4, color: theme.colors.textSecondary },
  lista: { padding: 16, gap: 10 },
  card: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  razao: { fontWeight: '800', color: theme.colors.text, marginBottom: 4 },
  documento: { fontWeight: '700', color: theme.colors.text },
  linha: { color: theme.colors.text },
  empty: { alignItems: 'center', gap: 8 },
  vazio: { color: theme.colors.textSecondary },
  botao: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  botaoPressed: { opacity: 0.85 },
  botaoTexto: { color: theme.colors.surface, fontWeight: '700' },
});
