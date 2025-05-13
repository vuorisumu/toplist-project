import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, Text, View } from "react-native";
import Logo from "../assets/images/logo.svg";

type Props = {
    title: string;
    showLogo?: boolean;
};

export default function Header({ title, showLogo }: Props) {
    const titleColor = useThemeColor("text");
    const logoSize = 40;

    return (
        <View style={styles.container}>
            {showLogo && <Logo width={logoSize} height={logoSize} />}
            <Text style={[styles.text, { color: titleColor }]}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        paddingVertical: 15,
    },
    text: {
        fontSize: 24,
        fontWeight: 800,
        textAlign: "center",
    },
});
