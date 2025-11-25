import { StyleSheet } from 'react-native';

import theme from '@/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.muted,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.muted,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  colSmall: {
    flex: 0.45,
  },
  colBig: {
    flex: 0.55,
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
    ...theme.typography.button,
    color: theme.colors.surface,
  },
});
