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
    <aside className="rounded-2xl border border-[#dce5ee] bg-white p-5 shadow-sm">
      <div className="mb-4 rounded-xl border border-[#e7edf3] bg-[#f8fafc] p-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8ea0b3]">
          Current Task
        </p>
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
          <p className="text-6xl font-black tracking-tight text-[#152238]">
            {timeDisplay}
          </p>
          <p className="mt-2 text-sm font-semibold tracking-[0.2em] text-[#2fad66]">
            STAY FOCUSED
          </p>
        </div>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <Button
          className="h-16 flex-1 rounded-2xl bg-[#2fad66] text-lg font-bold hover:bg-[#249557]"
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
          className="size-16 rounded-2xl border-[#dbe4ed]"
          onClick={handleSkip}
        >
          <StepForward className="size-5 text-[#90a1b2]" />
        </Button>
      </div>
      <p className="mt-8 text-center text-xs font-semibold text-[#9aacbc]">
        SESSION #{sessionCount} OF THE DAY
      </p>
    </aside>
  );
};

export default PomodoroTimer;