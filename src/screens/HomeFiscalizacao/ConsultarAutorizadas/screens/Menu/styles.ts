import { StyleSheet } from 'react-native';

import theme from '@/theme';

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.md, backgroundColor: theme.colors.surface },
  title: { ...theme.typography.heading, textAlign: 'center', marginBottom: theme.spacing.lg },
  option: { backgroundColor: theme.colors.primary, padding: theme.spacing.md, borderRadius: theme.radius.md, marginBottom: theme.spacing.sm },
  optionText: { ...theme.typography.button },
});

export default styles;
