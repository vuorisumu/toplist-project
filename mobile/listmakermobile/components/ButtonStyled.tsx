import { useAppContext } from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
    title: string;
    onPress: () => void;
    alt?: boolean;
};

export default function ButtonStyled({ title, onPress, alt = false }: Props) {
    const { theme } = useAppContext();
    const background = alt ? Colors[theme].mid : Colors[theme].icon;

    return (
        <Pressable style={[{ backgroundColor: background }, styles.button]}>
            <Text style={[{ color: Colors[theme].white }, styles.text]}>
                {title}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 20,
        padding: 4,
    },
    text: {
        textAlign: "center",
        fontSize: 16,
    },
});
