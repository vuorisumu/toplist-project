import "@/i18n";
import AppContext from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import { Stack } from "expo-router";
import * as SystemUI from "expo-system-ui";
import { useState } from "react";
import { ColorSchemeName, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
    const [user, setUser] = useState<any>(false);
    const [theme, setTheme] = useState<"dark" | "light">(
        useColorScheme() ?? "dark"
    );
    SystemUI.setBackgroundColorAsync(Colors[theme].background);

    const applyTheme = (newTheme: ColorSchemeName) => {
        if (newTheme === null || newTheme === undefined) return;
        if (newTheme !== theme) setTheme(newTheme);
    };

    const login = async (credentials: any) => {
        console.log("Login here");
        setUser(credentials);
    };

    const logout = () => {
        console.log("Logout here");
        setUser(false);
    };

    return (
        <GestureHandlerRootView>
            <AppContext.Provider
                value={{ theme, applyTheme, user, login, logout }}
            >
                <Stack
                    screenOptions={{
                        contentStyle: {
                            backgroundColor: Colors[theme].background,
                        },
                        headerShown: false,
                    }}
                >
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="template" />
                    <Stack.Screen name="toplist" />
                    <Stack.Screen name="user" />
                </Stack>
            </AppContext.Provider>
        </GestureHandlerRootView>
    );
}
