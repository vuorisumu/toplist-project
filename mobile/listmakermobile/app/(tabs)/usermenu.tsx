import ButtonStyled from "@/components/ButtonStyled";
import Header from "@/components/Header";
import { Paragraph } from "@/components/Paragraph";
import ViewContainer from "@/components/ViewContainer";
import { useAppContext } from "@/utils/AppContext";

export default function UserMenu() {
    const { login, logout } = useAppContext();

    return (
        <ViewContainer>
            <Header title="Menu" />
            <Paragraph>User menu</Paragraph>
            <ButtonStyled
                title="Login"
                onPress={() => login({ name: "Test" })}
            />
            <ButtonStyled title="Logout" onPress={() => logout()} alt />
        </ViewContainer>
    );
}
