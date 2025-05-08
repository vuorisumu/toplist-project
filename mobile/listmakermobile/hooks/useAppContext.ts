import { createContext, useContext } from "react";
const AppContext = createContext<any>({});
export const useAppContext = () => useContext(AppContext);
export default AppContext;
