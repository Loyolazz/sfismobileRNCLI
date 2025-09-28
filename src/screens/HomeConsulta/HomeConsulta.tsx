import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/types/types';
import styles from './styles';

export default function HomeConsulta() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    return (
        <SafeAreaView style={styles.container} edges={['left', 'right']}>
            <Text style={styles.title}>SFISMobile</Text>
            <Pressable
                onPress={() => navigation.navigate('Login')}
                accessibilityRole="button"
                accessibilityLabel="Ir para a tela de login"
            >
                <Text style={localStyles.link}>Ir para Login</Text>
            </Pressable>
        </SafeAreaView>
    );
}

const localStyles = StyleSheet.create({
    link: {
        color: '#0F3C52',
        fontWeight: '600',
    },
});

