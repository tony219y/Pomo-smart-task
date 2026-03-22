import { Task } from "@/features/dashboard/types/dashboard.types";
import { Calendar, ChevronDown } from "lucide-react";
import { useState } from "react";

interface TaskCardProps {
  tasks: Task[];
}

const TaskCard = ({ tasks }: TaskCardProps) => {
  const [openTasks, setOpenTasks] = useState<Record<string, boolean>>({});

  const handleToggle = (taskId: string) => {
    setOpenTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  return (
    <>
      {tasks.map((task) => {
        const isOpen = !!openTasks[task.id];

        return (
          <div
            key={task.id}
            className="flex w-full flex-col rounded-lg border-l-4 border-primary p-5 shadow-sm bg-card"
          >
            <div className="flex w-full justify-between items-center">
              <div className="flex flex-col">
                <h1 className="font-bold text-2xl">{task.title}</h1>

                <div className="flex gap-3">
                  <p className="inline-flex items-center text-xs uppercase font-semibold bg-red-300/30 text-red-700 px-3 rounded-full">
                    {task.priority}
                  </p>

                  {task.tags?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center text-xs uppercase font-semibold bg-gray-300/30 text-gray-700 px-3 rounded-full"
                    >
                      {tag.name}
                    </span>
                  ))}

                  <span className="flex items-center gap-2">
                    <Calendar size={16} />
                    {new Date(task.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleToggle(String(task.id))}
                className="transition-transform duration-300"
              >
                <ChevronDown
                  className={`transition-transform duration-300 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
            </div>
            <div
              className={`rounded-md bg-black/5 p-2 overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-sm text-gray-600">{task.description}</p>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default TaskCard;
