import { useAppContext } from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function TabLayout() {
    const { theme, user } = useAppContext();
    const iconSize = 28;

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[theme].icon,
                header: () => <View style={{ height: 42 }} />,
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
                        <MaterialIcons
                            name="home"
                            size={iconSize}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="categories"
                options={{
                    title: "Categories",
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons
                            name="list-alt"
                            size={iconSize}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="template"
                options={{
                    title: "New Template",
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons
                            name="format-list-bulleted-add"
                            size={iconSize}
                            color={color}
                        />
                    ),
                    href: user ? "/template/new" : null,
                }}
            />
            <Tabs.Screen
                name="usermenu"
                options={{
                    title: user ? "User" : "Log in",
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons
                            name={user ? "account-circle" : "login"}
                            size={iconSize}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
