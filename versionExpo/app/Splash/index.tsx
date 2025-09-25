import { useEffect, useRef } from "react";
import {
    Animated,
    StyleSheet,
    View,
    Text,
    ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ensureLatestVersion } from "@/src/lib/version";
import styles from "./styles";
import { extractSoapResult, soapRequest } from "@/src/api/antaq";

const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);

export default function Splash() {
    const router = useRouter();
    const version = Constants.expoConfig?.version ?? "1.2.11";
    const bgScale = useRef(new Animated.Value(1.02)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const logoTy = useRef(new Animated.Value(12)).current;
    const bgLoopRef = useRef<Animated.CompositeAnimation | null>(null);

    useEffect(() => {
        bgLoopRef.current = Animated.loop(
            Animated.sequence([
                Animated.timing(bgScale, {
                    toValue: 1.06,
                    duration: 6000,
                    useNativeDriver: true,
                }),
                Animated.timing(bgScale, {
                    toValue: 1.02,
                    duration: 6000,
                    useNativeDriver: true,
                }),
            ])
        );
        bgLoopRef.current.start();

        Animated.parallel([
            Animated.timing(logoOpacity, {
                toValue: 1,
                duration: 800,
                delay: 250,
                useNativeDriver: true,
            }),
            Animated.spring(logoTy, {
                toValue: 0,
                damping: 12,
                stiffness: 120,
                mass: 0.6,
                useNativeDriver: true,
            }),
        ]).start();

        return () => bgLoopRef.current?.stop();
    }, [bgScale, logoOpacity, logoTy]);

    useEffect(() => {
        const ac = new AbortController();
        (async () => {
            try {
                const parsed = await soapRequest("GetVersion", undefined, {
                    signal: ac.signal,
                });
                const v = extractSoapResult(parsed, "GetVersion");
                console.log("Versão API =", v);
            } catch (e: any) {
                if (e?.name === "CanceledError" || e?.message === "canceled") {
                    console.log("Chamada cancelada (unmount/refresh)");
                } else {
                    console.warn("Falha GetVersion:", e?.message || String(e));
                }
            }
        })();
        return () => ac.abort();
    }, []);

    useEffect(() => {
        (async () => {
            const ok = await ensureLatestVersion();
            if (ok) router.replace("/Login");
        })();
    }, [router]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <AnimatedImageBackground
                source={require("../../assets/background/fundo-release.png")}
                resizeMode="cover"
                style={[styles.background, { transform: [{ scale: bgScale }] }]}
            >
                <LinearGradient
                    colors={["rgba(4,18,28,0.6)", "rgba(8,41,60,0.95)"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={StyleSheet.absoluteFillObject}
                />

                <View style={styles.center}>
                    <View style={styles.logoGlow} />
                    <Animated.Image
                        source={require("../../assets/icon/logo-navbar@1,5x.png")}
                        resizeMode="contain"
                        style={[
                            styles.logo,
                            { opacity: logoOpacity, transform: [{ translateY: logoTy }] },
                        ]}
                    />
                    <View style={styles.versionPill}>
                        <Text style={styles.versionPillText}>v{version}</Text>
                    </View>
                </View>

                <View style={styles.versionContainer}>
                    <Text style={styles.versionBottom}>{version}</Text>
                </View>
            </AnimatedImageBackground>

            <StatusBar style="light" translucent backgroundColor="transparent" />
        </SafeAreaView>
    );
}
