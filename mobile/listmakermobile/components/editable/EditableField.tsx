import { useAppContext } from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
    title?: string;
    value: string;
    setValue: (v: string) => void;
};
export default function EditableField({ title, value, setValue }: Props) {
    const { theme } = useAppContext();
    const [isFocused, setIsFocused] = useState(false);
    const backgroundColor = Colors[theme].secondary;
    const borderColor = Colors[theme].mid;
    const textColor = Colors[theme].text;
    const textStyle = {
        color: textColor,
    };

    return (
        <View style={styles.container}>
            {title && <Text style={[styles.title, textStyle]}>{title}</Text>}
            <View
                style={[
                    styles.input,
                    {
                        backgroundColor: backgroundColor,
                        borderColor: isFocused ? borderColor : "transparent",
                    },
                ]}
            >
                <TextInput
                    value={value}
                    onChangeText={setValue}
                    style={textStyle}
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
        padding: 2,
        borderRadius: 5,
        borderWidth: 2,
    },
    title: {
        fontSize: 12,
        fontWeight: 800,
        opacity: 0.8,
    },
});
