import type { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { ColorKey } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";

type Props = PropsWithChildren<{
    background?: ColorKey;
}>;

export default function ViewContainer({ children, background }: Props) {
    const bottom = useBottomTabOverflow();
    const backgroundColor = useThemeColor(background || "background");

    return (
        <View style={[styles.container, { backgroundColor: backgroundColor }]}>
            <ScrollView
                scrollEventThrottle={16}
                scrollIndicatorInsets={{ bottom }}
                contentContainerStyle={{ paddingBottom: bottom }}
            >
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
