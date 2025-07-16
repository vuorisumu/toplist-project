import { useAppContext } from "@/utils/AppContext";
import { createCommonStyles } from "@/utils/styles";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import CategorySelection from "../inputs/CategorySelection";
import { DropdownItem } from "../inputs/Dropdown";
import EditableField from "../inputs/EditableField";
import ItemList from "../inputs/ItemList";

type Props = {};
export default function EditableTemplate({}: Props) {
    const { t } = useTranslation();
    const { theme } = useAppContext();
    const commonStyles = createCommonStyles(theme);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<
        string | DropdownItem | undefined
    >();

    return (
        <View style={{ gap: 10 }}>
            <View>
                <Text style={commonStyles.subHeader}>
                    {t("templates.info")}
                </Text>
                <View style={styles.infoblock}>
                    <EditableField
                        title={t("templates.name")}
                        value={title}
                        setValue={setTitle}
                    />
                    <EditableField
                        title={t("templates.description")}
                        value={description}
                        setValue={setDescription}
                    />
                    <View style={styles.inputblock}>
                        <Text style={commonStyles.smallTitle}>
                            {t("templates.category")}
                        </Text>
                        <CategorySelection
                            value={category}
                            setValue={setCategory}
                        />
                    </View>
                </View>
            </View>

            <View>
                <Text style={commonStyles.subHeader}>
                    {t("templates.items")}
                </Text>
                <ItemList
                    initialItems={[
                        { item_name: "testi" },
                        { item_name: "testi2" },
                    ]}
                    onChange={(v) => console.log(v)}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    infoblock: {
        gap: 10,
    },
    inputblock: {
        gap: 5,
    },
});
