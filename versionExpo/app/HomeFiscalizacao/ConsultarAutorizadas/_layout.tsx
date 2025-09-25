import React from 'react';
import { Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import Icon from '@/src/components/Icon';
import theme from '@/src/theme';

export default function ConsultarAutorizadasLayout() {
    const router = useRouter();

    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: theme.colors.primaryDark },
                headerTitleStyle: { fontSize: 18, fontWeight: '600' },
                headerTintColor: theme.colors.surface,
                headerTitleAlign: 'center',
                headerLeft: () => (
                    <Pressable
                        onPress={() => router.back()}
                        accessibilityRole="button"
                        accessibilityLabel="Voltar"
                        style={{
                            paddingHorizontal: 8,
                            height: 40,
                            width: 40,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        hitSlop={8}
                    >
                        <Icon name="arrow-back" size={24} color={theme.colors.surface} />
                    </Pressable>
                ),
            }}
        >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="CnpjRazao/index" options={{ title: 'Por CNPJ / Razão Social' }} />
            <Stack.Screen name="Modalidade/index" options={{ title: 'Por Modalidade' }} />
            <Stack.Screen name="Embarcacao/index" options={{ title: 'Por Embarcação' }} />
            <Stack.Screen name="Instalacao/index" options={{ title: 'Por Instalação' }} />
        </Stack>
    );
}
