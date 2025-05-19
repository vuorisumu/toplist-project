import AppContext from "@/utils/AppContext";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function RootLayout() {
    const theme = useColorScheme() ?? "dark";

    return (
        <AppContext.Provider value={theme}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </AppContext.Provider>
    );
}
