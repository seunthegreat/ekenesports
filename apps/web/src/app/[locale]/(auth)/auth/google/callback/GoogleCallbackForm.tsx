"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { storeToken } from "@/utils/cookies";
import api from "@/utils/api";

export function GoogleCallbackForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();

  useEffect(() => {
    const processCallback = async () => {
      // 1. Extract tokens from URL
      const accessToken = searchParams.get("accessToken");
      const refreshToken = searchParams.get("refreshToken");

      if (accessToken && refreshToken) {
        try {
          // 2. Fetch full user profile from backend (DB) to ensure we have the real data
          const profileRes = await api.get("/auth/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
            skipAuth: true
          } as any);
          
          const user = profileRes.data;

          // 3. Update Server-Side Cookies (HttpOnly)
          await storeToken({ token: accessToken, refreshToken });

          // 4. Update Global Auth State (Zustand client-side) with real DB data
          login(user, accessToken, refreshToken);

          // 5. Success Redirect
          router.push("/");
        } catch (error) {
          console.error("Profile fetch failed:", error);
          router.push("/auth/login?error=profile_fetch_failed");
        }
      } else {
          // Handle error
          console.error("Authentication failed: Missing tokens in callback");
          router.push("/auth/login?error=auth_failed");
      }
    };

    processCallback();
  }, [searchParams, login, router]);

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-white">
      <div className="text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
        <h2 className="mt-4 text-xl font-semibold text-neutral-dark">
          Authenticating...
        </h2>
        <p className="mt-2 text-neutral-dark/60">
          Please wait while we log you in.
        </p>
      </div>
    </div>
  );
}
