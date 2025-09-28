import {StyleSheet, Dimensions, Platform} from 'react-native';
import theme from '@/theme';

const { width } = Dimensions.get('window');

export const GAP = (theme?.spacing?.md as number) ?? 16;
export const CARD_SIZE = Math.floor((width - GAP * 3) / 2);

export const CARD_GRADIENT: [string, string] = [
    theme?.colors?.primaryDark ?? '#0A2647',
    theme?.colors?.primary ?? '#1E3A59',
];

export const DRAWER_BANNER_GRADIENT: [string, string] = [
  theme?.colors?.primaryDark ?? '#0A2647',
  theme?.colors?.primary ?? '#1E3A59',
];

const styles = StyleSheet.create({
    /* ---------- base ---------- */
    safeArea: {
        flex: 1,
        backgroundColor: theme?.colors?.primaryDark ?? '#0A2647',
    },
    scroll: { flex: 1, backgroundColor: '#fff' },
    scrollContent: {
        paddingTop: 0, // cola no header
    },
    scrollContentExtraPadding: {
        paddingBottom: GAP,
    },

    /* ---------- header ---------- */
    header: {
        height: 56,
        backgroundColor: theme?.colors?.primaryDark ?? '#0A2647',
        paddingHorizontal: GAP,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
    headerButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },

    /* ---------- saudação FULL-BLEED ---------- */
    greetingBox: {
        backgroundColor: theme?.colors?.primaryDark ?? '#0A2647',
        paddingHorizontal: GAP,
        paddingTop: GAP,
        paddingBottom: GAP * 1.1,
        marginTop: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    greetingTexts: { flex: 1 },
    greetingText: { fontSize: 20, color: '#fff' },
    greetingStrong: { fontWeight: '700' },
    greetingSub: { color: '#fff', marginTop: 4, fontSize: 14, opacity: 0.9 },
    greetingCounter: { color: '#fff', fontSize: 16, fontWeight: '600' },

    /* ---------- seção com padding lateral (grid + versão) ---------- */
    section: { paddingHorizontal: GAP },

    /* ---------- grid ---------- */
    grid: {
        paddingTop: GAP,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    tileWrapper: {
        width: CARD_SIZE,
        marginBottom: GAP,
    },
    tile: {
        width: '100%',
        height: CARD_SIZE, // quadrado
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        // sombra sutil
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
    },
    tileIconWrap: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    tileText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },

    /* ---------- rodapé ---------- */
    footer: {
        backgroundColor: theme.colors.surface,
    },
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#8B98A9',
        paddingVertical: 4,
    },

    /* ===================== Drawer — NOVO VISUAL ===================== */
    drawerSafe: { flex: 1, backgroundColor: '#F6F8FB' },
    drawerScrollContent: { paddingBottom: 24 },

    // Banner (gradiente + sombra)
    /* --- Banner melhorado --- */
    drawerBanner: {
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 3,
        position: 'relative',
    },
// shapes circulares de fundo (decor)
    drawerDecorA: {
        position: 'absolute',
        right: -30,
        top: -30,
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    drawerDecorB: {
        position: 'absolute',
        right: 30,
        top: 30,
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },

    drawerBannerTop: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 6,
        alignItems: 'flex-end',
    },
    drawerLogo: { width: 96, height: 28, opacity: 0.95 },

    drawerHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },

// avatar + ring
    drawerAvatarRing: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'rgba(255,255,255,0.35)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    drawerAvatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 2,
        borderColor: '#fff',
        backgroundColor: '#fff',
    },
    drawerAvatarFallback: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },

    drawerHeaderText: { flex: 1, minWidth: 0 },

    drawerNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    drawerName: { color: '#fff', fontSize: 18, fontWeight: '800', maxWidth: '110%' },

// badge de perfil
    perfilBadge: {
        backgroundColor: '#E5EEF9',
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    perfilBadgeText: {
        color: '#0A2647',
        fontSize: 12,
        fontWeight: '700',
    },

// pílula grande para unidade
    unidadePill: {
        marginTop: 10,
        alignSelf: 'flex-start',
        backgroundColor: '#EAF1FA',
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 6,
        maxWidth: '100%',
    },
    unidadePillText: {
        color: '#0A2647',
        fontSize: 13,
        fontWeight: '700',
    },

// chips compactos
    drawerChipsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: 8 },
    drawerChipSm: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: 'rgba(255,255,255,0.85)',
        borderRadius: 999,
    },
    drawerChipSmText: { color: '#0A2647', fontSize: 12, fontWeight: '600' },

// (mantém estes)
    drawerListCard: {
        backgroundColor: 'transparent',   // sem fundo de “cartão”
        marginHorizontal: 0,
        marginTop: (theme?.spacing?.md ?? 16),
        borderRadius: 0,
        ...Platform.select({
            android: {
                elevation: 0,
            },
            ios: {
                shadowColor: 'transparent',
                shadowOpacity: 0,
                shadowRadius: 0,
                shadowOffset: { width: 0, height: 0 },
            },
        }),
    },
    drawerFooter: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 },
    logoutPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        alignSelf: 'stretch',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#fff',
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#D7E1EE',
    },
    logoutPillText: { color: theme?.colors?.primaryDark ?? '#0A2647', fontWeight: '800' },

    /* ---------- Modal (Novidades) ---------- */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: GAP,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 14,
        width: '100%',
        padding: GAP,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
        color: theme?.colors?.primaryDark ?? '#0A2647',
    },
    modalItem: { fontSize: 14, marginBottom: 6, color: '#2C3E50' },
    modalButton: {
        marginTop: 12,
        alignSelf: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: theme?.colors?.primaryDark ?? '#0A2647',
        borderRadius: 8,
    },
    modalButtonText: { color: '#fff', fontWeight: '600' },
});

export default styles;
