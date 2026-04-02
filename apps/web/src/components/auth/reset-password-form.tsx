"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Eye, EyeOff, Loader2, ShieldCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getResetPasswordSchema, type ResetPasswordFormValues } from "@/lib/validations/auth";
import { authClient } from "@ekene/auth";
import { PasswordStrength } from "./password-strength";

export function ResetPasswordForm() {
  const t = useTranslations("Auth.resetPassword");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(getResetPasswordSchema(t)),
  });

  const passwordValue = useWatch({ control, name: "newPassword" });

  // Guard: token must be present in URL
  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-error/10">
          <AlertTriangle className="h-7 w-7 text-error" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-neutral-dark">{t("invalid_link_title")}</h2>
          <p className="text-sm text-neutral-dark/60">
            {t("invalid_link_message")}
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="inline-block text-sm font-semibold text-primary hover:text-primary-light transition-colors"
        >
          {t("request_new_link")}
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setServerError("");
    try {
      const { error } = await authClient.resetPassword({
        newPassword: data.newPassword,
        token,
      });
      
      if (error) throw error;
      
      router.push("/login?reset=true");
    } catch (err: any) {
      const message = err?.message || t("error_expired");
      setServerError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Server error */}
      {serverError && (
        <div className="rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm text-error font-medium">
          {serverError}{" "}
          <Link href="/forgot-password" className="font-semibold underline ml-1">
            {t("get_new_link")}
          </Link>
        </div>
      )}

      {/* New password */}
      <div className="space-y-1.5">
        <label htmlFor="reset-password" className="block text-sm font-medium text-neutral-dark">
          {t("new_password_label")}
        </label>
        <div className="relative">
          <Input
            id="reset-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder={t("password_placeholder")}
            error={!!errors.newPassword}
            disabled={isSubmitting}
            className="pr-11"
            {...register("newPassword", { onChange: () => setServerError("") })}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-dark/40 hover:text-neutral-dark transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* Real-time strength meter */}
        <PasswordStrength password={passwordValue} />

        {errors.newPassword && (
          <p className="text-xs text-error mt-1">{errors.newPassword.message}</p>
        )}
      </div>

      {/* Confirm password */}
      <div className="space-y-1.5">
        <label htmlFor="reset-confirm" className="block text-sm font-medium text-neutral-dark">
          {t("confirm_password_label")}
        </label>
        <div className="relative">
          <Input
            id="reset-confirm"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            error={!!errors.confirmPassword}
            disabled={isSubmitting}
            className="pr-11"
            {...register("confirmPassword", { onChange: () => setServerError("") })}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-dark/40 hover:text-neutral-dark transition-colors"
            tabIndex={-1}
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-error mt-1">{errors.confirmPassword.message}</p>
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
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            {t("submit")}
          </div>
        )}
      </Button>
    </form>
  );
}
