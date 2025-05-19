import Header from "@/components/Header";
import { Paragraph } from "@/components/Paragraph";
import ViewContainer from "@/components/ViewContainer";
import { useAppContext } from "@/utils/AppContext";
import { Button } from "react-native";

export default function UserMenu() {
    const { login } = useAppContext();

    return (
        <ViewContainer>
            <Header title="Menu" />
            <Paragraph>User menu</Paragraph>
            <Button onPress={() => login({ name: "test" })} title="Login" />
        </ViewContainer>
    );
}
