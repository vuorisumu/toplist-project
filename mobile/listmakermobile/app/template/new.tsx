import { addNewTemplate } from "@/api/templates";
import EditableTemplate from "@/components/blocks/EditableTemplate";
import ViewContainer from "@/components/ViewContainer";
import { useAppContext } from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import { useState } from "react";
import { KeyboardAvoidingView } from "react-native";

export default function NewTemplate() {
    const { theme } = useAppContext();
    const [saving, setSaving] = useState(false);

    const saveTemplate = async (templateData: any) => {
        setSaving(true);
        try {
            const res = await addNewTemplate(templateData);
            console.log(res);
        } catch (e) {
            console.log("Error", e);
        }
        setSaving(false);
    };

    return (
        <KeyboardAvoidingView
            behavior={"padding"}
            style={{ flex: 1, backgroundColor: Colors[theme].background }}
        >
            <ViewContainer>
                <EditableTemplate onSubmit={saveTemplate} saving={saving} />
            </ViewContainer>
        </KeyboardAvoidingView>
    );
}
