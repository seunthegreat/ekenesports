"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Globe, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ compact }: { compact?: boolean }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.replace(pathname, { locale: e.target.value });
  };

  const languages = [
    { label: "EN", code: "en", flag: "🇬🇧" },
    { label: "DE", code: "de", flag: "🇩🇪" },
  ];

  return (
    <div className="relative flex items-center min-w-0 flex-shrink">
      {!compact && (
        <Globe size={16} className="absolute left-3 animate-in fade-in zoom-in text-gray-400 pointer-events-none" />
      )}
      <select
        value={locale}
        onChange={switchLocale}
        className={cn(
          "w-full appearance-none bg-white border border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50 hover:text-neutral-dark rounded-xl transition-all duration-200 outline-none font-bold uppercase tracking-widest cursor-pointer",
          compact ? "px-2 py-1.5 text-[11px] text-center" : "pl-9 pr-7 py-1.5 text-[11px]"
        )}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {compact ? lang.code.toUpperCase() : lang.label}
          </option>
        ))}
      </select>
      {!compact && (
        <ChevronDown size={14} className="absolute right-3 text-gray-400 pointer-events-none" />
      )}
    </div>
  );
}
