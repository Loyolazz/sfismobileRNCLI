import { StyleSheet, Dimensions } from "react-native";
import theme from "@/src/theme";

const { width } = Dimensions.get("window");
const P = 20;

export default StyleSheet.create({
    flex1: { flex: 1 },

    // Fundo com imagem
    background: {
        flex: 1,
        backgroundColor: theme?.colors?.primaryDark ?? "#072236",
    },
    backgroundImage: {
        width: "100%",
        height: "100%",
    },

    safeArea: {
        flex: 1,
    },

    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: P,
        paddingBottom: P,
    },

    header: {
        alignItems: "center",
        marginBottom: 12,
    },
    logo: {
        width: Math.min(160, width * 0.5),
        height: 175,
    },

    card: {
        width: "100%",
        maxWidth: 420,
        borderRadius: 16,
        padding: P,
        backgroundColor: "rgba(8, 29, 46, 0.66)", // vidro fake
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "rgba(255,255,255,0.12)",
    },

    title: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 12,
    },

    form: {
        gap: 12,
    },

    inputGroup: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "rgba(255,255,255,0.06)",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",
        paddingHorizontal: 12,
        height: 52,
    },

    input: {
        flex: 1,
        color: "#EAF2F8",
        fontSize: 16,
        paddingVertical: 0,
    },

    trailingIcon: {
        paddingLeft: 6,
        paddingVertical: 6,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 4,
    },
    keepText: {
        color: "#C9D6DE",
        fontSize: 12,
        letterSpacing: 0.2,
    },

    error: {
        color: "#FF6B6B",
        fontSize: 13,
        marginTop: 4,
    },

    button: {
        height: 52,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden", // para recortar o gradient
        marginTop: 4,
    },
    buttonBg: {
        ...StyleSheet.absoluteFillObject,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
        letterSpacing: 0.3,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonPressed: {
        transform: [{ scale: 0.99 }],
    },

    version: {
        textAlign: "center",
        color: "#BFD0DA",
        fontSize: 12,
        marginTop: 14,
    },

    center: { alignItems: "center", justifyContent: "center" },
});
