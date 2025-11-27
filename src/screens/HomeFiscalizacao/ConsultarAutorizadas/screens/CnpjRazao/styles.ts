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
  label: { marginBottom: theme.spacing.sm, ...theme.typography.heading },
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
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  buttonPressed: { opacity: 0.85 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { ...theme.typography.button, color: theme.colors.surface, textTransform: 'uppercase' },
  secondaryButton: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  secondaryButtonPressed: { backgroundColor: theme.colors.background },
  secondaryButtonText: { ...theme.typography.button, color: theme.colors.primary },
  emptyList: {
    flexGrow: 1,
  },
  listContent: { paddingBottom: theme.spacing.lg, gap: theme.spacing.md },
  empty: { textAlign: 'center', color: theme.colors.muted, marginTop: theme.spacing.lg },
  count: {
    ...theme.typography.caption,
    color: theme.colors.muted,
    marginBottom: theme.spacing.sm,
  },
  separator: { height: theme.spacing.md },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  modalCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    width: '100%',
    gap: theme.spacing.sm,
  },
  modalTitle: {
    ...theme.typography.heading,
    textAlign: 'center',
  },
  modalDescription: {
    ...theme.typography.body,
    color: theme.colors.muted,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  modalButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.sm,
  },
  modalButtonPressed: {
    opacity: 0.85,
  },
  modalButtonText: {
    ...theme.typography.button,
    color: theme.colors.surface,
  },
  modalButtonSecondary: {
    borderWidth: 1,
    borderColor: theme.colors.muted,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.sm,
  },
  modalButtonSecondaryPressed: {
    backgroundColor: theme.colors.background,
  },
  modalButtonSecondaryText: {
    ...theme.typography.button,
    color: theme.colors.muted,
  },
});

export default styles;
