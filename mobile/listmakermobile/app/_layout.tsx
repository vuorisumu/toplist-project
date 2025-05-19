import AppContext from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import { Stack } from "expo-router";
import { useState } from "react";
import { ColorSchemeName, useColorScheme } from "react-native";

export default function RootLayout() {
    const [user, setUser] = useState<any>(false);
    const [theme, setTheme] = useState<"dark" | "light">(
        useColorScheme() ?? "dark"
    );

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
        <AppContext.Provider value={{ theme, applyTheme, user, login, logout }}>
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
