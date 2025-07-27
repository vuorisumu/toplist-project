import { useAppContext } from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import { createCommonStyles } from "@/utils/styles";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
type Props = {
    templates?: any[];
};
export default function TemplateList({ templates }: Props) {
    const { theme } = useAppContext();
    const { t } = useTranslation();
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
                <View key={`template${template.id}`} style={commonStyles.card}>
                    <Text style={[styles.title, { color: Colors[theme].icon }]}>
                        {template.name}
                    </Text>
                    <Text>
                        {t("templates.category")}: {template.category}
                    </Text>
                </View>
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
