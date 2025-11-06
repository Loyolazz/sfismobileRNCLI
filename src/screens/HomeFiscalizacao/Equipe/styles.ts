import { StyleSheet } from 'react-native';

import theme from '@/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.xs,
    shadowColor: '#0B3556',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cardTitle: { ...theme.typography.heading },
  cardSubtitle: { ...theme.typography.body, color: theme.colors.muted },
  cardInfo: { ...theme.typography.caption, color: theme.colors.muted },
  placeholder: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(11, 53, 86, 0.12)',
  },
  placeholderTitle: { ...theme.typography.heading, textAlign: 'center' },
  placeholderDescription: { ...theme.typography.body, color: theme.colors.muted, textAlign: 'center' },
  placeholderNote: { ...theme.typography.caption, color: theme.colors.muted, textAlign: 'center' },
});

export default styles;
