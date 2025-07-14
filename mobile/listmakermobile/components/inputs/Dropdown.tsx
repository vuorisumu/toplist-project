import { Picker } from "@react-native-picker/picker";

export type DropdownItem = {
    label: string;
    value: any;
    [key: string]: any;
};
type Props = {
    items: DropdownItem[];
    value?: string | DropdownItem;
    setValue: (value: string | DropdownItem) => void;
};
export default function Dropdown({ items, value, setValue }: Props) {
    const isPlaceholder = () => {
        if (!value) return false;
        const isFound = items.find((item) => item.value === value);
        return !isFound;
    };

    return (
        <Picker selectedValue={value} onValueChange={(v) => setValue(v)}>
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
