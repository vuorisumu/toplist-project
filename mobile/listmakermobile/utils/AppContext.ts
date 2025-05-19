import { createContext, useContext } from "react";

type Theme = "light" | "dark";
interface AppContextType {
    theme: Theme;
    applyTheme: (theme: Theme) => void;
}

const defaultContext: AppContextType = {
    theme: "dark",
    applyTheme: () => {},
};

const AppContext = createContext<AppContextType>(defaultContext);
export const useAppContext = () => useContext(AppContext);
export default AppContext;
