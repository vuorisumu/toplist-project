import Header from "@/components/Header";
import { useAppContext } from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import { Stack } from "expo-router";

export default function UserLayout() {
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
            <Stack.Screen name="settings" options={{ title: "Settings" }} />
            <Stack.Screen
                name="[username]/index"
                options={{ title: "User page" }}
            />
            <Stack.Screen
                name="[username]/templates"
                options={{ title: "User's templates" }}
            />
            <Stack.Screen
                name="[username]/toplists"
                options={{ title: "User's top lists" }}
            />
        </Stack>
    );
}
