import { toast } from "sonner";
import { CreateTask } from "../services/dashboard.service";
import { TasksProps } from "../types/dashboard.types";

export const useTasks = () => {
  const createTask = async (payload: TasksProps) => {
    console.log(payload);

    const response = await CreateTask(payload);
    if (!response) {
      throw new Error("Create task failed");
    }
    toast.success("Task created!");
  };

  return { createTask };
};
