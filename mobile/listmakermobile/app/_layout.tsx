import AppContext from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function RootLayout() {
    const theme = useColorScheme() ?? "dark";

    return (
        <AppContext.Provider value={theme}>
            <Stack
                screenOptions={{
                    contentStyle: {
                        backgroundColor: Colors[theme].background,
                    },
                }}
            >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </AppContext.Provider>
    );
}
