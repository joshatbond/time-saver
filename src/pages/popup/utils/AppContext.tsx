import { createContext, JSXElement, useContext } from "solid-js";
import { AppStore, store } from "./store";

const AppContext = createContext<AppStore>();

type Props = {
  children: JSXElement;
};
export function AppProvider(props: Props) {
  return (
    <AppContext.Provider value={store}>{props.children}</AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
