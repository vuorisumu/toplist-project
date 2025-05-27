import Header from "@/components/Header";
import { Paragraph } from "@/components/Paragraph";
import ViewContainer from "@/components/ViewContainer";

export default function NewTemplate() {
    return (
        <ViewContainer>
            <Header title="New template" />
            <Paragraph>Creating new template</Paragraph>
        </ViewContainer>
    );
}
