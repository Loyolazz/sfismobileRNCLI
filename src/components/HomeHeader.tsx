import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Icon from '@/components/Icon';
import styles from '../screens/HomeFiscalizacao/styles';
import theme from '@/theme';

type Props = {
    onMenuPress: () => void;
    onNotificationsPress: () => void;
    onSyncPress: () => void;
    syncing?: boolean;
};

export default function HomeHeader({ onMenuPress, onNotificationsPress, onSyncPress, syncing = false }: Props) {
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
            <View style={styles.headerActions}>
                <Pressable
                    onPress={onSyncPress}
                    accessibilityLabel="Atualizar banco de dados"
                    accessibilityRole="button"
                    style={styles.headerButton}
                    android_ripple={{ color: 'rgba(255,255,255,0.15)', radius: 20 }}
                    hitSlop={8}
                    disabled={syncing}
                >
                    {syncing ? (
                        <ActivityIndicator color={theme.colors.surface} size="small" />
                    ) : (
                        <Icon name="cloud-download" size={24} color={theme.colors.surface} />
                    )}
                </Pressable>
                <Pressable
                    onPress={onNotificationsPress}
                    accessibilityLabel="Abrir notificações"
                    accessibilityRole="button"
                    style={[styles.headerButton, styles.headerButtonSpacing]}
                    android_ripple={{ color: 'rgba(255,255,255,0.15)', radius: 20 }}
                    hitSlop={8}
                >
                    <Icon name="notifications" size={24} color={theme.colors.surface} />
                </Pressable>
            </View>
        </View>
    );
}
