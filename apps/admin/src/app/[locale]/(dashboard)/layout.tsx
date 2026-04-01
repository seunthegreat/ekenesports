import { AdminShell } from "@/components/layout/admin-shell";
import { setRequestLocale } from "next-intl/server";

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AdminShell>
      {children}
    </AdminShell>
  );
}
