import { setRequestLocale } from "next-intl/server";

export default async function AuthLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="mx-auto flex min-h-screen p-4 sm:p-6 md:p-8">
        <div className="m-auto w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
