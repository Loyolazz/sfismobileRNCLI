import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'sfis.session';

export type StoredSession = {
    token: string;
    usuario?: any;
    keepConnected: boolean;
    expiresAt: number; // epoch ms
};

const daysToMs = (d: number) => d * 24 * 60 * 60 * 1000;

export async function saveSession(
    data: { token: string; usuario?: any },
    keepConnected: boolean,
    ttlDays = 14
) {
    const payload: StoredSession = {
        token: data.token,
        usuario: data.usuario,
        keepConnected,
        expiresAt: Date.now() + daysToMs(ttlDays),
    };
    await AsyncStorage.setItem(KEY, JSON.stringify(payload));
    return payload;
}

export async function loadSession(): Promise<StoredSession | null> {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    try {
        const parsed: StoredSession = JSON.parse(raw);
        if (parsed.expiresAt > Date.now()) {
            return parsed;
        }
    } catch {}
    await AsyncStorage.removeItem(KEY);
    return null;
}

export async function clearSession() {
    await AsyncStorage.removeItem(KEY);
}

export async function renewSession(ttlDays = 14) {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    try {
        const s: StoredSession = JSON.parse(raw);
        s.expiresAt = Date.now() + daysToMs(ttlDays);
        await AsyncStorage.setItem(KEY, JSON.stringify(s));
        return s;
    } catch {
        await AsyncStorage.removeItem(KEY);
        return null;
    }
}
