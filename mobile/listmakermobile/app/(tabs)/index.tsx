import Header from "@/components/Header";
import { Paragraph } from "@/components/Paragraph";
import ViewContainer from "@/components/ViewContainer";
import { Link } from "expo-router";

export default function Index() {
    return (
        <ViewContainer>
            <Header title="Etusivu" showLogo />
            <Paragraph>Edit app/index.tsx to edit this screen.</Paragraph>
            <Paragraph>
                <Link href={"/template/123/edit"}>Testi</Link>
            </Paragraph>
        </ViewContainer>
    );
}
