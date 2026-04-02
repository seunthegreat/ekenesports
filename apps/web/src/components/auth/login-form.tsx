"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleIcon } from "@/components/ui/google-icon";
import { useAuthStore } from "@/lib/store/auth-store";
import { loginSchema, type LoginFormValues } from "@ekene/shared";
import { authClient } from "@ekene/auth";

export function LoginForm() {
  const t = useTranslations("Auth.login");
  const router = useRouter();
  const { loginWithCredentials } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError("");
    try {
      await loginWithCredentials(data);
      router.push("/");
      router.refresh(); // Refresh to pick up session
    } catch (err: any) {
      const message = err?.message || t("error_invalid");
      setServerError(message);
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

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="login-email" className="block text-sm font-medium text-neutral-dark">
          {t("email_label")}
        </label>
        <Input
          id="login-email"
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
        <div className="flex items-center justify-between">
          <label htmlFor="login-password" className="block text-sm font-medium text-neutral-dark">
            {t("password_label")}
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-primary hover:text-primary-light transition-colors"
          >
            {t("forgot_password")}
          </Link>
        </div>
        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
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
        {errors.password && (
          <p className="text-xs text-error mt-1">{errors.password.message}</p>
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

      {/* Register link */}
      <p className="text-center text-sm text-neutral-dark/60">
        {t("no_account")}{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:text-primary-light transition-colors underline-offset-2 hover:underline"
        >
          {t("create_one")}
        </Link>
      </p>
    </form>
  );
}
