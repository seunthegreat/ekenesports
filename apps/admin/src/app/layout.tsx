import type { Metadata } from "next";
import { AdminShell } from "@/components/layout/admin-shell";
import { Toaster } from "sonner";
import { SearchPalette } from "@/components/ui/search-palette";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ekene Sport Admin",
  description: "Admin portal for Ekene Sport storefront."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body text-[#1A1A2E] antialiased">
        <AdminShell>
          {children}
        </AdminShell>
        <Toaster position="bottom-right" richColors />
        <SearchPalette />
      </body>
    </html>
  );
}
