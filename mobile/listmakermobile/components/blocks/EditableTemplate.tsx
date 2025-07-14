import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Dropdown from "../inputs/Dropdown";
import EditableField from "../inputs/EditableField";

type Props = {};
export default function EditableTemplate({}: Props) {
    const { t } = useTranslation();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    return (
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
            <Dropdown
                items={[
                    { label: "test", value: "test" },
                    { label: "test 2", value: "test2" },
                ]}
                value={"Placeholder"}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    infoblock: {
        gap: 10,
    },
});
