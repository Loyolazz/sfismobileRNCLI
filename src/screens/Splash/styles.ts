import { StyleSheet } from "react-native";

export default StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "#08293C",
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
    },

    logoGlow: {
        position: "absolute",
        width: 260,
        height: 260,
        borderRadius: 130,
        backgroundColor: "rgba(255,255,255,0.06)",
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 8 },
    },
    logo: {
        width: 220,
        height: 118,
    },

    versionPill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.12)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.22)",
    },

    versionPillText: {
        color: "rgba(255,255,255,0.95)",
        fontSize: 12,
        fontWeight: "600",
        letterSpacing: 0.3,
    },

    versionContainer: {
        position: "absolute",
        bottom: 16,
        left: 0,
        right: 0,
        alignItems: "center",
    },
    versionBottom: {
        color: "rgba(255,255,255,0.75)",
        fontSize: 12,
        letterSpacing: 0.2,
    },
});
