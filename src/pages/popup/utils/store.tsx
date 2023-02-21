import { createId } from "@paralleldrive/cuid2";
import { createContext, createEffect, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";

const TaskContext = createContext<TaskStore>();

type TaskStore = {
  timer: {
    state: TimerState;
  } & TimerActions;
  tasks: {
    state: Task[];
    clear: () => void;
    update: ({
      id,
      description,
      duration,
    }: {
      id: string;
      description?: string;
      duration?: number;
    }) => void;
  };
};
type TimerState = {
  isStarted: Boolean;
  startedAt: number | null;
};
type TimerActions = {
  start: () => void;
  end: ({
    duration,
    description,
  }: {
    duration: number;
    description: string;
  }) => void;
};

type Task = {
  createdOn: number;
  description: string;
  duration: number;
  id: string;
};

export function TaskProvider(props) {
  const [timerState, setTimerState] = createLocalStore<TimerState>("timer", {
    isStarted: false,
    startedAt: null,
  });
  const [taskState, setTasks] = createLocalStore<Task[]>("tasks", []);

  const store = {
    timer: {
      state: timerState,
      start: () => {
        setTimerState({ isStarted: true, startedAt: Date.now() });
        chrome.action.setIcon({ path: "/icons/active_timer.png" });
      },
      end: ({
        duration,
        description,
      }: {
        duration: number;
        description: string;
      }) => {
        setTimerState({ isStarted: false, startedAt: null });
        setTasks([
          ...taskState,
          {
            createdOn: Date.now(),
            description: description ? description : "New Task",
            duration,
            id: createId(),
          },
        ]);
        chrome.action.setIcon({ path: "/icons/inactive_timer.png" });
      },
    },
    tasks: {
      state: taskState,
      clear: () => setTasks([]),
      update: ({
        id,
        description,
        duration,
      }: {
        id: string;
        description?: string;
        duration?: number;
      }) => {
        setTasks(
          (task) => task.id === id,
          produce((task) => {
            task.description = description ? description : task.description;
            task.duration = duration ? duration : task.duration;
          })
        );
      },
    },
  };

  return (
    <TaskContext.Provider value={store}>{props.children}</TaskContext.Provider>
  );
}

export function useTask() {
  return useContext(TaskContext);
}

function createLocalStore<T extends Object>(key: string, initState: T) {
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
