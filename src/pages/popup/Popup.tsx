import { createSignal, For } from "solid-js";
import Timer from "./components/Timer";
import { useAppContext } from "./utils/AppContext";

export default function Popup() {
  const { taskList } = useAppContext();

  return (
    <div class="w-[400px] bg-black text-white min-h-24 p-4 space-y-12">
      <Timer />
      <div>
        <div class="flex justify-between items-baseline select-none">
          <h2 class="text-2xl mb-4">
            Recent Tasks
            {durationToHours(
              taskList.state.reduce((a, v) => (a += v.duration), 0)
            ) === "0.00" ? null : (
              <span class="ml-4 text-base rounded-full px-2 py-1 bg-green-800">
                {`${durationToHours(
                  taskList.state.reduce((a, v) => (a += v.duration), 0)
                )} hours`}
              </span>
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
          <For each={taskList.state}>
            {(task) => {
              const [isEditing, setIsEditing] = createSignal(false);
              let durationInput: HTMLInputElement;
              let descriptionInput: HTMLInputElement;

              function update(e: Event) {
                console.log("submitting form");
                e.preventDefault();

                taskList.update({
                  id: task.id,
                  description: descriptionInput.value
                    ? descriptionInput.value
                    : null,
                  duration: durationInput.value
                    ? parseFloat(durationInput.value) * 3600000
                    : null,
                });
                setIsEditing(false);
              }
              function startEdit() {
                setIsEditing(true);
              }

              return (
                <div>
                  {isEditing() ? (
                    <form
                      onsubmit={update}
                      class="flex gap-4 text-[1rem] h-10 items-baseline select-none w-full"
                    >
                      <input
                        class="bg-black outline-none px-4 py-2 w-16 text-white border-b border-white rounded-t-md hover:bg-white/10 focus:bg-white/10 active:bg-white/10"
                        ref={durationInput}
                        autofocus={true}
                        value={durationToHours(task.duration)}
                      />
                      <input
                        class="bg-black outline-none px-4 py-2 flex-1 text-white border-b border-white rounded-t-md hover:bg-white/10 focus:bg-white/10 active:bg-white/10"
                        ref={descriptionInput}
                        value={task.description}
                      />
                      <button
                        type="submit"
                        class="text-gray-400 hover:text-gray-50 focus:text-gray-50 active:text-gray-50"
                      >
                        Done
                      </button>
                    </form>
                  ) : (
                    <div class="flex gap-4 text-[1rem] h-10 items-baseline select-none">
                      <span class="bg-white/20 px-4 py-2 rounded-md">{`${durationToHours(
                        task.duration
                      )} hours`}</span>
                      <span class="flex-1">{task.description}</span>
                      <button
                        class="text-gray-400 hover:text-gray-50 focus:text-gray-50 active:text-gray-50"
                        onclick={startEdit}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );
}

function durationToHours(duration: number) {
  return (duration / 3600000).toFixed(2);
}
