import { fetchAllCategories } from "@/api/categories";
import Header from "@/components/Header";
import { Paragraph } from "@/components/Paragraph";
import ViewContainer from "@/components/ViewContainer";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function Categories() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = async () => {
        setLoading(true);
        try {
            const res: any = await fetchAllCategories();
            if (!res) throw "No categories";
            setCategories(res);
        } catch (e) {
            console.log("Error", e);
        }
        setLoading(false);
    };

    return (
        <ViewContainer>
            <Header title="Categories" />
            <Paragraph>Categories</Paragraph>
            {loading ? (
                <Paragraph>Loading</Paragraph>
            ) : (
                <View>
                    {categories.map((category, index) => (
                        <Paragraph key={index}>{category.name}</Paragraph>
                    ))}
                </View>
            )}
        </ViewContainer>
    );
}
