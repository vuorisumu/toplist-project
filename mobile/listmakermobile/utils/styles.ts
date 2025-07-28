import { Colors } from "@/utils/Colors";
import { StyleSheet } from "react-native";

export const createCommonStyles = (theme: keyof typeof Colors) =>
    StyleSheet.create({
        smallTitle: {
            fontSize: 12,
            fontWeight: 800,
            opacity: 0.8,
            color: Colors[theme].text,
        },
        boldedText: {
            fontWeight: 600,
            color: Colors[theme].text,
        },
        titleText: {
            fontWeight: 800,
            fontSize: 24,
            color: Colors[theme].icon,
        },
        subHeader: {
            fontWeight: 800,
            fontSize: 20,
            color: Colors[theme].text,
            paddingVertical: 10,
        },
        basicRow: {
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
        },
        modalButtonText: {
            fontWeight: 600,
            color: Colors[theme].white,
            fontSize: 16,
            textAlign: "center",
        },
        imagePlaceholder: {
            width: "100%",
            height: 100,
            backgroundColor: Colors[theme].secondary,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: Colors[theme].mid,
            borderStyle: "dashed",
            alignItems: "center",
            justifyContent: "center",
        },
        imagePlaceholderText: {
            color: Colors[theme].mid,
        },
        card: {
            backgroundColor: Colors[theme].secondary,
            padding: 10,
        },
        basicLink: {
            fontWeight: 600,
            color: Colors[theme].icon,
        },
    });
