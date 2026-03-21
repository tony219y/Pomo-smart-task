import { useMemo } from "react";
import { Task } from "../types/dashboard.types";

export const useSummary = (tasks: Task[]) => {
  return useMemo(() => {
    const completedTasks = tasks.filter((task) => task.status === "done");
    const completedCount = completedTasks.length;
    const totalCount = tasks.length;
    const focusScore = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const totalFocusMinutes = completedTasks.reduce(
      (sum, task) => sum + (task.estimatedTime || 0),
      0,
    );

    const totalFocusHours = Math.floor(totalFocusMinutes / 60);
    const remainingFocusMinutes = totalFocusMinutes % 60;

    return {
      completedCount,
      totalCount,
      focusScore,
      totalFocusHours,
      remainingFocusMinutes,
    };
  }, [tasks]);
};
