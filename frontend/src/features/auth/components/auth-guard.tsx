"use client";
import { refreshToken } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { accessToken, setAccessToken } = useAuthStore();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const hasToken = async () => {
      if (accessToken) {
        setIsLoading(false);
        return;
      }

      const response = await refreshToken();
      try {
        if (response) {
          setAccessToken(response.accessToken);
          setIsLoading(false);
        }
      } catch (error) {
        router.replace("/login");
      } finally {
        setIsLoading(false);
      }
    };
    hasToken();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <span className="inline-block w-10 h-10 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></span>
      </div>
    );
  }

  return <>{children}</>;
};
