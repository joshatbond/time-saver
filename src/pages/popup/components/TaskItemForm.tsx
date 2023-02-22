import { AppStore } from "../utils/store";
import { durationToHours, HOURS } from "../utils/TimeUtils";

type Props = {
  task: AppStore["taskList"]["state"][number];
  onFormSubmit: AppStore["taskList"]["update"];
};
export default function TaskItemForm(props: Props) {
  let durationEl: HTMLInputElement;
  let descriptionEl: HTMLInputElement;

  function handleSubmit(e: Event) {
    e.preventDefault();

    props.onFormSubmit({
      id: props.task.id,
      description: descriptionEl.value ? descriptionEl.value : null,
      duration: durationEl.value ? parseFloat(durationEl.value) * HOURS : null,
    });
  }

  return (
    <form
      onsubmit={handleSubmit}
      class="flex gap-4 text-[1rem] h-10 items-baseline select-none w-full"
    >
      <input
        class="bg-black outline-none px-4 py-2 w-16 text-white border-b border-white rounded-t-md hover:bg-white/10 focus:bg-white/10 active:bg-white/10"
        ref={durationEl}
        autofocus={true}
        value={durationToHours(props.task.duration)}
      />

      <input
        class="bg-black outline-none px-4 py-2 flex-1 text-white border-b border-white rounded-t-md hover:bg-white/10 focus:bg-white/10 active:bg-white/10"
        ref={descriptionEl}
        value={props.task.description}
      />

      <button
        type="submit"
        class="text-gray-400 hover:text-gray-50 focus:text-gray-50 active:text-gray-50"
      >
        Done
      </button>
    </form>
  );
}
