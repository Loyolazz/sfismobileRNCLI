import { StyleSheet } from 'react-native';

import theme from '@/theme';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  header: { padding: theme.spacing.md, gap: 4 },
  empresaTitulo: { ...theme.typography.heading },
  empresaSubtitulo: { ...theme.typography.body, color: theme.colors.muted },
  fonte: { ...theme.typography.caption, color: theme.colors.muted },
  mensagem: { ...theme.typography.caption, color: theme.colors.warning, paddingHorizontal: theme.spacing.md },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mapaWrapper: {
    flex: 1,
    margin: theme.spacing.md,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    backgroundColor: theme.colors.background,
  },
  webview: { flex: 1 },
  snapshotWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  snapshotImage: {
    width: '100%',
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
  },
  snapshotLegenda: { ...theme.typography.caption, color: theme.colors.muted, textAlign: 'center' },
  semCoordenadas: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  semCoordenadasTitulo: { ...theme.typography.heading, fontSize: 18 },
  semCoordenadasDescricao: { ...theme.typography.body, color: theme.colors.muted, textAlign: 'center' },
  snapshotLoader: {
    position: 'absolute',
    bottom: theme.spacing.sm,
    left: theme.spacing.sm,
    right: theme.spacing.sm,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  snapshotLoaderTexto: { ...theme.typography.caption, color: theme.colors.muted },
  actions: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  actionButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonPressed: { opacity: 0.85 },
  actionButtonDisabled: { opacity: 0.5 },
  actionButtonText: { ...theme.typography.button, color: theme.colors.surface, fontSize: 16 },
  actionHelper: {
    ...theme.typography.caption,
    color: theme.colors.error,
    textAlign: 'center',
  },
});

export default styles;
