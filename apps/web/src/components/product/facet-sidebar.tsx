"use client";

import { Facets, FilterState } from "@/lib/types";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FacetSidebarProps {
  facets: Facets;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

function FacetSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-semibold mb-2"
      >
        {title}
        <ChevronDown className={cn("w-4 h-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && children}
    </div>
  );
}

export function FacetSidebar({ facets, filters, onFilterChange }: FacetSidebarProps) {
  const t = useTranslations("products");

  return (
    <div className="space-y-0">
      {/* Sport */}
      {facets.sports.length > 0 && (
        <FacetSection title={t("sport")}>
          <div className="space-y-1.5">
            {facets.sports.map((f) => (
              <label key={f.value} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="sport"
                  checked={filters.sport === f.value}
                  onChange={() =>
                    onFilterChange({
                      ...filters,
                      sport: filters.sport === f.value ? undefined : f.value,
                      page: 1,
                    })
                  }
                  className="accent-primary"
                />
                <span className="flex-1">{f.label}</span>
                <span className="text-xs text-gray-400">({f.count})</span>
              </label>
            ))}
          </div>
        </FacetSection>
      )}

      {/* Gender */}
      <FacetSection title={t("gender")}>
        <div className="space-y-1.5">
          {facets.genders.map((f) => (
            <label key={f.value} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="gender"
                checked={filters.gender === f.value}
                onChange={() =>
                  onFilterChange({
                    ...filters,
                    gender: filters.gender === f.value ? undefined : f.value,
                    page: 1,
                  })
                }
                className="accent-primary"
              />
              <span className="flex-1">{f.label}</span>
              <span className="text-xs text-gray-400">({f.count})</span>
            </label>
          ))}
        </div>
      </FacetSection>

      {/* Colors */}
      <FacetSection title={t("color")}>
        <div className="flex flex-wrap gap-2">
          {facets.colors.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                const current = filters.colors || [];
                const updated = current.includes(f.value)
                  ? current.filter((c) => c !== f.value)
                  : [...current, f.value];
                onFilterChange({ ...filters, colors: updated.length ? updated : undefined, page: 1 });
              }}
              className={cn(
                "w-7 h-7 rounded-full border-2 transition-all",
                (filters.colors || []).includes(f.value) ? "border-primary scale-110" : "border-gray-300"
              )}
              style={{ backgroundColor: f.hex }}
              title={`${f.label} (${f.count})`}
            />
          ))}
        </div>
      </FacetSection>

      {/* Sizes */}
      <FacetSection title={t("size")}>
        <div className="flex flex-wrap gap-1.5">
          {facets.sizes.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                const current = filters.sizes || [];
                const updated = current.includes(f.value)
                  ? current.filter((s) => s !== f.value)
                  : [...current, f.value];
                onFilterChange({ ...filters, sizes: updated.length ? updated : undefined, page: 1 });
              }}
              className={cn(
                "px-2.5 py-1 rounded text-xs font-medium border transition-colors",
                (filters.sizes || []).includes(f.value)
                  ? "border-primary bg-primary text-white"
                  : "border-gray-300 hover:border-primary"
              )}
            >
              {f.value}
            </button>
          ))}
        </div>
      </FacetSection>

      {/* Brands */}
      <FacetSection title={t("brand")} defaultOpen={false}>
        <div className="space-y-1.5">
          {facets.brands.map((f) => (
            <label key={f.value} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="brand"
                checked={filters.brand === f.value}
                onChange={() =>
                  onFilterChange({
                    ...filters,
                    brand: filters.brand === f.value ? undefined : f.value,
                    page: 1,
                  })
                }
                className="accent-primary"
              />
              <span className="flex-1">{f.label}</span>
              <span className="text-xs text-gray-400">({f.count})</span>
            </label>
          ))}
        </div>
      </FacetSection>

      {/* Clear filters */}
      <button
        onClick={() => onFilterChange({ page: 1 })}
        className="text-sm text-primary hover:underline font-medium"
      >
        {t("clearFilters")}
      </button>
    </div>
  );
}
