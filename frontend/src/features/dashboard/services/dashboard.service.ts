import api from "@/api/axios";
import { TasksProps, UpdateTaskPayload } from "../types/dashboard.types";

export const CreateTask = async (payload: TasksProps) => {
  const response = await api.post("/tasks", payload);
  return response;
};

export const GetTags = async () => {
  const response = await api.get("/tags");
  return response;
};

export const GetTasks = async () => {
  const response = await api.get("/tasks");
  return response;
};

export const UpdateTask = async (taskId: number, payload: UpdateTaskPayload) => {
  const response = await api.patch(`/tasks/${taskId}`, payload);
  return response;
};

export const DeleteTask = async (taskId: number) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response;
};
