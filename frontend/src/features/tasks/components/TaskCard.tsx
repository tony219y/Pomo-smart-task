import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/features/dashboard/hooks/useTask";
import { Task } from "@/features/dashboard/types/dashboard.types";
import { Calendar, ChevronDown, Dot } from "lucide-react";
import { useState } from "react";

interface TaskCardProps {
  tasks: Task[];
}

const TaskCard = ({ tasks }: TaskCardProps) => {
  const [openTasks, setOpenTasks] = useState<Record<string, boolean>>({});
  const { isLoadingTasks, updateTask, deleteTask } = useTasks();

  const handleToggleStatus = async (taskId: number, status: string) => {
    await updateTask({ taskId, data: { status: status } });
  };

  const handleToggle = (taskId: string) => {
    setOpenTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const getPriorityClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "low":
        return "bg-green-500/30 text-green-500";
      case "medium":
        return "bg-yellow-300/30 text-yellow-500";
      case "high":
        return "bg-red-300/30 text-red-500";
      default:
        return "bg-gray-300/30 text-gray-300";
    }
  };

  const getStatus = (status: string) => {
    switch (status) {
      case "todo":
        return "Todo";
      case "in_progress":
        return "In progress";
      case "done":
        return "Done";
      default:
        return null;
    }
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
              <div className="flex gap-5">
                <div className="flex flex-col">
                  <span className="flex font-bold text-2xl my-2 items-center gap-3">
                    <h1>{task.title} </h1>
                    <Badge className="m-0 inline-flex h-fit items-center gap-1 bg-black/20 px-2">
                      <span className="size-2 rounded-full bg-white" />
                      {getStatus(task.status)}
                    </Badge>
                  </span>

                  <div className="flex gap-3">
                    <p
                      className={`inline-flex items-center rounded-full px-3 text-xs font-semibold uppercase ${getPriorityClass(task.priority)}`}
                    >
                      {task.priority}
                    </p>

                    {task.tags?.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center text-xs uppercase font-semibold bg-gray-300/30 text-white/50 px-3 rounded-full"
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
              className={`rounded-md bg-black/30 p-2 overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-sm text-white/70">{task.description}</p>
            </div>
            <div
              className={`flex w-full justify-end gap-5 overflow-hidden transition-all duration-300 ease-in-out
              ${isOpen ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"}
              `}
            >
              <Button
                onClick={() => handleToggleStatus(task.id, "todo")}
                className="bg-muted-foreground hover:bg-muted px-3 py-0.5 h-fit"
              >
                Todo
              </Button>
              <Button
                onClick={() => handleToggleStatus(task.id, "in_progress")}
                className="bg-amber-600 hover:bg-amber-500 px-3 py-0.5 h-fit"
              >
                In Progress
              </Button>
              <Button
                onClick={() => handleToggleStatus(task.id, "done")}
                className="px-3 py-0.5 h-fit"
              >
                Done
              </Button>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default TaskCard;
