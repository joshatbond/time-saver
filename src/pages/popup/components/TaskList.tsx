import { For } from "solid-js";
import { useAppContext } from "../utils/AppContext";
import { AppStore } from "../utils/store";
import { durationToHours } from "../utils/TimeUtils";
import TaskRow from "./TaskRow";

type Props = {};
export default function TaskList(props: Props) {
  const { taskList } = useAppContext();
  return (
    <>
      <div class="flex justify-between items-baseline select-none">
        <h2 class="text-2xl mb-4">
          Recent Tasks
          {durationReducer(taskList.state) === "0.00" ? null : (
            <span class="ml-4 text-base rounded-full px-2 py-1 bg-green-800">{`${durationReducer(
              taskList.state
            )} hours`}</span>
          )}
        </h2>

        <button
          class="px-4 py-2 bg-red-800 hover:bg-red-700 focus:bg-red-700 active-bg-red-700 rounded"
          onclick={taskList.clear}
        >
          Clear
        </button>
      </div>

      <div class="flex flex-col gap-4">
        <For each={taskList.state}>{(task) => <TaskRow task={task} />}</For>
      </div>
    </>
  );
}

function durationReducer(list: AppStore["taskList"]["state"]) {
  return durationToHours(list.reduce((a, v) => (a += v.duration), 0));
}
