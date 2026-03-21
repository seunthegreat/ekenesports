"use client";

import { usePathname } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import {
  Settings as SettingsIcon,
  Truck,
  ShieldCheck,
  Bell,
  CreditCard,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useTranslations } from "next-intl";

const settingsNav = [
  {
    key: "general",
    href: "/settings/general",
    icon: SettingsIcon,
  },
  {
    key: "shipping",
    href: "/settings/shipping",
    icon: Truck,
  },
  {
    key: "staff",
    href: "/settings/staff",
    icon: ShieldCheck,
  },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations("Settings");

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">

      {/* Header */}
      <div className="max-w-xl space-y-2">
        <h1 className="text-3xl lg:text-[40px] font-heading font-bold text-neutral-dark tracking-tight leading-none">
          {t("title_part1")} <span className="text-primary">{t("title_part2")}</span>
        </h1>
        <p className="text-[15px] text-gray-500 font-medium leading-relaxed mt-2">
          {t("description")}
        </p>
      </div>

      <div className="h-px w-full bg-gray-100/60" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* Sub-Navigation Sidebar */}
        <nav className="lg:col-span-4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-4 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 custom-scrollbar scroll-smooth">
          {settingsNav.map((item) => {
            const normalizedPathname = pathname.replace(/\/$/, "");
            const normalizedHref = item.href.replace(/\/$/, "");
            const isActive = normalizedPathname === normalizedHref || normalizedPathname.startsWith(normalizedHref + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl transition-all border shrink-0 lg:shrink",
                  isActive
                    ? "bg-white border-gray-100 shadow-sm"
                    : "border-transparent hover:bg-white hover:border-gray-100 hover:shadow-sm"
                )}
              >
                <div className="flex items-center gap-3 md:gap-5">
                  <div className={cn(
                    "w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl flex items-center justify-center transition-colors shadow-sm",
                    isActive ? "bg-primary text-white" : "bg-white border border-gray-100 text-gray-400 group-hover:text-primary"
                  )}>
                    <item.icon size={18} className="md:size-[20px]" />
                  </div>
                  <div className="space-y-0.5">
                    <p className={cn(
                      "text-[11px] md:text-[13px] font-bold uppercase tracking-widest transition-colors whitespace-nowrap",
                      isActive ? "text-neutral-dark" : "text-gray-500 group-hover:text-primary"
                    )}>{t(`nav.${item.key}.title`)}</p>
                    <p className={cn(
                      "hidden md:block text-[11px] font-medium leading-none transition-colors",
                      isActive ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500"
                    )}>{t(`nav.${item.key}.desc`)}</p>
                  </div>
                </div>
                <ChevronRight
                  size={14}
                  className={cn(
                    "transition-all duration-300 hidden lg:block",
                    isActive ? "text-primary translate-x-1" : "text-gray-200 opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* Settings Content Area */}
        <div className="lg:col-span-8 animate-in slide-in-from-right-4 fade-in duration-500">
          {children}
        </div>

      </div>
    </div>
  );
}
