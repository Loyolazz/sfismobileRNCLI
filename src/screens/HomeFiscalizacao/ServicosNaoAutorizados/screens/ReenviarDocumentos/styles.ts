import { StyleSheet } from 'react-native';

import theme from '@/theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 16 },
  cabecalho: { marginBottom: 12 },
  titulo: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
  subtitulo: { color: theme.colors.textSecondary },
  lista: { gap: 8 },
  item: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  itemSelecionado: { borderColor: theme.colors.primary, backgroundColor: '#eef5ff' },
  itemTitulo: { fontWeight: '700', color: theme.colors.text },
  itemDescricao: { color: theme.colors.textSecondary },
  vazio: { textAlign: 'center', color: theme.colors.textSecondary },
  botao: {
    marginTop: 14,
    backgroundColor: theme.colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoPressed: { opacity: 0.9 },
  botaoTexto: { color: theme.colors.surface, fontWeight: '700' },
});
