"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleIcon } from "@/components/ui/google-icon";
import { PasswordStrength } from "./password-strength";
import { useAuthStore } from "@/lib/store/auth-store";
import { registerSchema, type RegisterFormValues } from "@ekene/shared";
import { authClient } from "@ekene/auth";

export function RegisterForm() {
  const t = useTranslations("Auth.register");
  const router = useRouter();
  const { registerWithCredentials } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = useWatch({ control, name: "password" });

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError("");
    try {
      const { requiresVerification } = await registerWithCredentials(data);
      router.push(requiresVerification ? `/verify-email?email=${encodeURIComponent(data.email)}` : "/");
      router.refresh();
    } catch (err: any) {
      const msg = err?.message || t("error_invalid");
      setServerError(Array.isArray(msg) ? msg.join(" ") : msg);
    }
  };

  const onGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: typeof window !== "undefined" ? window.location.origin : "/",
    });
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Google OAuth */}
      <Button
        type="button"
        onClick={onGoogleLogin}

        variant="outline"
        size="lg"
        className="w-full gap-3 border-2 border-[#e5e7eb] bg-white text-neutral-dark hover:border-primary/30 hover:bg-neutral-light hover:text-neutral-dark"
      >
        <GoogleIcon />
        {t("google_continue")}
      </Button>


      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#e5e7eb]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-neutral-dark/40 tracking-widest">
            {t("divider")}
          </span>
        </div>
      </div>

      {/* Server error */}
      {serverError && (
        <div className="rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
          {serverError}
        </div>
      )}

      {/* Name row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="reg-firstName" className="block text-sm font-medium text-neutral-dark">
            {t("first_name_label")}
          </label>
          <Input
            id="reg-firstName"
            type="text"
            autoComplete="given-name"
            placeholder={t("first_name_placeholder")}
            error={!!errors.firstName}
            disabled={isSubmitting}
            {...register("firstName", { onChange: () => setServerError("") })}
          />
          {errors.firstName && (
            <p className="text-xs text-error mt-1">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="reg-lastName" className="block text-sm font-medium text-neutral-dark">
            {t("last_name_label")}
          </label>
          <Input
            id="reg-lastName"
            type="text"
            autoComplete="family-name"
            placeholder={t("last_name_placeholder")}
            error={!!errors.lastName}
            disabled={isSubmitting}
            {...register("lastName", { onChange: () => setServerError("") })}
          />
          {errors.lastName && (
            <p className="text-xs text-error mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="reg-email" className="block text-sm font-medium text-neutral-dark">
          {t("email_label")}
        </label>
        <Input
          id="reg-email"
          type="email"
          autoComplete="email"
          placeholder={t("email_placeholder")}
          error={!!errors.email}
          disabled={isSubmitting}
          {...register("email", { onChange: () => setServerError("") })}
        />
        {errors.email && (
          <p className="text-xs text-error mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label htmlFor="reg-password" className="block text-sm font-medium text-neutral-dark">
          {t("password_label")}
        </label>
        <div className="relative">
          <Input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder={t("password_placeholder")}
            error={!!errors.password}
            disabled={isSubmitting}
            className="pr-11"
            {...register("password", { onChange: () => setServerError("") })}
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

        {errors.password && (
          <p className="text-xs text-error mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label htmlFor="reg-confirmPassword" className="block text-sm font-medium text-neutral-dark">
          {t("confirm_password_label")}
        </label>
        <div className="relative">
          <Input
            id="reg-confirmPassword"
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
          t("submit")
        )}
      </Button>

      {/* Terms */}
      <p className="text-center text-xs text-neutral-dark/40 leading-relaxed">
        {t.rich("terms", {
          tos: (chunks) => <a href="#" className="underline hover:text-primary transition-colors">{chunks}</a>,
          pp: (chunks) => <a href="#" className="underline hover:text-primary transition-colors">{chunks}</a>
        })}
      </p>

      {/* Login link */}
      <p className="text-center text-sm text-neutral-dark/60">
        {t("already_have_account")}{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:text-primary-light transition-colors underline-offset-2 hover:underline"
        >
          {t("sign_in")}
        </Link>
      </p>
    </form>
  );
}
