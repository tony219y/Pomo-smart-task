"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

const GoogleCallbackClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");

    if (!accessToken) {
      router.replace("/login");
      return;
    }

    setAccessToken(accessToken);
    router.replace("/dashboard");
  }, [router, searchParams, setAccessToken]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <p className="text-sm text-muted-foreground">
        Signing you in with Google...
      </p>
    </div>
  );
};

export default GoogleCallbackClient;
