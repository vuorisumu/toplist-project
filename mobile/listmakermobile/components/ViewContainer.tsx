import type { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { useAppContext } from "@/utils/AppContext";
import { ColorKey, Colors } from "@/utils/Colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type Props = PropsWithChildren<{
    background?: ColorKey;
    noScroll?: boolean;
}>;

export default function ViewContainer({
    children,
    background,
    noScroll,
}: Props) {
    const { theme } = useAppContext();
    const backgroundColor = background || Colors[theme].background;

    if (noScroll) {
        return (
            <GestureHandlerRootView
                style={[styles.container, { backgroundColor: backgroundColor }]}
            >
                <View style={styles.content}>{children}</View>
            </GestureHandlerRootView>
        );
    }

    return (
        <GestureHandlerRootView
            style={[styles.container, { backgroundColor: backgroundColor }]}
        >
            <ScrollView scrollEventThrottle={16}>
                <View style={styles.content}>{children}</View>
            </ScrollView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 32,
        gap: 16,
        overflow: "hidden",
    },
});
