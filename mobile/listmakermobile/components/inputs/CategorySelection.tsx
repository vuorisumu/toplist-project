import { fetchAllCategories } from "@/api/categories";
import { getData } from "@/utils/cache";
import { useEffect, useState } from "react";
import Dropdown, { DropdownItem } from "./Dropdown";

type Props = {
    value?: string | DropdownItem;
    setValue: (value: string | DropdownItem) => void;
};
export default function CategorySelection({ value, setValue }: Props) {
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
                console.log("Setting cached categories");
                setCategories(cached);
            } else {
                console.log("Fetching categories");
                const res = await fetchAllCategories();
                setCategories(res);
            }
        } catch (e) {
            console.log("Error fetching categories", e);
        }
        setLoading(false);
    };

    return (
        <Dropdown
            items={categories}
            value={value || "Choose category"}
            setValue={setValue}
        />
    );
}
