import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEn from "./locales/en-US/translation.json";
import translationFi from "./locales/fi-FI/translation.json";

const resources = {
    "en-US": { translation: translationEn },
    "fi-FI": { translation: translationFi },
};

const initI18n = async () => {
    let savedLanguage = await AsyncStorage.getItem("language");

    if (!savedLanguage) {
        savedLanguage = Localization.getLocales()[0]?.languageTag || "en-US";
    }

    i18n.use(initReactI18next).init({
        resources,
        lng: savedLanguage,
        fallbackLng: "en-US",
        interpolation: {
            escapeValue: false,
        },
    });
};

initI18n();

export default i18n;
