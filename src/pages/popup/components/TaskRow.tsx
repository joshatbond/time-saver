import { createSignal } from "solid-js";
import { useAppContext } from "../utils/AppContext";
import { AppStore } from "../utils/store";
import TaskItem from "./TaskItem";
import TaskItemForm from "./TaskItemForm";

type Props = { task: AppStore["taskList"]["state"][number] };
export default function TaskRow(props: Props) {
  const {
    taskList: { update: updateTask, removeTask },
  } = useAppContext();
  const [isEditing, setIsEditing] = createSignal(false);

  const onFormSubmit: AppStore["taskList"]["update"] = (args) => {
    updateTask(args);
    setIsEditing(false);
  };

  return (
    <>
      {isEditing() ? (
        <TaskItemForm task={props.task} onFormSubmit={onFormSubmit} />
      ) : (
        <TaskItem
          description={props.task.description}
          duration={props.task.duration}
          update={() => setIsEditing(true)}
          remove={() => removeTask(props.task.id)}
        />
      )}
    </>
  );
}
