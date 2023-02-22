import { createSignal, onCleanup } from "solid-js";
import { useAppContext } from "../utils/AppContext";
import { Duration, timeBetweenDates } from "../utils/TimeUtils";

export default function Timer() {
  const { timer } = useAppContext();
  let timeInterval: NodeJS.Timer;
  let inputEl: HTMLInputElement;

  if (timer.state.isStarted) {
    startTimer(timer.state.startedAt);
  }

  function startTimer(time = Date.now()) {
    if (!timer.state.isStarted) timer.start();

    setDuration(timeBetweenDates(time));
    setTimeInterval();
  }
  function endTimer() {
    timer.end({ duration: duration()?.difference, description: inputEl.value });
    clearInterval(timeInterval);
    setDuration(null);
    inputEl.value = "";
    inputEl.focus();
  }
  function setTimeInterval() {
    timeInterval = setInterval(() => {
      if (timer.state.isStarted) {
        setDuration(timeBetweenDates(timer.state.startedAt));
      }
    }, 1000);
  }

  function handleBlur(e: Event) {
    e.preventDefault();

    timer.updateTaskDescription(inputEl.value);
  }
  function handleSubmit(e: Event) {
    e.preventDefault();
    timer.state.isStarted ? endTimer() : startTimer();
  }

  onCleanup(() => clearInterval(timeInterval));

  return (
    <form onsubmit={handleSubmit} class="flex gap-4">
      <input
        ref={inputEl}
        autofocus={!timer.state.isStarted}
        type="text"
        onblur={handleBlur}
        value={timer.state.description}
        placeholder="Start a new task"
        class="bg-black outline-none px-4 flex-1 text-white border-b border-white rounded-t-md hover:bg-white/10 focus:bg-white/10 active:bg-white/10"
      />
      <button
        class={`rounded outline-none px-6 py-2 min-w-28 select-none ${
          timer.state.isStarted
            ? "bg-green-800 hover:bg-green-700 focus:bg-green-700 active:bg-green-700"
            : "border border-white hover:bg-white/20 focus:bg-white/20 active:bg-white/20"
        }`}
        type="submit"
      >
        {timer.state.isStarted ? displayDuration() : "Start"}
      </button>
    </form>
  );
}

const [duration, setDuration] = createSignal<Duration>();
function displayDuration() {
  return !duration()?.timeData
    ? ""
    : `${duration().timeData.hours}:${duration().timeData.minutes}:${
        duration().timeData.seconds
      }`;
}
