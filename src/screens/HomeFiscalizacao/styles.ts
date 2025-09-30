import { StyleSheet, Dimensions, Platform } from 'react-native';

import theme from '@/theme';

const { width } = Dimensions.get('window');
const gap = typeof theme.spacing.md === 'number' ? theme.spacing.md : 16;

export const GAP = gap;
export const CARD_SIZE = Math.floor((width - gap * 3) / 2);
export const CARD_GRADIENT: [string, string] = [
  theme.colors.primaryDark,
  theme.colors.primary,
];
export const DRAWER_BANNER_GRADIENT: [string, string] = [
  theme.colors.primaryDark,
  theme.colors.primary,
];

const tileShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  android: { elevation: 4 },
  default: {},
});

const bannerShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  android: { elevation: 3 },
  default: {},
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.primaryDark,
  },
  scroll: { flex: 1, backgroundColor: theme.colors.surface },
  scrollContent: { paddingTop: 0 },
  scrollContentExtraPadding: { paddingBottom: gap },

  header: {
    height: 56,
    backgroundColor: theme.colors.primaryDark,
    paddingHorizontal: gap,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: { ...theme.typography.heading, color: theme.colors.surface, fontSize: 18 },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonSpacing: {
    marginLeft: theme.spacing.xs,
  },

  greetingBox: {
    backgroundColor: theme.colors.primaryDark,
    paddingHorizontal: gap,
    paddingTop: gap,
    paddingBottom: gap * 1.1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingTexts: { flex: 1 },
  greetingText: { ...theme.typography.heading, color: theme.colors.surface },
  greetingStrong: { fontWeight: '700' },
  greetingSub: { ...theme.typography.body, color: theme.colors.surface, opacity: 0.9 },
  greetingCounter: { ...theme.typography.body, color: theme.colors.surface, fontWeight: '600' },

  section: { paddingHorizontal: gap },

  grid: {
    paddingTop: gap,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tileWrapper: { width: CARD_SIZE, marginBottom: gap },
  tile: {
    width: '100%',
    height: CARD_SIZE,
    borderRadius: theme.radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    ...tileShadow,
  },
  tileIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
  },
  tileText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: theme.colors.muted,
    paddingVertical: theme.spacing.xs,
  },
  lastSyncText: {
    textAlign: 'center',
    fontSize: 12,
    color: theme.colors.muted,
    marginBottom: theme.spacing.xs,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: gap,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    width: '100%',
    padding: gap,
    gap: theme.spacing.xs,
  },
  modalTitle: {
    ...theme.typography.heading,
    fontSize: 16,
    color: theme.colors.primaryDark,
  },
  modalItem: { ...theme.typography.body, color: theme.colors.text },
  modalButton: {
    marginTop: theme.spacing.sm,
    alignSelf: 'flex-end',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primaryDark,
    borderRadius: theme.radius.sm,
  },
  modalButtonText: { ...theme.typography.button },

  drawerSafe: { flex: 1, backgroundColor: theme.colors.background },
  drawerScrollContent: { paddingBottom: theme.spacing.lg },
  drawerBanner: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.sm,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    position: 'relative',
    ...bannerShadow,
  },
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
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xs,
    alignItems: 'flex-end',
  },
  drawerLogo: { width: 96, height: 28, opacity: 0.95 },
  drawerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  drawerAvatarRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  drawerAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: theme.colors.surface,
    backgroundColor: theme.colors.surface,
  },
  drawerAvatarFallback: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  drawerHeaderText: { flex: 1, minWidth: 0 },
  drawerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  drawerName: { color: theme.colors.surface, fontSize: 18, fontWeight: '800', maxWidth: '110%' },
  unidadePill: {
    marginTop: theme.spacing.xs,
    alignSelf: 'flex-start',
    backgroundColor: '#EAF1FA',
    borderRadius: 999,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.xs,
    maxWidth: '100%',
  },
  unidadePillText: { color: theme.colors.primaryDark, fontSize: 13, fontWeight: '700' },
  drawerChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  drawerChipSm: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 999,
  },
  drawerChipSmText: { color: theme.colors.primaryDark, fontSize: 12, fontWeight: '600' },
  drawerListCard: {
    backgroundColor: 'transparent',
    marginHorizontal: 0,
    marginTop: theme.spacing.md,
    borderRadius: 0,
    ...Platform.select({
      android: { elevation: 0 },
      ios: {
        shadowColor: 'transparent',
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: { width: 0, height: 0 },
      },
      default: {},
    }),
  },
  drawerFooter: { paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.sm, paddingBottom: theme.spacing.md },
  logoutPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    alignSelf: 'stretch',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D7E1EE',
  },
  logoutPillText: { color: theme.colors.primaryDark, fontWeight: '800' },
});

export default styles;
