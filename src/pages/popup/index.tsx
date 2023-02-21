import { render } from "solid-js/web";
import Popup from "./Popup";
import { TaskProvider } from "./utils/store";

const appContainer = document.querySelector("#app-container");
if (!appContainer) {
  throw new Error("Can not find AppContainer");
}

render(
  () => (
    <TaskProvider>
      <Popup />
    </TaskProvider>
  ),
  appContainer
);
