"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleIcon } from "@/components/ui/google-icon";
import { registerSchema, type RegisterFormValues } from "@/lib/validations/auth";

import { loginWithGoogle } from "@/services/auth";
import { useAuthStore } from "@/lib/store/auth-store";


export function RegisterForm() {

  const router = useRouter();
  const { registerWithCredentials } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError("");
    try {
      const { requiresVerification } = await registerWithCredentials(data);
      router.push(requiresVerification ? "/login?registered=true" : "/");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Registration failed. Please try again.";
      setServerError(Array.isArray(msg) ? msg.join(" ") : msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Google OAuth */}
      <Button
        type="button"
        onClick={loginWithGoogle}
        variant="outline"
        size="lg"
        className="w-full gap-3 border-2 border-[#e5e7eb] bg-white text-neutral-dark hover:border-primary/30 hover:bg-neutral-light hover:text-neutral-dark"
      >
        <GoogleIcon />
        Continue with Google
      </Button>


      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#e5e7eb]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-neutral-dark/40 tracking-widest">
            or register with email
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
            First name
          </label>
          <Input
            id="reg-firstName"
            type="text"
            autoComplete="given-name"
            placeholder="John"
            error={!!errors.firstName}
            disabled={isSubmitting}
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="text-xs text-error mt-1">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="reg-lastName" className="block text-sm font-medium text-neutral-dark">
            Last name
          </label>
          <Input
            id="reg-lastName"
            type="text"
            autoComplete="family-name"
            placeholder="Doe"
            error={!!errors.lastName}
            disabled={isSubmitting}
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="text-xs text-error mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="reg-email" className="block text-sm font-medium text-neutral-dark">
          Email address
        </label>
        <Input
          id="reg-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={!!errors.email}
          disabled={isSubmitting}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-error mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label htmlFor="reg-password" className="block text-sm font-medium text-neutral-dark">
          Password
        </label>
        <div className="relative">
          <Input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            error={!!errors.password}
            disabled={isSubmitting}
            className="pr-11"
            {...register("password")}
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

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label htmlFor="reg-confirmPassword" className="block text-sm font-medium text-neutral-dark">
          Confirm password
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
            {...register("confirmPassword")}
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
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating account…
          </>
        ) : (
          "Create account"
        )}
      </Button>

      {/* Terms */}
      <p className="text-center text-xs text-neutral-dark/40 leading-relaxed">
        By registering, you agree to Ekene Sport&apos;s{" "}
        <a href="#" className="underline hover:text-primary transition-colors">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline hover:text-primary transition-colors">
          Privacy Policy
        </a>
        .
      </p>

      {/* Login link */}
      <p className="text-center text-sm text-neutral-dark/60">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:text-primary-light transition-colors underline-offset-2 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
