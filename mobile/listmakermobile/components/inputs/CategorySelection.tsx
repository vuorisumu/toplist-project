import { fetchAllCategories } from "@/api/categories";
import { useAppContext } from "@/utils/AppContext";
import { getData, storeData } from "@/utils/cache";
import { Colors } from "@/utils/Colors";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Dropdown, { DropdownItem } from "./Dropdown";

type Props = {
    value?: string | DropdownItem;
    setValue: (value: string | DropdownItem) => void;
};
export default function CategorySelection({ value, setValue }: Props) {
    const { theme } = useAppContext();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getItems();
    }, []);

    const getItems = async () => {
        setLoading(true);
        try {
            const cached = await getData("categories");
            if (cached) {
                setCategories(cached);
            } else {
                const res = await fetchAllCategories();
                await storeData("categories", res);
                setCategories(res);
            }
        } catch (e) {
            console.log("Error fetching categories", e);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <View
                style={[styles.placeholder, { borderColor: Colors[theme].mid }]}
            >
                <ActivityIndicator size={"large"} color={Colors[theme].icon} />
            </View>
        );
    }

    return (
        <Dropdown
            items={categories}
            value={value}
            placeholder="Choose category"
            setValue={setValue}
        />
    );
}

const styles = StyleSheet.create({
    placeholder: {
        borderWidth: 2,
        borderRadius: 25,
        padding: 5,
    },
});
