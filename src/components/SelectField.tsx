import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
} from 'react-native';

import theme from '@/theme';

import Icon from './Icon';

type ValueType = unknown;

export type SelectOption<T = ValueType> = {
  label: string;
  value: T;
};

interface Props<T = ValueType> {
  label: string;
  placeholder?: string;
  value?: SelectOption<T>;
  options: Array<SelectOption<T>>;
  onSelect(option: SelectOption<T>): void;
  disabled?: boolean;
  testID?: string;
}

export default function SelectField<T = ValueType>({
  label,
  placeholder = 'Selecione',
  value,
  options,
  onSelect,
  disabled = false,
  testID,
}: Props<T>) {
  const [visible, setVisible] = useState(false);
  const iconAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(iconAnimation, {
      toValue: visible ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [iconAnimation, visible]);

  const arrowDownOpacity = iconAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const arrowUpOpacity = iconAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleOpen = useCallback(
    (event: GestureResponderEvent) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      setVisible(true);
    },
    [disabled],
  );

  const handleClose = useCallback(() => setVisible(false), []);

  const handleSelect = useCallback(
    (option: SelectOption<T>) => {
      onSelect(option);
      setVisible(false);
    },
    [onSelect],
  );

  const selectedLabel = useMemo(() => value?.label ?? placeholder, [placeholder, value?.label]);

  return (
    <View style={styles.wrapper} testID={testID}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={({ pressed }) => [
          styles.field,
          disabled && styles.fieldDisabled,
          pressed && !disabled && styles.fieldPressed,
        ]}
        onPress={handleOpen}
        accessibilityRole="button"
        accessibilityLabel={`${label}. ${value ? `Selecionado: ${value.label}.` : 'Toque para selecionar.'}`}
        disabled={disabled}
      >
        <Text style={[styles.value, !value && styles.placeholder]}>{selectedLabel}</Text>
        <Animated.View style={styles.iconContainer} pointerEvents="none">
          <Animated.View style={[styles.iconLayer, { opacity: arrowDownOpacity }]}>
            <Icon name="arrow-drop-down" size={24} color={theme.colors.muted} />
          </Animated.View>
          <Animated.View style={{ opacity: arrowUpOpacity }}>
            <Icon name="arrow-drop-up" size={24} color={theme.colors.muted} />
          </Animated.View>
        </Animated.View>
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleClose}
      >
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={handleClose}>
            <View />
          </Pressable>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item, index) => `${item.label}-${index}`}
              renderItem={({ item }) => {
                const isSelected = value?.value === item.value;
                return (
                  <Pressable
                    style={({ pressed }) => [
                      styles.option,
                      pressed && styles.optionPressed,
                      isSelected && styles.optionSelected,
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>{item.label}</Text>
                  </Pressable>
                );
              }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: theme.spacing.sm },
  label: { ...theme.typography.body, marginBottom: theme.spacing.xs },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.muted,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  fieldDisabled: { opacity: 0.5 },
  fieldPressed: { backgroundColor: '#F0F4F8' },
  value: { ...theme.typography.body, flex: 1, marginRight: theme.spacing.xs },
  placeholder: { color: theme.colors.muted },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLayer: {
    position: 'absolute',
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
    backgroundColor: 'rgba(8, 15, 26, 0.35)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modal: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    maxHeight: '70%',
  },
  modalTitle: {
    ...theme.typography.heading,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  option: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.sm,
  },
  optionPressed: {
    backgroundColor: theme.colors.background,
  },
  optionSelected: {
    backgroundColor: '#E5EEF6',
  },
  optionLabel: {
    ...theme.typography.body,
  },
  optionLabelSelected: {
    fontWeight: '600',
  },
  separator: { height: 1, backgroundColor: '#E2E8F0' },
});
