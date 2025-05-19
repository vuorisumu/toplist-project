import { useAppContext } from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import { StyleSheet, Text, View } from "react-native";
import Logo from "../assets/images/logo.svg";

type Props = {
    title: string;
    showLogo?: boolean;
};

export default function Header({ title, showLogo }: Props) {
    const { theme } = useAppContext();
    const titleColor = Colors[theme].icon;

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
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        paddingVertical: 15,
    },
    text: {
        fontSize: 24,
        fontWeight: 800,
    },
});
