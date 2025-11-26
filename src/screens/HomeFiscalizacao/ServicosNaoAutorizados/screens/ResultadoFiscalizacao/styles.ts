import { StyleSheet } from 'react-native';

import theme from '@/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  bloco: {
    padding: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  blocoTitulo: {
    fontWeight: '700',
    marginBottom: 6,
  },
  valor: {
    color: theme.colors.text,
    marginBottom: 2,
  },
  botao: {
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
  botaoSecundario: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoSecundarioPressed: {
    opacity: 0.9,
  },
  botaoSecundarioTexto: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
});
