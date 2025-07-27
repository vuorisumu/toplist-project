/* eslint-disable react-hooks/exhaustive-deps */
import { fetchTemplates } from "@/api/templates";
import LoadingArea from "@/components/blocks/LoadingArea";
import TemplateList from "@/components/blocks/TemplateList";
import Header from "@/components/Header";
import { Paragraph } from "@/components/Paragraph";
import ViewContainer from "@/components/ViewContainer";
import { getData, storeData } from "@/utils/cache";
import { Link } from "expo-router";
import { useEffect, useState } from "react";

export default function Index() {
    const [loading, setLoading] = useState(false);
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
            const data = await fetchTemplates();
            if (data) {
                const combined = templateData.concat(data);
                const newData = Array.from(
                    new Map(combined.map((t) => [t.id, t])).values()
                );

                setTemplateData(newData);
                await storeData("templates", newData);
                console.log("Stored", newData);
            }
        } catch (e) {
            console.log("Error fetching templates", e);
        }
        setLoading(false);
    };

    return (
        <ViewContainer refreshing={refresh} onRefresh={onRefresh}>
            <Header title="Etusivu" showLogo />
            <LoadingArea loading={loading}>
                <TemplateList templates={templateData} />
            </LoadingArea>
            <Paragraph>
                <Link href={"/template/123/edit"}>Testi</Link>
            </Paragraph>
        </ViewContainer>
    );
}
