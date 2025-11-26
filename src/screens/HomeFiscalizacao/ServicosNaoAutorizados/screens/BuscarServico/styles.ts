import { StyleSheet } from 'react-native';

import theme from '@/theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 16, gap: 10 },
  titulo: { fontSize: 16, color: theme.colors.text },
  label: { color: theme.colors.text, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
  },
  botao: {
    marginTop: 12,
    backgroundColor: theme.colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoPressed: { opacity: 0.85 },
  botaoTexto: { color: theme.colors.surface, fontWeight: '700' },
  filtros: { marginTop: 8, color: theme.colors.textSecondary },
});
