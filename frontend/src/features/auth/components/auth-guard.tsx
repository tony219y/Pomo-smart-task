"use client";
import { refreshToken } from "@/features/auth/services/auth.service";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export const AuthGuard = ({
  children,
  allowedRoles,
  redirectTo = "/login",
}: AuthGuardProps) => {
  const router = useRouter();
  const { accessToken, setAccessToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { useProfile } = useAuth();
  const shouldCheckRole = Boolean(allowedRoles?.length);
  const { data: profile, isLoading: isProfileLoading } = useProfile(
    !isLoading && shouldCheckRole,
  );

  useEffect(() => {
    const hasToken = async () => {
      if (accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await refreshToken();
        if (response) {
          setAccessToken(response.accessToken);
          setIsLoading(false);
          return;
        }
      } catch {
        router.replace("/login");
      } finally {
        setIsLoading(false);
      }
    };
    hasToken();
  }, [accessToken, router, setAccessToken]);

  useEffect(() => {
    if (!shouldCheckRole || !profile) {
      return;
    }

    if (!allowedRoles?.includes(profile.role)) {
      router.replace(redirectTo);
    }
  }, [allowedRoles, profile, redirectTo, router, shouldCheckRole]);

  if (isLoading || (shouldCheckRole && isProfileLoading)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <span className="inline-block w-10 h-10 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></span>
      </div>
    );
  }

  if (shouldCheckRole && profile && !allowedRoles?.includes(profile.role)) {
    return null;
  }

  return <>{children}</>;
};
