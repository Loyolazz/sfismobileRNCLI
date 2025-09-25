import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Icon from '@/src/components/Icon';
import styles from '../styles';
import theme from '@/src/theme';

type Props = {
    onMenuPress: () => void;
    onNotificationsPress: () => void;
};

export default function HomeHeader({ onMenuPress, onNotificationsPress }: Props) {
    return (
        <View style={styles.header}>
            <Pressable
                onPress={onMenuPress}
                accessibilityLabel="Abrir menu"
                accessibilityRole="button"
                style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
                android_ripple={{ color: 'rgba(255,255,255,0.15)', radius: 20 }}
                hitSlop={8}
            >
                <Icon name="menu" size={28} color={theme.colors.surface} />
            </Pressable>
            <Text style={styles.headerTitle}>Início</Text>
            <Pressable
                onPress={onNotificationsPress}
                accessibilityLabel="Abrir notificações"
                accessibilityRole="button"
                style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
                android_ripple={{ color: 'rgba(255,255,255,0.15)', radius: 20 }}
                hitSlop={8}
            >
                <Icon name="notifications" size={24} color={theme.colors.surface} />
            </Pressable>
        </View>
    );
}
