"use client";
import CreateTask from "@/features/dashboard/components/CreateTask";
import { useTasks } from "@/features/dashboard/hooks/useTask";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock3, Flame, Trash2 } from "lucide-react";
import TaskDetailDialog from "@/features/dashboard/components/TaskDetailDialog";
import SummaryCard from "@/features/dashboard/components/SummaryCard";
import { useSummary } from "@/features/dashboard/hooks/useSummary";
import { useFocusedTask } from "@/features/dashboard/hooks/useFocusedTask";
import { usePomodoro } from "@/features/dashboard/hooks/usePomodoro";
import { useTaskDetailDialog } from "@/features/dashboard/hooks/useTaskDetailDialog";
import PomodoroTimer from "@/features/dashboard/components/PomodoroTimer";
import { useMemo, useState } from "react";
import { useTags } from "@/features/dashboard/hooks/useTags";
import { Tags } from "@/features/dashboard/types/dashboard.types";

const DashboardPage = () => {
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
  const { tasks, isLoadingTasks, updateTask, deleteTask } = useTasks();
  const { data: tags = [] } = useTags();
  const { selectedTask, openDetail, setOpenDetail, openTaskDetail } =
    useTaskDetailDialog();
  const { focusedTask, setFocusedTaskId } = useFocusedTask(tasks);
  const {
    completedCount,
    totalCount,
    focusScore,
    totalFocusHours,
    remainingFocusMinutes,
  } = useSummary(tasks);
  const {
    mode,
    isRunning,
    sessionCount,
    timeDisplay,
    handleChangeMode,
    handleToggleTimer,
    handleSkip,
  } = usePomodoro();

  const handleToggleStatus = async (taskId: number, status: string) => {
    const nextStatus = status === "done" ? "todo" : "done";
    await updateTask({ taskId, data: { status: nextStatus } });
  };

  const handleSaveTaskDetail = async (
    taskId: number,
    payload: {
      title: string;
      description: string;
      priority: string;
      dueDate: string;
      estimatedTime: number;
    },
  ) => {
    await updateTask({
      taskId,
      data: {
        title: payload.title,
        description: payload.description,
        priority: payload.priority,
        dueDate: payload.dueDate,
        estimatedTime: payload.estimatedTime,
      },
    });
  };

  const filteredTasks = useMemo(() => {
    if (selectedTagId === null) return tasks;
    return tasks.filter((task) =>
      task.tags?.some((tag) => tag.id === selectedTagId),
    );
  }, [tasks, selectedTagId]);

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Tasks Completed"
          value={`${completedCount} / ${totalCount}`}
          icon={CheckCircle2}
        />
        <SummaryCard
          title="Focus Score"
          value={`${focusScore}%`}
          icon={Flame}
        />
        <SummaryCard
          title="Total Focus Time"
          value={`${totalFocusHours}h ${remainingFocusMinutes}m`}
          icon={Clock3}
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <CreateTask />
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-xl font-bold text-foreground">Active Tasks</h2>
              <div className="flex gap-2 text-xs">
                <button
                  className={`rounded-full px-4 py-2 ${selectedTagId === null ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                  onClick={() => setSelectedTagId(null)}
                >
                  ALL
                </button>
                {tags.map((tag: Tags) => (
                  <button
                    key={tag.id}
                    className={`rounded-full px-4 py-2 ${selectedTagId === tag.id ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                    onClick={() => setSelectedTagId(tag.id)}
                  >
                    {tag.name.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-border">
              {isLoadingTasks ? (
                <p className="p-5 text-sm text-muted-foreground">Loading tasks...</p>
              ) : filteredTasks.length === 0 ? (
                <p className="p-5 text-sm text-muted-foreground">
                  No tasks found for this tag.
                </p>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start justify-between gap-4 px-5 py-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {task.title}
                        </h3>
                        <Badge
                          className="rounded-md border-0 bg-primary/15 text-primary"
                          variant="secondary"
                        >
                          {task.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {task.description || "No description"} - Est.{" "}
                        {task.estimatedTime} min
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Due:{" "}
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "No deadline"}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {task.tags?.length ? (
                          task.tags.map((t) => (
                            <span
                              key={t.id}
                              className="rounded bg-secondary px-2 py-1 text-secondary-foreground"
                            >
                              {t?.name}
                            </span>
                          ))
                        ) : (
                          <span>No tags</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={
                          focusedTask?.id === task.id ? "default" : "outline"
                        }
                        onClick={() => {
                          setFocusedTaskId(task.id);
                          handleChangeMode("focus");
                        }}
                      >
                        Focus
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        className="rounded-lg bg-secondary text-secondary-foreground hover:bg-accent"
                        onClick={() => openTaskDetail(task)}
                      >
                        Details
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleStatus(task.id, task.status)}
                      >
                        {task.status === "done" ? "Todo" : "Done"}
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <PomodoroTimer
          focusedTask={focusedTask}
          handleChangeMode={handleChangeMode}
          mode={mode}
          timeDisplay={timeDisplay}
          handleToggleTimer={handleToggleTimer}
          isRunning={isRunning}
          handleSkip={handleSkip}
          sessionCount={sessionCount}
        />
      </section>
      <TaskDetailDialog
        open={openDetail}
        task={selectedTask}
        onOpenChange={setOpenDetail}
        onSave={handleSaveTaskDetail}
      />
    </div>
  );
};

export default DashboardPage;
