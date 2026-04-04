"use client";
import PomodoroTimer from "@/features/dashboard/components/PomodoroTimer";
import { usePomodoro } from "@/features/dashboard/hooks/usePomodoro";
import { AuthGuard } from "@/features/auth/components/auth-guard";

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
    <AuthGuard allowedRoles={["member"]}>
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
    </AuthGuard>
  );
};

export default page;
