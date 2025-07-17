import { useAppContext } from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import { createCommonStyles } from "@/utils/styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, TouchableOpacity } from "react-native";

type Props = {
    onPress: () => void;
    text?: string;
    small?: boolean;
};
export default function ImagePlaceholder({ onPress, text, small }: Props) {
    const { theme } = useAppContext();
    const commonStyles = createCommonStyles(theme);
    return (
        <TouchableOpacity
            style={[
                commonStyles.imagePlaceholder,
                small && { height: 40, width: 40, borderRadius: 5 },
            ]}
            onPress={onPress}
        >
            <MaterialIcons
                name={"image"}
                size={small ? 20 : 24}
                color={Colors[theme].mid}
            />
            {text && !small && (
                <Text style={commonStyles.imagePlaceholderText}>{text}</Text>
            )}
        </TouchableOpacity>
    );
}
