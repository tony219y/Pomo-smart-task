import { useState } from "react";
import { Task } from "../types/dashboard.types";

export const useTaskDetailDialog = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  const openTaskDetail = (task: Task) => {
    setSelectedTask(task);
    setOpenDetail(true);
  };

  return {
    selectedTask,
    openDetail,
    setOpenDetail,
    openTaskDetail,
  };
};
