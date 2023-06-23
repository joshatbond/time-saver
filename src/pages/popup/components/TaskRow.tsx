import {
  createEffect,
  createSignal,
  JSXElement,
  onCleanup,
  Show,
} from "solid-js";
import { useAppContext } from "../utils/AppContext";
import { AppStore } from "../utils/store";
import { durationToHours, timeBetweenDates } from "../utils/TimeUtils";

type Props = { task: AppStore["state"][number] };
export default function TaskRow(props: Props) {
  const { decrementTimer, incrementTimer } = useAppContext();

  return (
    <div class="flex gap-4 relative text-white w-full items-center">
      <div class="absolute inset-y-0 flex flex-col">
        <button
          class="hover:bg-neutral-100/70 w-4 hover:text-black"
          onClick={() => incrementTimer(props.task.id)}
        >
          +
        </button>
        <button
          class="hover:bg-neutral-100/70 w-4 hover:text-black"
          onClick={() => decrementTimer(props.task.id)}
        >
          -
        </button>
      </div>

      <TaskTimer task={props.task} />

      <TaskDescription
        id={props.task.id}
        description={props.task.description}
      />

      <TaskRemoveButton id={props.task.id} />
    </div>
  );
}

function TaskTimer(props: Props) {
  const { startTaskTimer, endTaskTimer } = useAppContext();
  const [duration, setDuration] = createSignal<string>();

  let timeInterval: NodeJS.Timer;

  if (props.task.startedAt) startTimer(props.task.startedAt as number);

  function startTimer(time = Date.now()) {
    if (!props.task.startedAt) startTaskTimer(props.task.id);

    setDuration(timeBetweenDates(time, props.task.duration));
    setTimeInterval();
  }

  function endTimer() {
    endTaskTimer(props.task.id);
    clearInterval(timeInterval);
    setDuration(null);
  }

  function setTimeInterval() {
    timeInterval = setInterval(() => {
      if (props.task.startedAt) {
        setDuration(
          timeBetweenDates(props.task.startedAt, props.task.duration)
        );
      }
    }, 1000);
  }

  onCleanup(() => clearInterval(timeInterval));

  createEffect(() => {});

  return (
    <button
      onClick={() => (!!props.task.startedAt ? endTimer() : startTimer())}
      class={`rounded outline-none ml-4 px-6 py-2 min-w-28 select-none ${
        !!props.task.startedAt
          ? "bg-green-800 w-28 hover:bg-green-700 focus:bg-green-700 active:bg-green-700"
          : "border border-white hover:bg-white/20 focus:bg-white/20 active:bg-white/20"
      }`}
    >
      {!!props.task.startedAt
        ? duration()
        : durationToHours(props.task.duration)}
    </button>
  );
}

function TaskDescription(props: { id: string; description: string }) {
  const { updateTaskDescription } = useAppContext();

  return (
    <div class="flex-1 text-lg">
      <EditableField
        value={props.description}
        onUpdate={(s) => updateTaskDescription(props.id, s)}
        fallback={
          <div onclick={() => setIsEditing(true)}>{props.description}</div>
        }
      />
    </div>
  );
}
const [isEditing, setIsEditing] = createSignal(false);

function EditableField(props: {
  value: string;
  onUpdate: (s: string) => void;
  fallback: JSXElement;
}) {
  let inputEl: HTMLInputElement;

  function handleBlur() {
    setIsEditing(false);
    props.onUpdate(inputEl.value);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") handleBlur();
    if (e.key === "Escape") {
      e.preventDefault();
      inputEl.value = props.value;
      setIsEditing(false);
    }
  }

  createEffect(() => {
    if (isEditing()) {
      inputEl.focus();
      inputEl.select();
    }
  });

  return (
    <Show when={isEditing()} fallback={props.fallback}>
      <input
        use:clickOutside={handleBlur}
        type="text"
        ref={inputEl}
        value={props.value}
        onkeydown={handleKeyDown}
        onBlur={handleBlur}
        class="bg-black outline-none px-4 border-b border-white rounded-t-md hover:bg-white/10 focus:bg-white/10 active:bg-white/10"
      />
    </Show>
  );
}

function TaskRemoveButton(props: { id: string }) {
  const { removeTask } = useAppContext();
  return (
    <button
      class="bg-red-800 w-8 h-8 flex justify-center items-center rounded hover:bg-red-700 focus:bg-red-700 active:bg-red-700 text-white"
      onClick={() => removeTask(props.id)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-4 h-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
        />
      </svg>
    </button>
  );
}

function clickOutside(el: HTMLElement, accessor) {
  const onClick = (e) => !el.contains(e.target) && accessor()?.();
  document.body.addEventListener("click", onClick);

  onCleanup(() => document.body.removeEventListener("click", onClick));
}
