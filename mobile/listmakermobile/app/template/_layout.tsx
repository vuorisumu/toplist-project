import Header from "@/components/Header";
import { useAppContext } from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import { Stack } from "expo-router";

export default function TemplateLayout() {
    const { theme } = useAppContext();
    const tint = Colors[theme].icon;

    return (
        <Stack
            screenOptions={{
                headerShadowVisible: false,
                headerStyle: { backgroundColor: "transparent" },
                headerTitle: (props) => <Header title={props.children} />,
                headerTintColor: tint,
            }}
        >
            <Stack.Screen name="new" options={{ title: "New Template" }} />
            <Stack.Screen name="[id]/index" options={{ title: "Template" }} />
            <Stack.Screen
                name="[id]/create"
                options={{ title: "New Top List" }}
            />
            <Stack.Screen
                name="[id]/edit"
                options={{ title: "Edit Template" }}
            />
        </Stack>
    );
}
