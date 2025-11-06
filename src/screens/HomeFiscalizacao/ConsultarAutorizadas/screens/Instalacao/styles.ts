import { StyleSheet } from 'react-native';

import theme from '@/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  title: { marginBottom: theme.spacing.sm, ...theme.typography.heading },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.muted,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  inputValid: {
    borderColor: theme.colors.success,
  },
  inputInvalid: {
    borderColor: theme.colors.error,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    marginBottom: theme.spacing.md,

  },
  buttonPressed: { opacity: 0.85 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { ...theme.typography.button, color: theme.colors.surface, textTransform: 'uppercase' },
  emptyContainer: { flexGrow: 1 },
  empty: { textAlign: 'center', color: theme.colors.muted, marginTop: theme.spacing.md },
  count: { ...theme.typography.caption, color: theme.colors.muted, marginBottom: theme.spacing.sm },
  listContent: { paddingBottom: theme.spacing.lg, gap: theme.spacing.md },
  separator: { height: theme.spacing.md },
});

export default styles;
