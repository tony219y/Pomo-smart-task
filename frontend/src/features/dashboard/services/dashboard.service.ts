import api from "@/api/axios";
import { TasksProps } from "../types/dashboard.types";

export const CreateTask = async (payload: TasksProps) => {
  const response = await api.post("/tasks", payload);
  return response;
};

export const GetTags = async () => {
  const response = await api.get("/tags");
  return response;
};
