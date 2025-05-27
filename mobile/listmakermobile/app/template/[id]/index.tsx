import Header from "@/components/Header";
import { Paragraph } from "@/components/Paragraph";
import ViewContainer from "@/components/ViewContainer";

export default function ViewTemplate() {
    return (
        <ViewContainer>
            <Header title="Template" />
            <Paragraph>Single template page</Paragraph>
        </ViewContainer>
    );
}
