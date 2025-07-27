import { useAppContext } from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import { createCommonStyles } from "@/utils/styles";
import { Link, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Paragraph } from "../Paragraph";
import TemplateCategory from "./TemplateCategory";
type Props = {
    templates?: any[];
};
export default function TemplateList({ templates }: Props) {
    const { theme } = useAppContext();
    const { t } = useTranslation();
    const router = useRouter();
    const commonStyles = createCommonStyles(theme);
    if (!templates || templates.length === 0)
        return (
            <View>
                <Text>No templates found</Text>
            </View>
        );
    return (
        <View style={styles.container}>
            {templates.map((template) => (
                <TouchableOpacity
                    key={`template${template.id}`}
                    style={commonStyles.card}
                    onPress={() => router.push(`/template/${template.id}/`)}
                >
                    <Text style={[styles.title, { color: Colors[theme].icon }]}>
                        {template.name}
                    </Text>
                    <TemplateCategory id={template.category} />
                    <Paragraph>
                        {t("templates.creator")}:{" "}
                        <Link
                            href={`/user/${template.user_name}`}
                            style={{
                                color: Colors[theme].icon,
                                fontWeight: 400,
                            }}
                        >
                            {template.user_name}
                        </Link>
                    </Paragraph>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 10,
    },
    title: {
        fontWeight: 600,
        fontSize: 18,
    },
});
