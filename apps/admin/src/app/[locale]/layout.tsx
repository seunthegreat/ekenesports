import { NextIntlClientProvider, useTranslations } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { AdminShell } from "@/components/layout/admin-shell";
import { Toaster } from "sonner";
import { SearchPalette } from "@/components/ui/search-palette";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Layout" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased text-[#1A1A2E]`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AdminShell>
            {children}
          </AdminShell>
          <Toaster position="bottom-right" richColors />
          <SearchPalette />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
