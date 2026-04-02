"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password?: string;
}

export function PasswordStrength({ password = "" }: PasswordStrengthProps) {
  const t = useTranslations("Auth.resetPassword.strength");

  const requirements = useMemo(() => [
    { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
    { label: "At least one uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { label: "At least one lowercase letter", test: (p: string) => /[a-z]/.test(p) },
    { label: "At least one number", test: (p: string) => /\d/.test(p) },
    { label: "At least one special character", test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
  ], []);

  const score = requirements.filter(r => r.test(password)).length;

  const strength = useMemo(() => {
    if (score <= 2) return t("weak");
    if (score <= 4) return t("fair");
    return t("strong");
  }, [score, t]);

  const color = score <= 2 ? "bg-error" : score <= 4 ? "bg-warning" : "bg-primary";

  if (!password) return null;

  return (
    <div className="mt-3 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-bold text-neutral-dark/40">
          <span>{t("label")}</span>
          <span className={cn(
            score <= 2 ? "text-error" : score <= 4 ? "text-warning" : "text-primary"
          )}>
            {strength}
          </span>
        </div>
        <div className="flex gap-1 h-1">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div
              key={idx}
              className={cn(
                "flex-1 rounded-full transition-all duration-300",
                idx <= score ? color : "bg-neutral-dark/10"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
