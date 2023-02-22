import { render } from "solid-js/web";
import Popup from "./Popup";
import { AppProvider } from "./utils/AppContext";

const appContainer = document.querySelector("#app-container");
if (!appContainer) {
  throw new Error("Can not find AppContainer");
}

render(
  () => (
    <AppProvider>
      <Popup />
    </AppProvider>
  ),
  appContainer
);
