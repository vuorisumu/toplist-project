import Header from "@/components/Header";
import { Paragraph } from "@/components/Paragraph";
import ViewContainer from "@/components/ViewContainer";

export default function NewList() {
    return (
        <ViewContainer>
            <Header title="New top list" />
            <Paragraph>Creating new top list from template</Paragraph>
        </ViewContainer>
    );
}
