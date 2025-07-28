import Login from "@/components/blocks/Login";
import ThemeSwitch from "@/components/blocks/ThemeSwitch";
import ButtonStyled from "@/components/ButtonStyled";
import Header from "@/components/Header";
import { Paragraph } from "@/components/Paragraph";
import ViewContainer from "@/components/ViewContainer";
import { useAppContext } from "@/utils/AppContext";
import { createCommonStyles } from "@/utils/styles";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

export default function UserMenu() {
    const { t } = useTranslation();
    const { user, logout, theme } = useAppContext();
    const commonStyles = createCommonStyles(theme);

    const Settings = () => (
        <View>
            <Paragraph style={commonStyles.subHeader}>
                {t("settings.title")}
            </Paragraph>
            <ThemeSwitch />
        </View>
    );

    if (!user)
        return (
            <ViewContainer>
                <Header title={t("user.login")} />
                <Login />
                <Settings />
            </ViewContainer>
        );

    return (
        <ViewContainer>
            <Header title={t("common.menu")} />
            <Paragraph>{`${t("user.logged_in_as")} ${
                user.user_name
            }`}</Paragraph>

            <Settings />

            <ButtonStyled
                title={t("user.logout")}
                onPress={logout}
                icon={"logout"}
                alt
            />
        </ViewContainer>
    );
}
