import { addNewTemplate } from "@/api/templates";
import EditableTemplate from "@/components/blocks/EditableTemplate";
import ViewContainer from "@/components/ViewContainer";
import { useAppContext } from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView } from "react-native";

export default function NewTemplate() {
    const { theme } = useAppContext();
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    const saveTemplate = async (templateData: any) => {
        setSaving(true);
        try {
            console.log("Adding template with data", templateData);
            const res = await addNewTemplate(templateData);
            if (res.id) {
                router.push(`/template/${res.id}/`);
            }
        } catch (e) {
            console.log("Error saving template", e);
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
