import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

export default function TabBarBackground() {
    const colorScheme = useColorScheme();
    const backgroundColor = Colors[colorScheme ?? "light"].background;
    const sharedStyles: StyleProp<ViewStyle> = {
        backgroundColor: backgroundColor,
    };

    if (Platform.OS === "ios") {
        return (
            <BlurView
                tint="systemChromeMaterial"
                intensity={100}
                style={[StyleSheet.absoluteFillObject, sharedStyles]}
            />
        );
    }

    return <View style={[StyleSheet.absoluteFillObject, sharedStyles]}></View>;
}

export function useBottomTabOverflow() {
    return useBottomTabBarHeight();
}
