import { StyleSheet } from 'react-native';

import theme from '@/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: theme.colors.text,
  },
  descricao: {
    color: theme.colors.text,
  },
  botao: {
    marginTop: 16,
    backgroundColor: theme.colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoPressed: {
    opacity: 0.9,
  },
  botaoTexto: {
    color: theme.colors.surface,
    fontWeight: '700',
  },
});
