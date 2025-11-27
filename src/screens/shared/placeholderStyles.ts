import { StyleSheet } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';

import theme from '@/theme';

export type PlaceholderStyleOverrides = {
  container?: ViewStyle;
  title?: TextStyle;
  subtitle?: TextStyle;
};

const baseStyles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
  } satisfies ViewStyle,
  title: {
    ...theme.typography.heading,
    textAlign: 'center',
    color: theme.colors.primaryDark,
  } satisfies TextStyle,
  subtitle: {
    ...theme.typography.caption,
    textAlign: 'center',
    color: theme.colors.muted,
    marginTop: theme.spacing.sm,
  } satisfies TextStyle,
};

export default function createPlaceholderStyles(
  overrides: PlaceholderStyleOverrides = {},
) {
  return StyleSheet.create({
    container: { ...baseStyles.container, ...overrides.container },
    title: { ...baseStyles.title, ...overrides.title },
    subtitle: { ...baseStyles.subtitle, ...overrides.subtitle },
  });
}
