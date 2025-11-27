import { StyleSheet } from 'react-native';

import theme from '@/theme';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    backgroundColor: theme.colors.primaryDark,
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSpacer: { width: 24 },
  headerTitle: { ...theme.typography.heading, color: theme.colors.surface },
  list: { padding: theme.spacing.md },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: { marginRight: theme.spacing.sm, marginTop: 2 },
  cardContent: { flex: 1 },
  title: { ...theme.typography.body, fontWeight: '700', marginBottom: theme.spacing.xs, color: theme.colors.primaryDark },
  readTitle: { fontWeight: '400' },
  message: { ...theme.typography.body, color: theme.colors.text, marginBottom: theme.spacing.xs },
  date: { ...theme.typography.caption, color: theme.colors.muted, textAlign: 'right' },
});

export default styles;
