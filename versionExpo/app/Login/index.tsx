import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Switch,
    Text,
    TextInput,
    View,
    Image,
    ImageBackground,
    StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import * as Application from "expo-application";
import { Toast } from "toastify-react-native";

import { usuarioAutenticar } from "@/src/api/usuarioAutenticar";
import { saveSession, loadSession } from "@/src/services/session";
import styles from "./styles";
import Icon from "@/src/components/Icon";
import theme from "@/src/theme";

const BG = require("../../assets/background/fundo-release.png");
const LOGO = require("../../assets/logo.png");

export default function LoginScreen() {
    const router = useRouter();
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [keepConnected, setKeepConnected] = useState(false);
    const [checking, setChecking] = useState(true);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const version = [
        Constants.expoConfig?.version ?? Application.nativeApplicationVersion ?? "dev",
        Application.nativeBuildVersion ? `(${Application.nativeBuildVersion})` : "",
    ]
        .filter(Boolean)
        .join(" ");

    useEffect(() => {
        (async () => {
            try {
                const s = await loadSession();
                if (s?.token) {
                    router.replace({ pathname: "/HomeFiscalizacao", params: { showReleases: "1" } });
                    return;
                }
            } catch {}
            setChecking(false);
        })();
    }, [router]);

    async function onEntrar() {
        setErro(null);
        setLoading(true);
        try {
            if (!usuario || !senha) {
                const msg = "Preencha usuário e senha.";
                setErro(msg);
                Toast.error(msg);
                return;
            }
            const { token, servidor } = await usuarioAutenticar(usuario, senha);
            await saveSession({ token, usuario: servidor }, keepConnected, 14);
            Toast.success("Login realizado com sucesso!");
            router.replace({ pathname: "/HomeFiscalizacao", params: { showReleases: "1" } });
        } catch (e: any) {
            const raw = e?.message?.toString?.() || "";
            if (raw.toLowerCase().includes("network")) {
                const msg = "Erro de conexão. Verifique sua internet.";
                setErro(msg);
                Toast.error(msg);
            } else {
                const msg = raw || "Falha ao autenticar. Verifique suas credenciais.";
                setErro(msg);
                Toast.error(msg);
            }
        } finally {
            setLoading(false);
        }
    }

    if (checking) {
        return (
            <View style={[styles.background, styles.center]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.flex1}>
            <StatusBar style="light" translucent />
            <ImageBackground source={BG} style={styles.background} imageStyle={styles.backgroundImage}>
                <LinearGradient
                    colors={["rgba(0,0,0,0.25)", "rgba(0,0,0,0.65)"]}
                    style={StyleSheet.absoluteFillObject}
                />
                <SafeAreaView style={styles.safeArea}>
                    <KeyboardAvoidingView
                        style={styles.flex1}
                        behavior={Platform.select({ ios: "padding", android: undefined }) || undefined}
                    >
                        <View style={styles.container}>
                            <View style={styles.header}>
                                <Image source={LOGO} resizeMode="contain" style={styles.logo} />
                            </View>

                            <View style={styles.card}>
                                <Text style={styles.title}>Entrar</Text>

                                <View style={styles.form}>
                                    <View style={styles.inputGroup}>
                                        <Icon name="person" size={22} color="#9FB3C1" />
                                        <TextInput
                                            placeholder="Usuário / Matrícula"
                                            placeholderTextColor="#9FB3C1"
                                            value={usuario}
                                            onChangeText={setUsuario}
                                            style={styles.input}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            returnKeyType="next"
                                            textContentType="username"
                                        />
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Icon name="lock" size={22} color="#9FB3C1" />
                                        <TextInput
                                            placeholder="Senha"
                                            placeholderTextColor="#9FB3C1"
                                            value={senha}
                                            onChangeText={setSenha}
                                            style={styles.input}
                                            secureTextEntry={!showPassword}
                                            returnKeyType="go"
                                            onSubmitEditing={onEntrar}
                                            textContentType="password"
                                        />
                                        <Pressable
                                            onPress={() => setShowPassword(!showPassword)}
                                            accessibilityRole="button"
                                            accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                            style={styles.trailingIcon}
                                        >
                                            <Icon name={showPassword ? "visibility-off" : "visibility"} size={22} color="#9FB3C1" />
                                        </Pressable>
                                    </View>

                                    <View style={styles.row}>
                                        <Text style={styles.keepText}>Manter conectado (14 dias)</Text>
                                        <Switch value={keepConnected} onValueChange={setKeepConnected} />
                                    </View>

                                    {erro ? <Text style={styles.error}>{erro}</Text> : null}

                                    <Pressable
                                        onPress={onEntrar}
                                        disabled={loading || !usuario || !senha}
                                        style={({ pressed }) => [
                                            styles.button,
                                            (loading || !usuario || !senha) && styles.buttonDisabled,
                                            pressed && !(loading || !usuario || !senha) && styles.buttonPressed,
                                        ]}
                                    >
                                        <LinearGradient
                                            colors={[theme.colors.primary, theme.colors.primaryDark]}
                                            style={styles.buttonBg}
                                        />
                                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
                                    </Pressable>
                                </View>

                                <Text style={styles.version}>v{version}</Text>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
}