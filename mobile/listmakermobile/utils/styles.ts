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
    });
