import type { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { useAppContext } from "@/utils/AppContext";
import { ColorKey, Colors } from "@/utils/Colors";

type Props = PropsWithChildren<{
    background?: ColorKey;
}>;

export default function ViewContainer({ children, background }: Props) {
    const { theme } = useAppContext();
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
        paddingTop: 42,
        paddingHorizontal: 32,
        gap: 16,
        overflow: "hidden",
    },
});
