import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useAppContext } from "@/hooks/useAppContext";

export default function TabLayout() {
    const { colors } = useAppContext();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.icon,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        // Use a transparent background on iOS to show the blur effect
                        position: "absolute",
                    },
                    default: {
                        borderTopWidth: 0,
                    },
                }),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="house.fill" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="categories"
                options={{
                    title: "Categories",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol
                            size={28}
                            name="list.clipboard.fill"
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
                        <IconSymbol
                            size={28}
                            name="list.bullet"
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="useroptions"
                options={{
                    title: "User options",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol
                            size={28}
                            name="person.bust"
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
