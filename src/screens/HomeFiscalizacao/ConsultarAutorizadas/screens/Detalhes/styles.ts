import { StyleSheet } from 'react-native';

import theme from '@/theme';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  content: { padding: theme.spacing.md, gap: theme.spacing.lg },
  header: { gap: 4 },
  title: { ...theme.typography.heading, textAlign: 'left' },
  subtitle: { ...theme.typography.body, color: theme.colors.muted },
  infoText: { ...theme.typography.body, color: theme.colors.muted },
  infoValue: { color: theme.colors.text },
  infoValueStrong: { fontWeight: '600' },
  section: { gap: theme.spacing.sm, backgroundColor: theme.colors.background, borderRadius: theme.radius.md, padding: theme.spacing.md },
  sectionTitle: { ...theme.typography.heading, fontSize: 18 },
  sectionSubtitle: { ...theme.typography.caption, color: theme.colors.muted },
  sectionDescription: { ...theme.typography.body, color: theme.colors.muted },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
  },
  badgeText: { ...theme.typography.button },
  stepRow: { flexDirection: 'row', gap: theme.spacing.sm },
  stepIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xs,
  },
  stepIndexText: { color: theme.colors.surface, fontWeight: '600' },
  stepBody: { flex: 1, gap: 4 },
  stepTitle: { ...theme.typography.body, fontWeight: '600' },
  stepDescription: { ...theme.typography.body, color: theme.colors.muted },
  stepReference: { ...theme.typography.caption, color: theme.colors.muted, fontStyle: 'italic' },
  mapButton: {
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
  },
  mapButtonPressed: { opacity: 0.85 },
  mapButtonText: { ...theme.typography.button },
  mapHelper: { ...theme.typography.caption, color: theme.colors.muted },
  actionButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
  },
  actionButtonPressed: { opacity: 0.85 },
  actionButtonText: { ...theme.typography.button },
  helperText: { ...theme.typography.caption, color: theme.colors.muted },
  extraInfo: { gap: 4 },
});

export default styles;
