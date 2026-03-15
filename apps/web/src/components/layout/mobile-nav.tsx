"use client";

import { Sheet } from "../ui/sheet";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { sports, getCategoriesBySport } from "@/lib/data";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations("nav");
  const [expandedSport, setExpandedSport] = useState<string | null>(null);

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
        {sports.map((sport) => {
          const cats = getCategoriesBySport(sport.slug);
          const isExpanded = expandedSport === sport.id;
          return (
            <div key={sport.id} className="border-b">
              <button
                onClick={() => setExpandedSport(isExpanded ? null : sport.id)}
                className="w-full flex items-center justify-between py-3 px-2 text-sm font-semibold hover:text-primary"
              >
                <span>
                  {sport.icon} {sport.name}
                </span>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                />
              </button>
              {isExpanded && (
                <div className="pl-6 pb-2">
                  <Link
                    href={`/sports/${sport.slug}`}
                    onClick={onClose}
                    className="block py-2 text-sm text-gray-600 hover:text-primary"
                  >
                    All {sport.name}
                  </Link>
                  {cats.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      onClick={onClose}
                      className="block py-2 text-sm text-gray-600 hover:text-primary"
                    >
                      {cat.name}
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
