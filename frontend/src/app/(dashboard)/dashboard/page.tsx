"use client"
import CreateTask from "@/features/dashboard/components/CreateTask"
import { useTasks } from "@/features/dashboard/hooks/use-task"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock3, Flame, Pause, Play, StepForward, Trash2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Task } from "@/features/dashboard/types/dashboard.types"
import TaskDetailDialog from "@/features/dashboard/components/TaskDetailDialog"

type TimerMode = "focus" | "short" | "long";

const MODE_MINUTES: Record<TimerMode, number> = {
  focus: 25,
  short: 5,
  long: 15,
};

const DashboardPage = () => {
  const { tasks, isLoadingTasks, updateTask, deleteTask } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [mode, setMode] = useState<TimerMode>("focus");
  const [secondsLeft, setSecondsLeft] = useState(MODE_MINUTES.focus * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(4);
  const [focusedTaskId, setFocusedTaskId] = useState<number | null>(null);

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

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          if (mode === "focus") {
            setSessionCount((c) => c + 1);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, mode]);

  const focusedTask = useMemo(
    () => tasks.find((task) => task.id === focusedTaskId) ?? null,
    [tasks, focusedTaskId],
  );

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.status === "done"),
    [tasks],
  );
  const completedCount = completedTasks.length;
  const totalCount = tasks.length;
  const focusScore = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const totalFocusMinutes = completedTasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0);
  const totalFocusHours = Math.floor(totalFocusMinutes / 60);
  const remainingFocusMinutes = totalFocusMinutes % 60;

  const handleChangeMode = (nextMode: TimerMode) => {
    setMode(nextMode);
    setIsRunning(false);
    setSecondsLeft(MODE_MINUTES[nextMode] * 60);
  };

  const handleToggleTimer = async () => {
    if (!isRunning && focusedTask && focusedTask.status === "todo") {
      await updateTask({
        taskId: focusedTask.id,
        data: { status: "in_progress" },
      });
    }
    if (secondsLeft === 0) {
      setSecondsLeft(MODE_MINUTES[mode] * 60);
    }
    setIsRunning((v) => !v);
  };

  const handleSkip = () => {
    const nextMode: TimerMode = mode === "focus" ? "short" : "focus";
    handleChangeMode(nextMode);
  };

  const timeDisplay = useMemo(() => {
    const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const ss = String(secondsLeft % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }, [secondsLeft]);

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[#dce5ee] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#6d7d8d]">Tasks Completed</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-4xl font-extrabold tracking-tight text-[#152238]">
              {completedCount}
              <span className="text-lg text-[#9aa8b7]"> / {totalCount}</span>
            </p>
            <div className="flex size-10 items-center justify-center rounded-full bg-[#e6f5ec]">
              <CheckCircle2 className="size-5 text-[#2fad66]" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[#dce5ee] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#6d7d8d]">Focus Score</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-4xl font-extrabold tracking-tight text-[#152238]">{focusScore}%</p>
            <div className="flex size-10 items-center justify-center rounded-full bg-[#e9f0ff]">
              <Flame className="size-5 text-[#4a7ef8]" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[#dce5ee] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#6d7d8d]">Total Focus Time</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-4xl font-extrabold tracking-tight text-[#152238]">
              {totalFocusHours}h {remainingFocusMinutes}m
            </p>
            <div className="flex size-10 items-center justify-center rounded-full bg-[#fff2dc]">
              <Clock3 className="size-5 text-[#e8a11c]" />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <CreateTask />
          <div className="rounded-2xl border border-[#dce5ee] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#e7edf3] px-5 py-4">
              <h2 className="text-xl font-bold text-[#17263b]">Active Tasks</h2>
              <div className="flex gap-2 text-xs">
                <span className="rounded-full bg-[#f0f4f8] px-3 py-1 text-[#718195]">All</span>
                <span className="rounded-full px-3 py-1 text-[#9aabbb]">Work</span>
                <span className="rounded-full px-3 py-1 text-[#9aabbb]">Personal</span>
              </div>
            </div>

            <div className="divide-y divide-[#edf2f7]">
              {isLoadingTasks ? (
                <p className="p-5 text-sm text-[#8da0b2]">Loading tasks...</p>
              ) : tasks.length === 0 ? (
                <p className="p-5 text-sm text-[#8da0b2]">No tasks yet. Create one to get started.</p>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="flex items-start justify-between gap-4 px-5 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#162337]">{task.title}</h3>
                        <Badge
                          className="rounded-md border-0 bg-[#e7f4eb] text-[#2fad66]"
                          variant="secondary"
                        >
                          {task.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-[#8ea0b3]">
                        {task.description || "No description"} - Est. {task.estimatedTime} min
                      </p>
                      <p className="text-xs text-[#adb8c4]">
                        Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No deadline"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={focusedTask?.id === task.id ? "default" : "outline"}
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
                        className="rounded-lg bg-[#eff4f9] text-[#324a62] hover:bg-[#e3ebf3]"
                        onClick={() => {
                          setSelectedTask(task);
                          setOpenDetail(true);
                        }}
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

        <aside className="rounded-2xl border border-[#dce5ee] bg-white p-5 shadow-sm">
          <div className="mb-4 rounded-xl border border-[#e7edf3] bg-[#f8fafc] p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8ea0b3]">Current Task</p>
            <p className="mt-1 text-sm font-semibold text-[#152238]">
              {focusedTask ? focusedTask.title : "Select a task to focus"}
            </p>
          </div>
          <div className="mx-auto flex w-fit rounded-full bg-[#eef3f7] p-1 text-xs font-semibold">
            <button
              className={`rounded-full px-4 py-2 ${mode === "focus" ? "bg-[#2fad66] text-white" : "text-[#7d8ca0]"}`}
              onClick={() => handleChangeMode("focus")}
            >
              Focus
            </button>
            <button
              className={`rounded-full px-4 py-2 ${mode === "short" ? "bg-[#2fad66] text-white" : "text-[#7d8ca0]"}`}
              onClick={() => handleChangeMode("short")}
            >
              Short Break
            </button>
            <button
              className={`rounded-full px-4 py-2 ${mode === "long" ? "bg-[#2fad66] text-white" : "text-[#7d8ca0]"}`}
              onClick={() => handleChangeMode("long")}
            >
              Long Break
            </button>
          </div>
          <div className="mx-auto mt-6 flex size-56 items-center justify-center rounded-full border-[6px] border-[#e0ebe4]">
            <div className="text-center">
              <p className="text-6xl font-black tracking-tight text-[#152238]">{timeDisplay}</p>
              <p className="mt-2 text-sm font-semibold tracking-[0.2em] text-[#2fad66]">STAY FOCUSED</p>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <Button
              className="h-16 flex-1 rounded-2xl bg-[#2fad66] text-lg font-bold hover:bg-[#249557]"
              onClick={handleToggleTimer}
            >
              {isRunning ? <Pause className="mr-2 size-5" /> : <Play className="mr-2 size-5" />}
              {isRunning ? "PAUSE" : "START SESSION"}
            </Button>
            <Button variant="outline" className="size-16 rounded-2xl border-[#dbe4ed]" onClick={handleSkip}>
              <StepForward className="size-5 text-[#90a1b2]" />
            </Button>
          </div>
          <p className="mt-8 text-center text-xs font-semibold text-[#9aacbc]">SESSION #{sessionCount} OF THE DAY</p>
        </aside>
      </section>
      <TaskDetailDialog
        open={openDetail}
        task={selectedTask}
        onOpenChange={setOpenDetail}
        onSave={handleSaveTaskDetail}
      />
    </div>
  )
}

export default DashboardPage
