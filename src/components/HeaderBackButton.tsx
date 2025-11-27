import { Pressable } from 'react-native';

import Icon from '@/components/Icon';
import theme from '@/theme';

import homeStyles from '../screens/HomeFiscalizacao/styles';

type HeaderBackButtonProps = {
  onPress: () => void;
};

export default function HeaderBackButton({ onPress }: HeaderBackButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Voltar"
      style={homeStyles.headerButton}
      hitSlop={8}
    >
      <Icon name="arrow-back" size={24} color={theme.colors.surface} />
    </Pressable>
  );
}
