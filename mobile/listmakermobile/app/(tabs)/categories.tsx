import { View } from "react-native";

import Header from "@/components/Header";
import { Paragraph } from "@/components/Paragraph";
import ViewContainer from "@/components/ViewContainer";

export default function CategoryScreen() {
    return (
        <ViewContainer>
            <View>
                <Header title="Categories" />
                <Paragraph>Categories</Paragraph>
            </View>
        </ViewContainer>
    );
}
