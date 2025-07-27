import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "./apiutils";

/**
 * Sends login credentials to database to check if the login information was
 * correct.
 *
 * @param {object} loginData - Data containing either username or email, and a password
 * @returns a response containing information about the login attempt
 */
export const userLogin = (loginData) => {
    return fetch(`${BASE_URL}/users/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
    })
        .then((response) => response.json())
        .catch((error) => console.error(error));
};

export const auth = async () => {
    try {
        const token = await AsyncStorage.getItem("token");
        const res = fetch(`${BASE_URL}/users/auth/`, {
            headers: {
                Authorization: `${token}`,
                "Content-Type": "application/json",
            },
        });
        return res.json();
    } catch (e) {
        console.log("Error authenticating", e);
    }
};
