import { useAppContext } from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import uuid from "react-native-uuid";
import ButtonStyled from "../ButtonStyled";
import EditableField from "./EditableField";
import ImagePicker from "./ImagePicker";

type Props = {
    initialItems: any[];
    onChange: (items: any[]) => void;
    hasImages?: boolean;
};
export default function ItemList({ initialItems, onChange, hasImages }: Props) {
    const { theme } = useAppContext();
    const [items, setItems] = useState(
        [...initialItems].map((item) => {
            return { id: uuid.v4(), ...item };
        })
    );

    useEffect(() => {
        onChange(items);
    }, [items, onChange]);

    const updateItemName = useCallback((name: string, id: string) => {
        setItems((prev) =>
            prev.map((it) => (it.id === id ? { ...it, item_name: name } : it))
        );
    }, []);

    const updateItemImage = useCallback((img: any, id: string) => {
        setItems((prev) =>
            prev.map((it) =>
                it.id === id ? { ...it, img: img, img_id: uuid.v4() } : it
            )
        );
    }, []);

    const deleteItem = (id: string) => {
        setItems((prev) => prev.filter((it) => it.id !== id));
    };

    const addNewItem = () => {
        setItems((prev) => [...prev, { item_name: "", id: uuid.v4() }]);
    };

    return (
        <View style={styles.list}>
            {items.map((item) => (
                <MemoizedItem
                    key={`item-${item.id}`}
                    item={item}
                    updateItemName={updateItemName}
                    updateItemImage={updateItemImage}
                    deleteItem={deleteItem}
                    iconColor={Colors[theme].icon}
                    showImage={hasImages === true}
                />
            ))}
            <ButtonStyled title="Add new item" onPress={addNewItem} />
        </View>
    );
}

type ItemProps = {
    item: any;
    updateItemName: (name: string, id: string) => void;
    updateItemImage: (img: any, id: string) => void;
    deleteItem: (id: string) => void;
    iconColor: string;
    showImage: boolean;
};

const Item = ({
    item,
    updateItemName,
    updateItemImage,
    deleteItem,
    iconColor,
    showImage,
}: ItemProps) => (
    <View style={styles.row}>
        {showImage && (
            <View>
                <ImagePicker
                    small
                    img={item.img}
                    setImg={(img) => updateItemImage(img, item.id)}
                />
            </View>
        )}
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
    return (
        prev.item.item_name === next.item.item_name &&
        prev.showImage === next.showImage
    );
});

const styles = StyleSheet.create({
    list: {
        gap: 10,
        paddingVertical: 10,
    },
    row: {
        gap: 10,
        flexDirection: "row",
        alignItems: "center",
    },
});
