import SwipeTabs from "@/components/SwipeTabs";
import AppContext from "@/utils/AppContext";
import { useColorScheme } from "react-native";

export default function RootLayout() {
    const theme = useColorScheme() ?? "dark";

    return (
        <AppContext.Provider value={theme}>
            <SwipeTabs />
        </AppContext.Provider>
    );
}
