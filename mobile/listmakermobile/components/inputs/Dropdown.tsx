import { useAppContext } from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import { createCommonStyles } from "@/utils/styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

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
    const [modalOpen, setModalOpen] = useState(false);
    const [valueName, setValueName] = useState("");

    useEffect(() => {
        const newName = getValueName();
        setValueName(newName);
    }, [value]);

    const getValueName = () => {
        if (!value || value === "placeholder") return placeholder || "Choose";
        if (typeof value === "string") return value;
        return (
            items.find((item) => item.id === value || item.value === value)
                ?.name || ""
        );
    };

    const pickerComp = (
        <Picker
            selectedValue={value}
            onValueChange={(v) => {
                setValue(v);
            }}
            style={commonStyles.boldedText}
            itemStyle={{ fontSize: 14 }}
            dropdownIconColor={Colors[theme].text}
        >
            {pickerItems.map((item) => (
                <Picker.Item
                    key={`item${item.value || item.id}`}
                    label={item.name}
                    value={item.value || item.id}
                />
            ))}
        </Picker>
    );

    if (Platform.OS === "ios")
        return (
            <TouchableOpacity
                style={[
                    styles.container,
                    {
                        borderColor: Colors[theme].mid,
                        paddingVertical: 10,
                        paddingHorizontal: 15,
                        flexDirection: "row",
                        alignItems: "center",
                    },
                ]}
                onPress={() => setModalOpen(true)}
            >
                <Text style={[commonStyles.boldedText, { flex: 1 }]}>
                    {valueName}
                </Text>
                <MaterialIcons
                    name={"arrow-drop-down"}
                    size={24}
                    color={Colors[theme].text}
                />

                <Modal visible={modalOpen} transparent>
                    <TouchableOpacity
                        style={[
                            StyleSheet.absoluteFill,
                            { backgroundColor: "rgba(0,0,0,0.2)" },
                        ]}
                        onPress={() => setModalOpen(false)}
                    >
                        <TouchableWithoutFeedback>
                            <View
                                style={{
                                    marginVertical: 200,
                                    marginHorizontal: 25,
                                    backgroundColor: Colors[theme].secondary,
                                    borderRadius: 10,
                                }}
                            >
                                {pickerComp}
                                <TouchableOpacity
                                    onPress={() => setModalOpen(false)}
                                    style={styles.closeButton}
                                >
                                    <Text style={commonStyles.modalButtonText}>
                                        Close
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </TouchableOpacity>
                </Modal>
            </TouchableOpacity>
        );

    return (
        <View style={[styles.container, { borderColor: Colors[theme].mid }]}>
            {pickerComp}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        borderRadius: 25,
    },
    closeButton: {
        padding: 10,
        backgroundColor: "rgba(255,255,255,0.05)",
    },
});
