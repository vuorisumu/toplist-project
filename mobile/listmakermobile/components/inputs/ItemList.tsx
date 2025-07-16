import { useAppContext } from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import { createCommonStyles } from "@/utils/styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import uuid from "react-native-uuid";
import EditableField from "./EditableField";

type Props = {
    initialItems: any[];
    onChange: (items: any[]) => void;
};
export default function ItemList({ initialItems, onChange }: Props) {
    const { theme } = useAppContext();
    const commonStyles = createCommonStyles(theme);
    const [items, setItems] = useState([
        ...initialItems.map((item) => {
            item.id = uuid.v4();
            return item;
        }),
    ]);

    useEffect(() => {
        onChange(items);
    }, [items, onChange]);

    const updateItemName = useCallback((name: string, id: string) => {
        setItems((prev) =>
            prev.map((it) => (it.id === id ? { ...it, item_name: name } : it))
        );
    }, []);

    const deleteItem = (id: string) => {
        setItems((prev) => prev.filter((it) => it.id !== id));
    };

    return (
        <View>
            {items.map((item) => (
                <MemoizedItem
                    key={`item-${item.id}`}
                    item={item}
                    updateItemName={updateItemName}
                    deleteItem={deleteItem}
                    iconColor={Colors[theme].icon}
                />
            ))}
        </View>
    );
}

type ItemProps = {
    item: any;
    updateItemName: (name: string, id: string) => void;
    deleteItem: (id: string) => void;
    iconColor: string;
};

const Item = ({ item, updateItemName, deleteItem, iconColor }: ItemProps) => (
    <View style={styles.row}>
        <View style={{ flex: 1 }}>
            <EditableField
                value={item.item_name}
                setValue={(v) => updateItemName(v, item.id)}
            />
        </View>
        <Pressable onPress={() => deleteItem(item.id)}>
            <MaterialIcons name={"delete"} size={24} color={iconColor} />
        </Pressable>
    </View>
);

const MemoizedItem = React.memo(Item, (prev, next) => {
    return prev.item.item_name === next.item.item_name;
});

const styles = StyleSheet.create({
    row: {
        gap: 10,
        flexDirection: "row",
        alignItems: "center",
    },
});
