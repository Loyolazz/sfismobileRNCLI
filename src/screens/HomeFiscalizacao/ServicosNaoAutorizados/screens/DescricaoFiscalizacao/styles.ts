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
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 12,
  },
  textarea: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    minHeight: 160,
    textAlignVertical: 'top',
  },
  contador: {
    marginTop: 6,
    color: theme.colors.textSecondary,
    textAlign: 'right',
  },
  acoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  acao: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: 8,
  },
  acaoTexto: {
    textAlign: 'center',
    color: theme.colors.text,
  },
  botao: {
    marginTop: 8,
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
