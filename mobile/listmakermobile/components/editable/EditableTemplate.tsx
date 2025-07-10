import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import EditableField from "./EditableField";

type Props = {};
export default function EditableTemplate({}: Props) {
    const { t } = useTranslation();
    const [title, setTitle] = useState("");

    return (
        <View>
            <EditableField title="Nimi" value={title} setValue={setTitle} />
        </View>
    );
}
