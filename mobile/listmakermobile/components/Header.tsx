import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    title: string;
};

export default function Header({ title }: Props) {
    const titleColor = useThemeColor("text");

    return (
        <View style={styles.container}>
            <Text style={[styles.text, { color: titleColor }]}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 15,
    },
    text: {
        fontSize: 24,
        fontWeight: 800,
        textAlign: "center",
    },
});
