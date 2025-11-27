import { StyleSheet } from 'react-native';

import theme from '@/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  scrollContent: {
    padding: theme.spacing.md,
    gap: theme.spacing.lg,
  },
  header: {
    gap: theme.spacing.xs,
  },
  title: {
    ...theme.typography.heading,
    textTransform: 'uppercase',
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.muted,
  },
  error: {
    color: theme.colors.error,
    fontWeight: '600',
  },
  loader: {
    paddingVertical: theme.spacing.lg,
  },
  section: {
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    ...theme.typography.heading,
    fontSize: 18,
  },
  card: {
    borderRadius: theme.radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.background,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.background,
  },
  infoText: {
    ...theme.typography.body,
    color: theme.colors.muted,
  },
  infoValue: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  empty: {
    ...theme.typography.body,
    textAlign: 'center',
    color: theme.colors.muted,
  },
});

export default styles;
