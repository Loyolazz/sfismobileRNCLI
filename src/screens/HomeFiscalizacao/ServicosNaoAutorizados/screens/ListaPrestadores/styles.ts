import { StyleSheet } from 'react-native';

import theme from '@/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  resumo: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderColor: '#E0E6ED',
    backgroundColor: theme.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resumoTexto: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  botao: {
    backgroundColor: theme.colors.primaryDark,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
  },
  botaoPressed: { opacity: 0.85 },
  botaoTexto: { ...theme.typography.button, color: theme.colors.surface },
  lista: {
    padding: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#E0E6ED',
  },
  cardPressed: {
    backgroundColor: '#F5F7FA',
  },
  titulo: {
    ...theme.typography.heading,
    marginBottom: theme.spacing.xs,
    fontSize: 16,
  },
  descricao: {
    ...theme.typography.body,
    color: theme.colors.muted,
    marginTop: theme.spacing.xs / 2,
  },
  vazio: {
    ...theme.typography.body,
    textAlign: 'center',
    color: theme.colors.muted,
    marginTop: theme.spacing.lg,
  },
});
