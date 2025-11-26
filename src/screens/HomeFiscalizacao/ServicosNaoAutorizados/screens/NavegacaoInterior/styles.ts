import { StyleSheet } from 'react-native';

import theme from '@/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: theme.colors.text,
  },
  botao: {
    marginTop: 24,
    backgroundColor: theme.colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoPressed: {
    opacity: 0.8,
  },
  botaoTexto: {
    color: theme.colors.surface,
    fontWeight: '700',
  },
  resumo: {
    marginTop: 12,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});
