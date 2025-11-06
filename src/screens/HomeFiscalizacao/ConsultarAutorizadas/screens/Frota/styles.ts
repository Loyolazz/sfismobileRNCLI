import { StyleSheet } from 'react-native';

import theme from '@/theme';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  listContent: { padding: theme.spacing.md, gap: theme.spacing.md, paddingBottom: theme.spacing.lg },
  header: { gap: theme.spacing.sm, marginBottom: theme.spacing.sm },
  title: { ...theme.typography.heading, textAlign: 'left' },
  subtitle: { ...theme.typography.body, color: theme.colors.muted },
  helper: { ...theme.typography.caption, color: theme.colors.muted },
  description: { ...theme.typography.body, color: theme.colors.muted },
  actionButton: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(11, 53, 86, 0.16)',
  },
  actionButtonPressed: { backgroundColor: 'rgba(11, 53, 86, 0.08)' },
  actionButtonDisabled: { opacity: 0.6 },
  actionButtonText: {
    ...theme.typography.button,
    color: theme.colors.primary,
    fontSize: 16,
    textTransform: 'uppercase',
  },
  actionHelper: { ...theme.typography.caption, color: theme.colors.error, textAlign: 'center' },
  card: {
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
  cardTitle: { ...theme.typography.body, fontWeight: '600' },
  cardLine: { ...theme.typography.body, color: theme.colors.muted },
  cardLabel: { fontWeight: '600', color: theme.colors.text },
  cardValue: { color: theme.colors.text },
  emptyContainer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: { ...theme.typography.caption, color: theme.colors.muted, textAlign: 'center', marginTop: theme.spacing.xs },
  errorText: { ...theme.typography.body, color: theme.colors.error, textAlign: 'center' },
  separator: { height: theme.spacing.md },
});

export default styles;
