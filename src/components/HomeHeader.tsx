import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon from '@/components/Icon';
import styles from '../screens/HomeFiscalizacao/styles';
import theme from '@/theme';

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
                style={styles.headerButton}
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
                style={styles.headerButton}
                android_ripple={{ color: 'rgba(255,255,255,0.15)', radius: 20 }}
                hitSlop={8}
            >
                <Icon name="notifications" size={24} color={theme.colors.surface} />
            </Pressable>
        </View>
    );
}
