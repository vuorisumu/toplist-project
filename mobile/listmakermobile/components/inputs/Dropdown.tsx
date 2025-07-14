import { useAppContext } from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import { createCommonStyles } from "@/utils/styles";
import { Picker } from "@react-native-picker/picker";
import { StyleSheet, View } from "react-native";

export type DropdownItem = {
    name: string;
    value: any;
    [key: string]: any;
};
type Props = {
    items: DropdownItem[];
    value?: string | DropdownItem;
    setValue: (value: string | DropdownItem) => void;
};

export default function Dropdown({ items, value, setValue }: Props) {
    const { theme } = useAppContext();
    const commonStyles = createCommonStyles(theme);

    const isPlaceholder = () => {
        if (!value) return false;
        const isFound = items.find((item) => item.value === value);
        return !isFound;
    };

    return (
        <View style={[styles.container, { borderColor: Colors[theme].mid }]}>
            <Picker
                selectedValue={value}
                onValueChange={(v) => setValue(v)}
                style={commonStyles.boldedText}
                dropdownIconColor={Colors[theme].text}
            >
                {value && isPlaceholder() && (
                    <Picker.Item
                        label={typeof value === "string" ? value : value.value}
                        value={null}
                    />
                )}

                {items.map((item) => (
                    <Picker.Item
                        key={`item${item.value}`}
                        label={item.name}
                        value={item.value}
                    />
                ))}
            </Picker>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        borderRadius: 25,
    },
});
