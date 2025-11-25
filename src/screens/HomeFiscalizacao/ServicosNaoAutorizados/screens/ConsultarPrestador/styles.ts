import { StyleSheet } from 'react-native';

import theme from '@/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  titulo: {
    ...theme.typography.heading,
    marginBottom: theme.spacing.lg,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.muted,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.muted,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  botao: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.primaryDark,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
  },
  botaoPressed: {
    opacity: 0.85,
  },
  botaoTexto: {
    color: theme.colors.surface,
    ...theme.typography.button,
  },
  helper: {
    marginTop: theme.spacing.md,
  },
  helperTexto: {
    ...theme.typography.caption,
    color: theme.colors.muted,
  },
});
