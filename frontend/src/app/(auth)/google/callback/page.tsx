import GoogleCallbackClient from "@/features/auth/components/GoogleCallbackClient";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
          <p className="text-sm text-muted-foreground">
            Signing you in with Google...
          </p>
        </div>
      }
    >
      <GoogleCallbackClient />
    </Suspense>
  );
}
