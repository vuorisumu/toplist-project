import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { Colors } from "@/constants/Colors";
import AppContext from "@/hooks/useAppContext";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? "light"];

    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });

    if (!loaded) {
        // Async font loading only occurs in development.
        return null;
    }

    return (
        <AppContext.Provider value={{ colors }}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
        </AppContext.Provider>
    );
}
