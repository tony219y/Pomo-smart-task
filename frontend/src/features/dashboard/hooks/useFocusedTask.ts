import { useMemo, useState } from "react";
import { Task } from "../types/dashboard.types";

export const useFocusedTask = (tasks: Task[]) => {
  const [focusedTaskId, setFocusedTaskId] = useState<number | null>(null);

  const focusedTask = useMemo(
    () => tasks.find((task) => task.id === focusedTaskId) ?? null,
    [tasks, focusedTaskId],
  );

  return {
    focusedTaskId,
    setFocusedTaskId,
    focusedTask,
  };
};
