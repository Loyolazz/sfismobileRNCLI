import { StyleSheet } from 'react-native';

import theme from '@/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  botao: {
    backgroundColor: theme.colors.primaryDark,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
  },
  botaoPressed: {
    opacity: 0.85,
  },
  botaoTexto: {
    ...theme.typography.button,
    color: theme.colors.surface,
  },
});
