import { useState } from "react";
import { View } from "react-native";
import EditableField from "../inputs/EditableField";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <View>
            <EditableField
                title="Username"
                value={username}
                setValue={setUsername}
            />
            <EditableField
                title="Password"
                value={password}
                setValue={setPassword}
                secure
            />
        </View>
    );
}
