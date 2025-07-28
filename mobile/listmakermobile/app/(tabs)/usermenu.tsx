import Login from "@/components/blocks/Login";
import ThemeSwitch from "@/components/blocks/ThemeSwitch";
import ButtonStyled from "@/components/ButtonStyled";
import Header from "@/components/Header";
import { Paragraph } from "@/components/Paragraph";
import ViewContainer from "@/components/ViewContainer";
import { useAppContext } from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import { createCommonStyles } from "@/utils/styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

export default function UserMenu() {
    const { t } = useTranslation();
    const { user, logout, theme } = useAppContext();
    const router = useRouter();
    const commonStyles = createCommonStyles(theme);
    const fontSize = 16;

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
            <TouchableOpacity
                style={[commonStyles.basicRow, commonStyles.card]}
                onPress={() => router.push(`/user/${user.user_name}`)}
            >
                <MaterialIcons
                    name="account-circle"
                    color={Colors[theme].mid}
                    size={30}
                />
                <Text style={[commonStyles.boldedText, { fontSize: 18 }]}>
                    {user.user_name}
                </Text>
            </TouchableOpacity>

            <Link
                href={`/user/settings`}
                style={[commonStyles.basicLink, { fontSize }]}
            >
                {t("settings.account_settings")}
            </Link>

            <Link
                href={`/user/${user.user_name}/templates`}
                style={[commonStyles.basicLink, { fontSize }]}
            >
                {t("user.own_templates")}
            </Link>

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
