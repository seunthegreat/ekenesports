"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getForgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validations/auth";
import { forgotPassword } from "@/services/auth";

export function ForgotPasswordForm() {
  const t = useTranslations("Auth.forgotPassword");
  const [step, setStep] = useState<"form" | "sent">("form");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(getForgotPasswordSchema(t)),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setServerError("");
    try {
      await forgotPassword({ email: data.email });
      setSubmittedEmail(data.email);
      setStep("sent");
    } catch {
      // Use generic message even on error to avoid account enumeration
      setSubmittedEmail(data.email);
      setStep("sent");
    }
  };

  if (step === "sent") {
    return (
      <div className="space-y-5 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-neutral-dark">{t("success_title")}</h2>
          <p className="text-sm text-neutral-dark/60 leading-relaxed">
            {t.rich("success_message", {
              email: submittedEmail,
              span: (chunks) => <span className="font-semibold text-neutral-dark">{chunks}</span>
            })}
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-light transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back_to_login")}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Server error */}
      {serverError && (
        <div className="rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
          {serverError}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="forgot-email" className="block text-sm font-medium text-neutral-dark">
          {t("email_label")}
        </label>
        <Input
          id="forgot-email"
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

      <p className="text-center text-sm text-neutral-dark/60">
        <Link
          href="/login"
          className="font-semibold text-primary hover:text-primary-light transition-colors"
        >
          {t("back_to_login")}
        </Link>
      </p>
    </form>
  );
}
