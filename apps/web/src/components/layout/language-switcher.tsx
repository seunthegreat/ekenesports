"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const switchLocale = (newLocale: "en" | "de") => {
    router.replace(pathname, { locale: newLocale });
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors"
        aria-label="Switch language"
      >
        <Globe className="w-4 h-4" />
        <span className="uppercase">{locale}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border py-1 min-w-[120px] z-50">
          <button
            onClick={() => switchLocale("en")}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-light ${locale === "en" ? "text-primary font-semibold" : ""}`}
          >
            🇬🇧 English
          </button>
          <button
            onClick={() => switchLocale("de")}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-light ${locale === "de" ? "text-primary font-semibold" : ""}`}
          >
            🇩🇪 Deutsch
          </button>
        </div>
      )}
    </div>
  );
}
