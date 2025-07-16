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
    placeholder?: string;
};

export default function Dropdown({
    items,
    value,
    setValue,
    placeholder,
}: Props) {
    const { theme } = useAppContext();
    const commonStyles = createCommonStyles(theme);
    const pickerItems: any[] = [
        placeholder && { value: "placeholder", name: placeholder },
        ...items,
    ];

    return (
        <View style={[styles.container, { borderColor: Colors[theme].mid }]}>
            <Picker
                selectedValue={value}
                onValueChange={(v) => {
                    console.log(v);
                    setValue(v);
                }}
                style={commonStyles.boldedText}
                itemStyle={{ fontSize: 14 }}
                dropdownIconColor={Colors[theme].text}
            >
                {pickerItems.map((item) => (
                    <Picker.Item
                        key={`item${item.value}`}
                        label={item.name}
                        value={item.value || item.id}
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
