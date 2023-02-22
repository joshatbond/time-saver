import TaskList from "./components/TaskList";
import Timer from "./components/Timer";
import { useAppContext } from "./utils/AppContext";

export default function Popup() {
  const { taskList } = useAppContext();

  return (
    <div class="w-[400px] bg-black text-white min-h-24 p-4 space-y-12">
      <Timer />
      <TaskList />
    </div>
  );
}
