import type { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";

import { ColorKey, Colors } from "@/utils/Colors";

type Props = PropsWithChildren<{
    background?: ColorKey;
}>;

export default function ViewContainer({ children, background }: Props) {
    const theme = useColorScheme() ?? "dark";
    const backgroundColor = background || Colors[theme].background;

    return (
        <View style={[styles.container, { backgroundColor: backgroundColor }]}>
            <ScrollView scrollEventThrottle={16}>
                <View style={styles.content}>{children}</View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 32,
        gap: 16,
        overflow: "hidden",
    },
});
