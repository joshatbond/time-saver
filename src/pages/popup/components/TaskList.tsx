import { For } from "solid-js";
import { useAppContext } from "../utils/AppContext";
import { durationToHours } from "../utils/TimeUtils";
import { AppStore } from "../utils/store";

import TaskRow from "./TaskRow";

export default function TaskList() {
  const { state, clear, addTask } = useAppContext();

  return (
    <>
      <div class="flex select-none items-center justify-between">
        <button
          class="mr-4 flex items-center justify-center gap-2 rounded bg-green-800 px-4 py-2 hover:bg-green-700 focus:bg-green-700 active:bg-green-700"
          onClick={() => addTask()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-4 w-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add a New Task
        </button>

        <button
          class="flex items-center justify-center gap-2 rounded border border-transparent px-4 py-2 outline-none hover:border-red-700 focus:border-red-700 active:border-red-700"
          onClick={clear}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-4 w-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
          Clear All
        </button>
      </div>

      <div class="flex flex-col gap-4">
        {state.length === 0 ? null : <span class="text-lg">Today</span>}

        {durationReducer(state.filter(getToday)) === "0.00" ? null : (
          <div class="text-lg">{`${durationReducer(state)} hours`}</div>
        )}

        <For each={state.filter(getToday)}>
          {(task) => <TaskRow task={task} />}
        </For>
      </div>

      <div class="flex flex-col gap-4">
        {durationReducer(state.filter(getYesterday)) === "0.00" ? null : (
          <div class="text-lg">{`Yesterday: ${durationReducer(
            state
          )} hours`}</div>
        )}

        <For each={state.filter(getYesterday)}>
          {(task) => <TaskRow task={task} />}
        </For>
      </div>
    </>
  );
}

function durationReducer(list: AppStore["state"]) {
  return durationToHours(list.reduce((a, v) => (a += v.duration), 0));
}
function getToday(t: AppStore["state"][number]) {
  return new Date(t.createdOn).getDate() === new Date().getDate();
}
function getYesterday(t: AppStore["state"][number]) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return new Date(t.createdOn).getDate() === yesterday.getDate();
}
