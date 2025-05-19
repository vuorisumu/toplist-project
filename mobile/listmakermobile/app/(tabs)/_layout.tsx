import { useAppContext } from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";

export default function TabLayout() {
    const { theme } = useAppContext();
    const iconSize = 28;

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
                name="newtemplate"
                options={{
                    title: "New Template",
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons
                            name="format-list-bulleted-add"
                            size={iconSize}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="usermenu"
                options={{
                    title: "User",
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons
                            name="account-circle"
                            size={iconSize}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
