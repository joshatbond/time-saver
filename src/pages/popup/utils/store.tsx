import { createId } from "@paralleldrive/cuid2";
import { produce } from "solid-js/store";
import createLocalStore from "./createLocalStore";

const defaultTasksState: TasksState = [];
const [tasksState, setTasksState] = createLocalStore(
  "tasks",
  defaultTasksState
);

export const store: AppStore = {
  state: tasksState,
  addTask: () => {
    const now = Date.now();
    const newTask: Task = {
      id: createId(),
      createdOn: now,
      startedAt: now,
      duration: 0,
      description: "New Task",
    };

    setTasksState((p) => [newTask, ...p]);
    setActiveIcon(true);
  },
  anyTimersRunning: () => tasksState.filter((t) => t.startedAt).length > 0,
  clear: () => setTasksState([]),
  endTaskTimer: (id) => {
    const anyOtherTimersRunning =
      tasksState.filter((t) => t.startedAt && t.id !== id).length > 0;

    if (!anyOtherTimersRunning) setActiveIcon(false);

    setTasksState(
      (task) => task.id === id,
      produce((task) => {
        task.duration = task.duration + (Date.now() - task.startedAt);
        task.startedAt = null;
      })
    );
  },
  removeTask: (id) => setTasksState((p) => p.filter((t) => t.id !== id)),
  startTaskTimer: (id) => {
    setActiveIcon(true);
    setTasksState(
      (task) => task.id === id,
      produce((task) => (task.startedAt = Date.now()))
    );
  },
  updateTaskDescription: (id, description) => {
    setTasksState(
      (task) => task.id === id,
      produce((task) => (task.description = description))
    );
  },
};

function setActiveIcon(flag: boolean) {
  chrome.action.setIcon({
    path: flag ? "/icons/active_timer.png" : "/icons/inactive_timer.png",
  });
}

export type AppStore = {
  state: TasksState;
  addTask: () => void;
  anyTimersRunning: () => boolean;
  clear: () => void;
  endTaskTimer: (id: string) => void;
  removeTask: (id: string) => void;
  startTaskTimer: (id: string) => void;
  updateTaskDescription: (id: string, description: string) => void;
};
type TasksState = Task[];
type Task = {
  createdOn: number;
  description: string;
  duration: number;
  id: string;
  startedAt: number | null;
};
