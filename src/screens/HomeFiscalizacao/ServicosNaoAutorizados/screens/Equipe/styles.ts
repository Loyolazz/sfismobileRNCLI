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
    gap: 8,
    paddingBottom: 12,
  },
  item: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: theme.colors.surface,
  },
  itemSelecionado: {
    borderColor: theme.colors.primary,
    backgroundColor: '#eaf2ff',
  },
  itemNome: {
    fontWeight: '700',
    color: theme.colors.text,
  },
  itemCargo: {
    color: theme.colors.textSecondary,
  },
  badge: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    color: theme.colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
  },
  vazio: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
  botao: {
    marginTop: 12,
    backgroundColor: theme.colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoPressed: {
    opacity: 0.85,
  },
  botaoTexto: {
    color: theme.colors.surface,
    fontWeight: '700',
  },
});
