import { Text, type TextProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

type Props = TextProps;

export function Paragraph({ style, ...content }: Props) {
    const color = useThemeColor("text");

    return (
        <Text
            style={[{ color: color, paddingVertical: 5 }, style]}
            {...content}
        />
    );
}
