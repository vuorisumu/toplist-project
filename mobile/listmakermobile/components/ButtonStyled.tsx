import { useAppContext } from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ComponentProps } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
    title: string;
    onPress: () => void;
    icon?: ComponentProps<typeof MaterialIcons>["name"];
    alt?: boolean;
    size?: number;
};

export default function ButtonStyled({
    title,
    onPress,
    icon,
    alt = false,
    size,
}: Props) {
    const { theme } = useAppContext();
    const background = alt ? Colors[theme].mid : Colors[theme].icon;
    const big = size && size > 20;

    return (
        <Pressable
            style={[
                { backgroundColor: background, padding: big ? 6 : 4 },
                styles.button,
            ]}
            onPress={onPress}
        >
            {icon && (
                <MaterialIcons
                    name={icon}
                    size={size || 20}
                    color={Colors[theme].white}
                />
            )}
            <Text
                style={[
                    {
                        color: Colors[theme].white,
                        fontSize: big ? size - 4 : 16,
                        fontWeight: big ? 600 : 400,
                    },
                    styles.text,
                ]}
            >
                {title}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 20,
        flexDirection: "row",
        gap: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        textAlign: "center",
    },
});
