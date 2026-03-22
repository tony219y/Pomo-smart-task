"use client";
import PomodoroTimer from "@/features/dashboard/components/PomodoroTimer";
import { usePomodoro } from "@/features/dashboard/hooks/usePomodoro";

const page = () => {
  const {
    mode,
    isRunning,
    sessionCount,
    timeDisplay,
    handleChangeMode,
    handleToggleTimer,
    handleSkip,
  } = usePomodoro();
  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="lg:w-4xl">
        <PomodoroTimer
          handleChangeMode={handleChangeMode}
          mode={mode}
          timeDisplay={timeDisplay}
          handleToggleTimer={handleToggleTimer}
          isRunning={isRunning}
          handleSkip={handleSkip}
          sessionCount={sessionCount}
        />
      </div>
    </div>
  );
};

export default page;
