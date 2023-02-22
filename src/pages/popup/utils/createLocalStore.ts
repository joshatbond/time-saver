import { createEffect } from "solid-js";
import { createStore } from "solid-js/store";

export default function createLocalStore<T extends Object>(
  key: string,
  initState: T
) {
  const [state, setState] = createStore(initState);

  if (localStorage[key]) {
    try {
      setState(JSON.parse(localStorage[key]));
    } catch (error) {
      setState(() => initState);
    }
  }

  createEffect(() => (localStorage[key] = JSON.stringify(state)));

  return [state, setState] as const;
}
