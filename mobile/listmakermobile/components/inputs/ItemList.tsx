import { useAppContext } from "@/utils/AppContext";
import { createCommonStyles } from "@/utils/styles";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
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

    return (
        <View>
            {items.map((item) => (
                <MemoizedItem
                    key={`item-${item.id}`}
                    item={item}
                    updateItemName={updateItemName}
                    style={commonStyles.basicRow}
                />
            ))}
        </View>
    );
}

type ItemProps = {
    item: any;
    updateItemName: (name: string, id: string) => void;
    style: ViewStyle;
};

const Item = ({ item, updateItemName, style }: ItemProps) => (
    <View style={style}>
        <EditableField
            value={item.item_name}
            setValue={(v) => updateItemName(v, item.id)}
        />
    </View>
);

const MemoizedItem = React.memo(Item, (prev, next) => {
    return prev.item.item_name === next.item.item_name;
});

const style = StyleSheet.create({});
