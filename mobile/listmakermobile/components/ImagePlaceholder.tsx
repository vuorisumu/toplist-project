import { useAppContext } from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import { createCommonStyles } from "@/utils/styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, TouchableOpacity } from "react-native";

type Props = {
    onPress: () => void;
    text?: string;
};
export default function ImagePlaceholder({ onPress, text }: Props) {
    const { theme } = useAppContext();
    const commonStyles = createCommonStyles(theme);
    return (
        <TouchableOpacity
            style={commonStyles.imagePlaceholder}
            onPress={onPress}
        >
            <MaterialIcons name={"image"} size={24} color={Colors[theme].mid} />
            <Text style={commonStyles.imagePlaceholderText}>{text}</Text>
        </TouchableOpacity>
    );
}
