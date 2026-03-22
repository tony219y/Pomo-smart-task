import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateTask,
  DeleteTask,
  GetTasks,
  UpdateTask,
} from "../services/dashboard.service";
import { Task, TasksProps, UpdateTaskPayload } from "../types/dashboard.types";

export const useTasks = () => {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await GetTasks();
      return response.data as Task[];
    },
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const createTaskMutation = useMutation({
    mutationFn: async (payload: TasksProps) => {
      const response = await CreateTask(payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Task created!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async (payload: { taskId: number; data: UpdateTaskPayload }) => {
      const response = await UpdateTask(payload.taskId, payload.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      const response = await DeleteTask(taskId);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Task deleted");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return {
    tasks: tasksQuery.data ?? [],
    isLoadingTasks: tasksQuery.isLoading,
    refetchTasks: tasksQuery.refetch,
    createTask: createTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutateAsync,
  };
};
