import { useAppContext } from "@/utils/AppContext";
import { Colors } from "@/utils/Colors";
import { createCommonStyles } from "@/utils/styles";
import { View } from "react-native";
import { Switch } from "react-native-gesture-handler";
import { Paragraph } from "../Paragraph";

export default function ThemeSwitch() {
    const { theme, applyTheme } = useAppContext();
    const commonStyles = createCommonStyles(theme);

    const handleThemeChange = () => {
        if (theme === "light") applyTheme("dark");
        else applyTheme("light");
    };

    return (
        <View style={[commonStyles.basicRow]}>
            <Paragraph style={{ flex: 1 }}>Dark theme</Paragraph>
            <Switch
                value={theme === "dark"}
                onChange={handleThemeChange}
                trackColor={{ true: Colors[theme].icon }}
                thumbColor={Colors[theme].text}
            />
        </View>
    );
}
