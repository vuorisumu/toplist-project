import { StyleSheet } from "react-native";

import Header from "@/components/Header";
import { Paragraph } from "@/components/Paragraph";
import ViewContainer from "@/components/ViewContainer";

export default function NewTemplateScreen() {
    return (
        <ViewContainer>
            <Header title="New template" />
            <Paragraph>New template</Paragraph>
        </ViewContainer>
    );
}

const styles = StyleSheet.create({});
