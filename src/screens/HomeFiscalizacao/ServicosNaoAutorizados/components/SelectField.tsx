import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import theme from '@/theme';

type Option = { label: string; value: string };

type Props = {
  label?: string;
  placeholder: string;
  value?: string | null;
  onSelect: (value: string) => void;
  options: Option[];
};

export default function SelectField({ label, placeholder, value, onSelect, options }: Props) {
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(() => {
    const found = options.find(option => option.value === value);
    return found?.label ?? value ?? '';
  }, [options, value]);

  return (
    <View style={{ gap: theme.spacing.xs }}>
      {label ? (
        <Text style={{ fontWeight: '600', color: theme.colors.text, fontSize: 14 }}>{label}</Text>
      ) : null}

      <Pressable
        onPress={() => setOpen(true)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: theme.radius.md,
          borderWidth: 1,
          borderColor: '#D0D5DD',
          backgroundColor: theme.colors.surface,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.md,
        }}
      >
        <Text style={{ color: selectedLabel ? theme.colors.text : theme.colors.muted, fontSize: 15 }}>
          {selectedLabel || placeholder}
        </Text>
        <Icon name="arrow-drop-down" size={24} color={theme.colors.muted} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.15)', padding: theme.spacing.lg }}
          onPress={() => setOpen(false)}
        >
          <Pressable
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radius.md,
              padding: theme.spacing.md,
              maxHeight: '70%',
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 4,
            }}
            onPress={e => e.stopPropagation()}
          >
            {label ? (
              <Text style={{ fontWeight: '700', fontSize: 16, color: theme.colors.text, marginBottom: theme.spacing.sm }}>
                {label}
              </Text>
            ) : null}
            <ScrollView>
              {options.map(option => {
                const active = option.value === value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      onSelect(option.value);
                      setOpen(false);
                    }}
                    style={{
                      paddingVertical: theme.spacing.sm,
                      paddingHorizontal: theme.spacing.xs,
                      borderBottomWidth: 1,
                      borderBottomColor: '#E5E7EB',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: active ? theme.colors.primaryDark : theme.colors.text,
                        fontWeight: active ? '700' : '500',
                      }}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
