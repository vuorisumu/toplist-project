import { useAppContext } from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import { createCommonStyles } from "@/utils/styles";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
    title?: string;
    value: string;
    setValue: (v: string) => void;
    error?: boolean;
};
export default function EditableField({
    title,
    value,
    setValue,
    error,
}: Props) {
    const { theme } = useAppContext();
    const [isFocused, setIsFocused] = useState(false);
    const commonStyles = createCommonStyles(theme);
    const backgroundColor = Colors[theme].secondary;
    const borderColor = Colors[theme].mid;
    const textColor = Colors[theme].text;
    const textStyle = {
        color: textColor,
    };

    return (
        <View style={styles.container}>
            {title && <Text style={[commonStyles.smallTitle]}>{title}</Text>}
            <View
                style={[
                    styles.input,
                    {
                        backgroundColor: backgroundColor,
                        borderColor: error
                            ? "red"
                            : isFocused
                              ? borderColor
                              : "transparent",
                    },
                ]}
            >
                <TextInput
                    value={value}
                    onChangeText={setValue}
                    style={[textStyle, styles.inputText]}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 2,
    },
    input: {
        paddingHorizontal: 4,
        borderRadius: 5,
        borderWidth: 1,
    },
    inputText: {
        padding: 7,
    },
    title: {
        fontSize: 12,
        fontWeight: 800,
        opacity: 0.8,
    },
});
