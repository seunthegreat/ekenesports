import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth.resetPassword" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ResetPasswordPage() {
  const t = await getTranslations("Auth.resetPassword");

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-neutral-light px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="mb-8 text-center">
          <h1 className="font-heading text-3xl font-extrabold text-neutral-dark">
            {t("heading")}
          </h1>
          <p className="mt-2 text-sm text-neutral-dark/60">
            {t("subheading")}
          </p>
        </div>

        {/* Card — Suspense required because ResetPasswordForm reads URL params */}
        <div className="rounded-2xl bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.08)] md:p-10">
          <Suspense fallback={<div className="flex justify-center py-8"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
