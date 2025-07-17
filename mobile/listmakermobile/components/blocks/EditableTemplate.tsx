import { useAppContext } from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import { createCommonStyles } from "@/utils/styles";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { Switch } from "react-native-gesture-handler";
import CategorySelection from "../inputs/CategorySelection";
import { DropdownItem } from "../inputs/Dropdown";
import EditableField from "../inputs/EditableField";
import ImagePicker from "../inputs/ImagePicker";
import ItemList from "../inputs/ItemList";
import { Paragraph } from "../Paragraph";

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
    const [items, setItems] = useState([{ item_name: "" }]);
    const [isBlank, setIsBlank] = useState(false);

    return (
        <View style={{ gap: 10 }}>
            <View>
                <Text style={commonStyles.subHeader}>
                    {t("templates.info")}
                </Text>
                <ImagePicker />
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
                <View style={commonStyles.basicRow}>
                    <Switch
                        value={isBlank}
                        onChange={() => setIsBlank(!isBlank)}
                        trackColor={{ true: Colors[theme].icon }}
                        thumbColor={Colors[theme].text}
                    />
                    <Paragraph>{t("templates.make_blank")}</Paragraph>
                </View>

                {isBlank ? (
                    <Paragraph>{t("templates.blank_desc")}</Paragraph>
                ) : (
                    <ItemList initialItems={items} onChange={setItems} />
                )}
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
