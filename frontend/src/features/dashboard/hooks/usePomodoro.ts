import { useEffect, useMemo, useState } from "react";

export type TimerMode = "focus" | "short" | "long";

const MODE_MINUTES: Record<TimerMode, number> = {
  focus: 25,
  short: 5,
  long: 15,
};

export const usePomodoro = () => {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [secondsLeft, setSecondsLeft] = useState(MODE_MINUTES.focus * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(4);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          if (mode === "focus") {
            setSessionCount((count) => count + 1);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, mode]);

  const handleChangeMode = (nextMode: TimerMode) => {
    setMode(nextMode);
    setIsRunning(false);
    setSecondsLeft(MODE_MINUTES[nextMode] * 60);
  };

  const handleToggleTimer = async (beforeStart?: () => Promise<void> | void) => {
    if (!isRunning && beforeStart) {
      await beforeStart();
    }
    if (secondsLeft === 0) {
      setSecondsLeft(MODE_MINUTES[mode] * 60);
    }
    setIsRunning((value) => !value);
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

  return {
    mode,
    isRunning,
    sessionCount,
    timeDisplay,
    handleChangeMode,
    handleToggleTimer,
    handleSkip,
  };
};
