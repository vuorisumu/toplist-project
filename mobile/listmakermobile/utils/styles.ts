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
        basicRow: {
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
        },
    });
