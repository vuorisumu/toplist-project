import { StyleSheet, View } from "react-native";

import Header from "@/components/Header";
import { Paragraph } from "@/components/Paragraph";
import ViewContainer from "@/components/ViewContainer";

export default function HomeScreen() {
    return (
        <ViewContainer>
            <View>
                <Header title="Etusivu" showLogo />
                <Paragraph>Etusivu</Paragraph>
            </View>
        </ViewContainer>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: "absolute",
    },
});
