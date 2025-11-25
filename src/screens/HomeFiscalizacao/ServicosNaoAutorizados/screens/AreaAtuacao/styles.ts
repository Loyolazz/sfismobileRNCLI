import { StyleSheet } from 'react-native';

import theme from '@/theme';

const cardBase = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  padding: theme.spacing.md,
  backgroundColor: theme.colors.surface,
  borderRadius: theme.radius.sm,
  borderWidth: 1,
  borderColor: '#E0E6ED',
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  titulo: {
    ...theme.typography.heading,
    marginBottom: theme.spacing.md,
  },
  lista: {
    gap: theme.spacing.sm,
  },
  card: {
    ...cardBase,
  },
  cardPressed: {
    backgroundColor: '#F5F7FA',
  },
  cardTexto: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    ...theme.typography.body,
    fontWeight: '600',
  },
  cardIcon: {
    color: theme.colors.primaryDark,
  },
  trailingIcon: {
    marginLeft: theme.spacing.xs,
  },
});
