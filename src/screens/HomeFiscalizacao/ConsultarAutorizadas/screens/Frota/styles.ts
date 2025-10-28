import { StyleSheet } from 'react-native';

import theme from '@/theme';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  listContent: { padding: theme.spacing.md, gap: theme.spacing.md },
  header: { gap: 4, marginBottom: theme.spacing.sm },
  title: { ...theme.typography.heading, textAlign: 'left' },
  subtitle: { ...theme.typography.body, color: theme.colors.muted },
  helper: { ...theme.typography.caption, color: theme.colors.muted },
  description: { ...theme.typography.body, color: theme.colors.muted },
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
});

export default styles;
