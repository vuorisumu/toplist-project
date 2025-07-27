import { fetchTemplates } from "@/api/templates";
import LoadingArea from "@/components/blocks/LoadingArea";
import TemplateList from "@/components/blocks/TemplateList";
import ButtonStyled from "@/components/ButtonStyled";
import Header from "@/components/Header";
import ViewContainer from "@/components/ViewContainer";
import { getData, storeData } from "@/utils/cache";
import { useEffect, useState } from "react";

export default function Index() {
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [templateData, setTemplateData] = useState<any[]>([]);

    useEffect(() => {
        loadTemplates();
    }, []);

    const onRefresh = async () => {
        setRefresh(true);
        await loadTemplates(true);
        setRefresh(false);
    };

    const loadTemplates = async (fresh?: boolean) => {
        setLoading(true);
        try {
            if (!fresh) {
                const cached = await getData("templates");
                console.log("Cache found:", cached);
                if (cached) setTemplateData(cached);
                setLoading(false);
                return;
            }
            const data = await fetchTemplates({
                sortBy: "id",
                sortOrder: "desc",
                from: 0,
                amount: 5,
            });
            if (data) {
                setTemplateData(data);
                await storeData("templates", data);
            }
        } catch (e) {
            console.log("Error fetching templates", e);
        }
        setLoading(false);
    };

    const loadMore = async () => {
        setLoadingMore(true);
        try {
            const data = await fetchTemplates({
                sortBy: "id",
                sortOrder: "desc",
                from: templateData.length,
                amount: 5,
            });
            if (data) {
                const newData = [...templateData, ...data];
                setTemplateData(newData);
                await storeData("templates", newData);
            }
        } catch (e) {
            console.log("Error loading more", e);
        }
        setLoadingMore(false);
    };

    return (
        <ViewContainer refreshing={refresh} onRefresh={onRefresh}>
            <Header title="Etusivu" showLogo />
            <LoadingArea loading={loading}>
                <TemplateList templates={templateData} />
            </LoadingArea>
            <ButtonStyled
                onPress={loadMore}
                title="Load more"
                loading={loadingMore}
            />
        </ViewContainer>
    );
}
