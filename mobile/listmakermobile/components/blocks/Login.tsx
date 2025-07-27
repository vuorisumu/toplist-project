import { useAppContext } from "@/utils/AppContext";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import ButtonStyled from "../ButtonStyled";
import EditableField from "../inputs/EditableField";
import { Paragraph } from "../Paragraph";
import LoadingArea from "./LoadingArea";

export default function Login() {
    const { t } = useTranslation();
    const { login } = useAppContext();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | false>(false);

    const handleLogin = async () => {
        console.log("Logging in");
        setLoading(true);
        const loginData = {
            user: username,
            password: password,
        };
        await login(loginData);
        setError(t("user.login_error"));
        setLoading(false);
        setPassword("");
    };

    return (
        <View>
            <LoadingArea loading={loading}>
                <EditableField
                    title={t("user.username")}
                    value={username}
                    setValue={setUsername}
                />
                <EditableField
                    title={t("user.password")}
                    value={password}
                    setValue={setPassword}
                    secure
                />
                {error !== false && <Paragraph>{error}</Paragraph>}
            </LoadingArea>
            <ButtonStyled
                title={t("user.login")}
                icon="login"
                onPress={handleLogin}
            />
        </View>
    );
}
