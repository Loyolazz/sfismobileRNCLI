import React, { useEffect, useState, useCallback } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    DrawerContentComponentProps,
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import LinearGradient from 'react-native-linear-gradient';

import Icon from '@/components/Icon';
import { loadSession, clearSession } from '@/services/session';
import type { Servidor } from '@/api/usuarioAutenticar';
import styles, { DRAWER_BANNER_GRADIENT } from '@/screens/HomeFiscalizacao/styles';
import theme from '@/theme';

type Props = DrawerContentComponentProps & {
    onLogout: () => void;
};

export default function CustomDrawerContent({ onLogout, ...props }: Props) {
    const [user, setUser] = useState<Servidor | null>(null);

    const logoAntaq = require('../../assets/icon/logo-navbar.png');

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const session = await loadSession();
                if (mounted) setUser(session?.usuario ?? null);
            } catch {
                if (mounted) setUser(null);
            }
        })();
        return () => { mounted = false; };
    }, []);

    const handleLogout = useCallback(async () => {
        await clearSession();
        onLogout();
    }, [onLogout]);

    const nome = (user?.NOUsuario || '').toUpperCase();
    const email = user?.EEFuncionario || '';
    const login = user?.NOLoginUsuario || '';
    const unidade =
        (user as any)?.SGUnidade ||
        (user as any)?.NOUnidade ||
        (user as any)?.Unidade ||
        '';
    const matriculaNum = user?.NRMatricula ?? (user as any)?.NRMatriculaServidor;
    const matricula = matriculaNum ? `Matrícula ${matriculaNum}` : '';


  return (
        <SafeAreaView style={styles.drawerSafe}>
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={styles.drawerScrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Banner */}
                <LinearGradient colors={DRAWER_BANNER_GRADIENT} style={styles.drawerBanner}>
                    {/* shapes decorativos */}
                    <View style={styles.drawerDecorA} />
                    <View style={styles.drawerDecorB} />

                    {/* topo com logo */}
                    <View style={styles.drawerBannerTop}>
                        <Image source={logoAntaq} style={styles.drawerLogo} resizeMode="contain" />
                    </View>

                    {/* cabeçalho do usuário */}
                    <View style={styles.drawerHeaderRow}>
                        {/* avatar com “anel” */}
                        <View style={styles.drawerAvatarRing}>
                            {user?.Foto ? (
                                <Image
                                    source={{ uri: `data:image/png;base64,${user.Foto}` }}
                                    style={styles.drawerAvatar}
                                />
                            ) : (
                                <View style={styles.drawerAvatarFallback}>
                                    <Icon name="person" size={28} color={theme.colors.primaryDark} />
                                </View>
                            )}
                        </View>

                        <View style={styles.drawerHeaderText}>
                            <View style={styles.drawerNameRow}>
                                <Text style={styles.drawerName} numberOfLines={1}  ellipsizeMode="tail">
                                    {nome}
                                </Text>
                            </View>

                            {/* Unidade/UGA em pílula grande */}
                            {!!unidade && (
                                <View style={styles.unidadePill}>
                                    <Icon name="home-work" size={16} color="#0A2647"/>
                                    <Text style={styles.unidadePillText} numberOfLines={1} ellipsizeMode="tail">
                                        {unidade}
                                    </Text>
                                </View>
                            )}

                            {/* chips compactos */}
                            <View style={styles.drawerChipsRow}>
                                {!!matricula && (
                                    <View style={styles.drawerChipSm}>
                                        <Icon name="badge" size={13} color="#0A2647" />
                                        <Text style={styles.drawerChipSmText}>{matricula}</Text>
                                    </View>
                                )}
                                {!!email && (
                                    <View style={styles.drawerChipSm}>
                                        <Icon name="email" size={13} color="#0A2647" />
                                        <Text
                                            style={styles.drawerChipSmText}
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                        >
                                            {email}
                                        </Text>
                                    </View>
                                )}
                                {!!login && login !== email && (
                                    <View style={styles.drawerChipSm}>
                                        <Icon name="account-circle" size={13} color="#0A2647" />
                                        <Text
                                            style={styles.drawerChipSmText}
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                        >
                                            {login}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                {/* Lista de itens (só quando state existir) */}
                <View style={styles.drawerListCard}>
                    {props?.state?.routes ? <DrawerItemList {...props} /> : null}
                </View>
            </DrawerContentScrollView>

            {/* Rodapé / Sair */}
            <View style={styles.drawerFooter}>
                <Pressable
                    onPress={handleLogout}
                    accessibilityRole="button"
                    accessibilityLabel="Sair da conta"
                    style={styles.logoutPill}
                    android_ripple={{ color: 'rgba(10,38,71,0.12)', radius: 28 }}
                >
                    <Icon name="logout" size={20} color={theme.colors.primaryDark} />
                    <Text style={styles.logoutPillText}>Sair</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
