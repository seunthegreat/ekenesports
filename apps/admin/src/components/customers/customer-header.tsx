"use client";

import { UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface CustomerHeaderProps {
  onAdd: () => void;
}

export function CustomerHeader({ onAdd }: CustomerHeaderProps) {
  const t = useTranslations("Customers");
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
      <div className="max-w-xl space-y-2">
        <h1 className="text-3xl lg:text-[40px] font-heading font-bold text-neutral-dark tracking-tight leading-none">
          {t("title_part1")} <span className="text-primary">{t("title_part2")}</span>
        </h1>
        <p className="text-sm text-gray-500 font-medium leading-relaxed mt-2">
          {t("description")}
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="default" size="sm" onClick={onAdd}>
          <UserPlus size={16} />
          {t("add")}
        </Button>
      </div>
    </div>
  );
}
