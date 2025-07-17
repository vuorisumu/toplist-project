import EditableTemplate from "@/components/blocks/EditableTemplate";
import ViewContainer from "@/components/ViewContainer";
import { useAppContext } from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import { KeyboardAvoidingView } from "react-native";

export default function NewTemplate() {
    const { theme } = useAppContext();

    return (
        <KeyboardAvoidingView
            behavior={"padding"}
            style={{ flex: 1, backgroundColor: Colors[theme].background }}
        >
            <ViewContainer>
                <EditableTemplate />
            </ViewContainer>
        </KeyboardAvoidingView>
    );
}
