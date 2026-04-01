import { LoginForm } from "@/app/[locale]/(auth)/login/components/login-form";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth.login" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LoginPage() {
  const t = await getTranslations("Auth.login");

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-light px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="mb-10 text-center">
          <h1 className="font-heading text-3xl font-extrabold text-neutral-dark">
            {t("heading")}
          </h1>
          <p className="mt-2 text-sm text-neutral-dark/60">
            {t("subheading")}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-[0_4px_32px_rgba(0,0,0,0.06)] border border-neutral-dark/5 md:p-10">
          <LoginForm />
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-xs text-neutral-dark/40">
          <p>{t("footer_copy")}</p>
          <p className="mt-1">{t("footer_internal")}</p>
        </div>
      </div>
    </div>
  );
}
