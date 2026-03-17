"use client";

import { Sheet } from "../ui/sheet";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { sports } from "@/lib/data";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

const genderSections = [
  { key: "men" as const, gender: "men" },
  { key: "women" as const, gender: "women" },
  { key: "kids" as const, gender: "kids" },
];

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations("nav");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  return (
    <Sheet open={open} onClose={onClose} side="left" title={t("home")}>
      <nav className="p-4">
        <Link
          href="/products"
          onClick={onClose}
          className="block py-3 px-2 text-sm font-semibold border-b hover:text-primary"
        >
          {t("products")}
        </Link>
        {genderSections.map((section) => {
          const isExpanded = expandedSection === section.key;
          return (
            <div key={section.key} className="border-b">
              <button
                onClick={() => setExpandedSection(isExpanded ? null : section.key)}
                className="w-full flex items-center justify-between py-3 px-2 text-sm font-semibold hover:text-primary"
              >
                <span>{t(section.key)}</span>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                />
              </button>
              {isExpanded && (
                <div className="pl-6 pb-2">
                  <Link
                    href={`/products?gender=${section.gender}`}
                    onClick={onClose}
                    className="block py-2 text-sm font-medium text-gray-600 hover:text-primary"
                  >
                    {t("products")}
                  </Link>
                  {sports.filter((s) => s.slug !== "accessories").map((sport) => (
                    <Link
                      key={sport.id}
                      href={`/products?gender=${section.gender}&sport=${sport.slug}`}
                      onClick={onClose}
                      className="block py-2 text-sm text-gray-600 hover:text-primary"
                    >
                      {sport.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </Sheet>
  );
}
