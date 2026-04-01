"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Loader2, MailCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getVerifyOtpSchema, type VerifyOtpFormValues } from "@/lib/validations/auth";
import { verifyOtp, resendOtp } from "@/services/auth";
import { useAuthStore } from "@/lib/store/auth-store";
import { storeToken } from "@/utils/cookies";
import api from "@/utils/api";

const RESEND_COOLDOWN = 60;

export function VerifyEmailForm() {
  const t = useTranslations("Auth.verifyEmail");
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const { login } = useAuthStore();

  const [serverError, setServerError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(getVerifyOtpSchema(t)),
  });

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const onSubmit = async (data: VerifyOtpFormValues) => {
    setServerError("");
    try {
      const res = await verifyOtp({ email, otp: data.otp });
      await storeToken({ token: res.accessToken, refreshToken: res.refreshToken });
      // Fetch full profile to ensure we have real DB data
      const profileRes = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${res.accessToken}` },
        skipAuth: true,
      } as any);
      login(profileRes.data, res.accessToken, res.refreshToken);
      router.push("/");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || t("error_invalid");
      setServerError(message);
    }
  };

  const handleResend = useCallback(async () => {
    if (cooldown > 0 || resending || !email) return;
    setResending(true);
    setServerError("");
    try {
      await resendOtp({ email });
      setCooldown(RESEND_COOLDOWN);
    } catch {
      setServerError(t("error_resend"));
    } finally {
      setResending(false);
    }
  }, [cooldown, resending, email, t]);

  return (
    <div className="space-y-6">
      {/* Email indicator */}
      <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
        <MailCheck className="h-5 w-5 shrink-0 text-primary" />
        <p className="text-sm text-neutral-dark/80">
          {t.rich("indicator", {
            email: email || t("your_email_placeholder"),
            span: (chunks) => <span className="font-semibold text-neutral-dark">{chunks}</span>
          })}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Server error */}
        {serverError && (
          <div className="rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
            {serverError}
          </div>
        )}

        {/* OTP Input */}
        <div className="space-y-1.5">
          <label htmlFor="otp" className="block text-sm font-medium text-neutral-dark">
            {t("otp_label")}
          </label>
          <Input
            id="otp"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            autoComplete="one-time-code"
            error={!!errors.otp}
            disabled={isSubmitting}
            className="text-center text-xl tracking-[0.6em] font-mono"
            {...register("otp", { onChange: () => setServerError("") })}
          />
          {errors.otp && (
            <p className="text-xs text-error mt-1">{errors.otp.message}</p>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {t("submitting")}
            </>
          ) : (
            t("submit")
          )}
        </Button>
      </form>

      {/* Resend */}
      <p className="text-center text-sm text-neutral-dark/60">
        {t("resend")}{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0 || resending}
          className="inline-flex items-center gap-1 font-semibold text-primary hover:text-primary-light transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {resending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <RefreshCw className="h-3 w-3" />
          )}
          {cooldown > 0 ? t("resend_cooldown", { seconds: cooldown }) : t("resend_link")}
        </button>
      </p>
    </div>
  );
}
