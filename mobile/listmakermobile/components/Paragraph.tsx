import { useAppContext } from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import { Text, type TextProps } from "react-native";

type Props = TextProps;

export function Paragraph({ style, ...content }: Props) {
    const { theme } = useAppContext();
    const color = Colors[theme].text;

    return (
        <Text
            style={[{ color: color, paddingVertical: 5 }, style]}
            {...content}
        />
    );
}
