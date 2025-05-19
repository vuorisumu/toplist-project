import { createContext, useContext } from "react";

type Theme = "light" | "dark";
interface AppContextType {
    theme: Theme;
    applyTheme: (theme: Theme) => void;
    user: any;
    login: (credentials: any) => void;
    logout: () => void;
}

const defaultContext: AppContextType = {
    theme: "dark",
    applyTheme: () => {},
    user: false,
    login: () => {},
    logout: () => {},
};

const AppContext = createContext<AppContextType>(defaultContext);
export const useAppContext = () => useContext(AppContext);
export default AppContext;
