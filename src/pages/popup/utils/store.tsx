import { createId } from "@paralleldrive/cuid2";
import { produce } from "solid-js/store";
import createLocalStore from "./createLocalStore";

const defaultTimerState: TimerState = {
  isStarted: false,
  startedAt: null,
  description: "",
};
const defaultTasksState: TasksState = [];

const [timerState, setTimerState] = createLocalStore(
  "timer",
  defaultTimerState
);
const [tasksState, setTasksState] = createLocalStore(
  "tasks",
  defaultTasksState
);

export const store: AppStore = {
  timer: {
    state: timerState,
    updateTaskDescription: (description) => {
      setTimerState(produce((p) => (p.description = description)));
    },
    start: () => {
      setTimerState({ isStarted: true, startedAt: Date.now() });
      chrome.action.setIcon({ path: "/icons/active_timer.png" });
    },
    end: ({ description, duration }) => {
      const newTask: Task = {
        createdOn: Date.now(),
        description: description ? description : "New Task",
        duration,
        id: createId(),
      };

      setTasksState((p) => [...p, newTask]);
      setTimerState({ isStarted: false, startedAt: null, description: "" });

      chrome.action.setIcon({ path: "/icons/inactive_timer.png" });
    },
  },
  taskList: {
    state: tasksState,
    clear: () => setTasksState([]),
    removeTask: (id) => {
      setTasksState((p) => p.filter((t) => t.id !== id));
    },
    update: ({ description, duration, id }) => {
      setTasksState(
        (task) => task.id === id,
        produce((task) => {
          if (description) task.description = description;
          if (duration) task.duration = duration;
        })
      );
    },
  },
};

export type AppStore = {
  timer: {
    state: TimerState;
    end: ({
      description,
      duration,
    }: {
      description: string;
      duration: number;
    }) => void;
    start: () => void;
    updateTaskDescription: (description: string) => void;
  };
  taskList: {
    state: TasksState;
    clear: () => void;
    removeTask: (id: string) => void;
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
  description: string;
};
type TasksState = Task[];
type Task = {
  createdOn: number;
  description: string;
  duration: number;
  id: string;
};
