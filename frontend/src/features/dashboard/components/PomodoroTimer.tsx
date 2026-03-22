import { Button } from "@/components/ui/button";
import { TimerMode } from "../hooks/usePomodoro";
import { Task } from "../types/dashboard.types";
import { Pause, Play, StepForward } from "lucide-react";
import { useTasks } from "../hooks/useTask";

interface PomodoroTimerProps {
  focusedTask: Task | null;
  handleChangeMode: (nextMode: TimerMode) => void;
  mode: TimerMode;
  timeDisplay: string;
  handleToggleTimer: (beforeStart?: () => Promise<void> | void) => void;
  isRunning: boolean;
  handleSkip: () => void;
  sessionCount: number;
}

const PomodoroTimer = ({
  focusedTask,
  handleChangeMode,
  mode,
  timeDisplay,
  handleToggleTimer,
  isRunning,
  handleSkip,
  sessionCount,
}: PomodoroTimerProps) => {
  const { updateTask } = useTasks();
  const handlePomodoroStart = async () => {
    if (focusedTask && focusedTask.status === "todo") {
      await updateTask({
        taskId: focusedTask.id,
        data: { status: "in_progress" },
      });
    }
  };
  return (
    <aside className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 rounded-xl border border-border bg-secondary p-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Current Task
        </p>
        <p className="mt-1 text-sm font-semibold text-foreground">
          {focusedTask ? focusedTask.title : "Select a task to focus"}
        </p>
      </div>
      <div className="mx-auto flex w-fit rounded-full bg-secondary p-1 text-xs font-semibold">
        <button
          className={`rounded-full px-4 py-2 ${mode === "focus" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          onClick={() => handleChangeMode("focus")}
        >
          Focus
        </button>
        <button
          className={`rounded-full px-4 py-2 ${mode === "short" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          onClick={() => handleChangeMode("short")}
        >
          Short Break
        </button>
        <button
          className={`rounded-full px-4 py-2 ${mode === "long" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          onClick={() => handleChangeMode("long")}
        >
          Long Break
        </button>
      </div>
      <div className="mx-auto mt-6 flex size-56 items-center justify-center rounded-full border-[6px] border-border">
        <div className="text-center">
          <p className="text-6xl font-black tracking-tight text-foreground">
            {timeDisplay}
          </p>
          <p className="mt-2 text-sm font-semibold tracking-[0.2em] text-primary">
            STAY FOCUSED
          </p>
        </div>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <Button
          className="h-16 flex-1 rounded-2xl bg-primary text-lg font-bold text-primary-foreground hover:bg-primary/90"
          onClick={() => handleToggleTimer(handlePomodoroStart)}
        >
          {isRunning ? (
            <Pause className="mr-2 size-5" />
          ) : (
            <Play className="mr-2 size-5" />
          )}
          {isRunning ? "PAUSE" : "START SESSION"}
        </Button>
        <Button
          variant="outline"
          className="size-16 rounded-2xl border-border"
          onClick={handleSkip}
        >
          <StepForward className="size-5 text-muted-foreground" />
        </Button>
      </div>
      <p className="mt-8 text-center text-xs font-semibold text-muted-foreground">
        SESSION #{sessionCount} OF THE DAY
      </p>
    </aside>
  );
};

export default PomodoroTimer;
