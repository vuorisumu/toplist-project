import AppContext from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import { Stack } from "expo-router";
import { useState } from "react";
import { ColorSchemeName, useColorScheme } from "react-native";

export default function RootLayout() {
    const [theme, setTheme] = useState<"dark" | "light">(
        useColorScheme() ?? "dark"
    );

    const applyTheme = (newTheme: ColorSchemeName) => {
        if (newTheme === null || newTheme === undefined) return;
        if (newTheme !== theme) setTheme(newTheme);
    };

    return (
        <AppContext.Provider value={{ theme, applyTheme }}>
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
