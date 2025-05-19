import Header from "@/components/Header";
import { Paragraph } from "@/components/Paragraph";
import ViewContainer from "@/components/ViewContainer";

export default function Index() {
    return (
        <ViewContainer>
            <Header title="Etusivu" showLogo />
            <Paragraph>Edit app/index.tsx to edit this screen.</Paragraph>
        </ViewContainer>
    );
}
