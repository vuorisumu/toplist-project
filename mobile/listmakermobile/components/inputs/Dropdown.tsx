import { Picker } from "@react-native-picker/picker";
import { useState } from "react";

type Item = {
    label: string;
    value: any;
    [key: string]: any;
};
type Props = {
    items: Item[];
    value?: string | Item;
};
export default function Dropdown({ items, value }: Props) {
    const [selected, setSelected] = useState(value);

    const isPlaceholder = () => {
        if (!value) return false;
        const isFound = items.find((item) => item.value === value);
        return !isFound;
    };

    return (
        <Picker selectedValue={selected} onValueChange={(v) => setSelected(v)}>
            {value && isPlaceholder() && (
                <Picker.Item
                    label={typeof value === "string" ? value : value.value}
                    value={null}
                />
            )}

            {items.map((item) => (
                <Picker.Item
                    key={`item${item.value}`}
                    label={item.label}
                    value={item.value}
                />
            ))}
        </Picker>
    );
}
