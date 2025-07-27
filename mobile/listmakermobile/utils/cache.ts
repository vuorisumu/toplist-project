import { fetchAllCategories } from "@/api/categories";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_TTL = 30 * 60 * 1000;

export const storeData = async (key: string, value: any) => {
    try {
        const timestamp = Date.now();
        const jsonValue = JSON.stringify({ data: value, timestamp: timestamp });
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        console.log("Error storing data to", key, e);
    }
};

export const getData = async (key: string) => {
    try {
        const cached = await AsyncStorage.getItem(key);
        if (!cached) return null;
        const jsonValue = JSON.parse(cached);
        const now = Date.now();

        // Data found, not expired
        if (now - jsonValue.timestamp < CACHE_TTL) {
            return jsonValue.data;
        }

        // Data expired
        await removeValue(key);
        return null;
    } catch (e) {
        console.log("Error fetching data", e);
        return null;
    }
};

const removeValue = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (e) {
        console.log("Error removing value", e);
    }
};

export const getCategoryByID = async (id: number) => {
    try {
        if (!id || isNaN(id)) throw "ID error";
        const cached = await AsyncStorage.getItem(`categories`);
        if (cached) {
            const categories = JSON.parse(cached);
            console.log("Cached categories", categories);
            const match = categories.data.find((c: any) => c.id === id);
            if (match) return match.name;
        }

        const res = await fetchAllCategories();
        console.log("fetched categories", res);
        await storeData("categories", res);
        const match = res.find((c: any) => c.id === id);
        if (match) return match.name;
    } catch (e) {
        console.log(e);
        return "Uncategorized";
    }
};
