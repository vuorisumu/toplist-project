import { Colors } from "@/utils/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";

export default function TabLayout() {
    const theme = useColorScheme() ?? "dark";

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[theme].icon,
                headerShown: false,
                sceneStyle: {
                    backgroundColor: "transparent",
                },
                tabBarStyle: {
                    borderTopWidth: 0,
                    backgroundColor: Colors[theme].background,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="home" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="categories"
                options={{
                    title: "Categories",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="cog" color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
