import { durationToHours } from "../utils/TimeUtils";

type Props = {
  description: string;
  duration: number;
  update: () => void;
  remove: () => void;
};
export default function TaskItem(props: Props) {
  return (
    <div class="flex gap-4 text-[1rem] h-10 items-baseline select-none">
      <span class="bg-white/20 px-4 py-2 rounded-md">
        {`${durationToHours(props.duration)} hours`}
      </span>

      <span class="flex-1">{props.description}</span>

      <button
        class="text-gray-400 hover:text-gray-50 focus:text-gray-50 active:text-gray-50"
        onClick={() => props.update()}
      >
        Edit
      </button>

      <button
        class="bg-red-800 w-8 h-8 flex justify-center items-center rounded hover:bg-red-700 focus:bg-red-700 active:bg-red-700 text-white"
        onClick={() => props.remove()}
      >
        x
      </button>
    </div>
  );
}
