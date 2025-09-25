import { View, Text, StyleSheet } from 'react-native';
import Icon from '@/src/components/Icon';
import theme from '@/src/theme';

interface Props {
  text1?: string;
  type: 'success' | 'error';
}

export default function AlertToast({ type, text1 }: Props) {
  const isError = type === 'error';
  return (
    <View style={[styles.container, isError ? styles.error : styles.success]}>
      <Icon
        name={isError ? 'error-outline' : 'check-circle'}
        size={20}
        color={theme.colors.surface}
      />
      <Text style={styles.message}>{text1}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    minWidth: '80%',
  },
  message: {
    color: theme.colors.surface,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  success: {
    backgroundColor: theme.colors.primary,
  },
  error: {
    backgroundColor: theme.colors.error,
  },
});
