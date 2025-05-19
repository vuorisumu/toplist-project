import { Colors } from "@/utils/Colors";
import { Text, useColorScheme, type TextProps } from "react-native";

type Props = TextProps;

export function Paragraph({ style, ...content }: Props) {
    const theme = useColorScheme() ?? "dark";
    const color = Colors[theme].text;

    return (
        <Text
            style={[{ color: color, paddingVertical: 5 }, style]}
            {...content}
        />
    );
}
