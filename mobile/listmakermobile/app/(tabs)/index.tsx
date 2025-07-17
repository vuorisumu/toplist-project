import { fetchTemplates } from "@/api/templates";
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
    const [templateData, setTemplateData] = useState([]);

    useEffect(() => {
        console.log("Templates", templateData);
    }, [templateData]);

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
                const newData = templateData.concat(data);
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
            <TemplateList templates={templateData} />
            <Paragraph>
                <Link href={"/template/123/edit"}>Testi</Link>
            </Paragraph>
        </ViewContainer>
    );
}
