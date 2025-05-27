import Header from "@/components/Header";
import { useAppContext } from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import { Stack } from "expo-router";

export default function ListLayout() {
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
            <Stack.Screen name="[id]" options={{ title: "Top List" }} />
            <Stack.Screen
                name="[id]/edit"
                options={{ title: "Edit Top List" }}
            />
        </Stack>
    );
}
