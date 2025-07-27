import Login from "@/components/blocks/Login";
import ButtonStyled from "@/components/ButtonStyled";
import Header from "@/components/Header";
import { Paragraph } from "@/components/Paragraph";
import ViewContainer from "@/components/ViewContainer";
import { useAppContext } from "@/utils/AppContext";

export default function UserMenu() {
    const { user, login, logout } = useAppContext();

    if (!user)
        return (
            <ViewContainer>
                <Header title="Login" />
                <Login />
            </ViewContainer>
        );

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
