import { useState } from "react";
import { View } from "react-native";
import EditableField from "./EditableField";

type Props = {};
export default function EditableTemplate({}: Props) {
    const [title, setTitle] = useState("");
    return (
        <View>
            <EditableField title="Nimi" value={title} setValue={setTitle} />
        </View>
    );
}
