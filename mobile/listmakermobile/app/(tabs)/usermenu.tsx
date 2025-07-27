import Login from "@/components/blocks/Login";
import ButtonStyled from "@/components/ButtonStyled";
import Header from "@/components/Header";
import { Paragraph } from "@/components/Paragraph";
import ViewContainer from "@/components/ViewContainer";
import { useAppContext } from "@/utils/AppContext";
import { useTranslation } from "react-i18next";

export default function UserMenu() {
    const { t } = useTranslation();
    const { user, logout } = useAppContext();

    if (!user)
        return (
            <ViewContainer>
                <Header title={t("user.login")} />
                <Login />
            </ViewContainer>
        );

    return (
        <ViewContainer>
            <Header title={t("common.menu")} />
            <Paragraph>{`${t("user.logged_in_as")} ${
                user.user_name
            }`}</Paragraph>

            <ButtonStyled
                title={t("user.logout")}
                onPress={logout}
                icon={"logout"}
                alt
            />
        </ViewContainer>
    );
}
