import { StyleSheet } from 'react-native';

import theme from '@/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  lista: {
    gap: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: theme.colors.surface,
  },
  cardSelecionado: {
    borderColor: theme.colors.primary,
    backgroundColor: '#eef5ff',
  },
  cardTitulo: {
    fontWeight: '700',
    color: theme.colors.text,
  },
  badge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    color: theme.colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
  },
  vazio: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
  botao: {
    marginTop: 14,
    backgroundColor: theme.colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoPressed: { opacity: 0.85 },
  botaoTexto: { color: theme.colors.surface, fontWeight: '700' },
});
