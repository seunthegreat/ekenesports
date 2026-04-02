"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Select } from "@/components/ui/select";

interface ProductFilterProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: string;
  currentSport: string;
  currentBrand: string;
  onUpdate: (key: string, value: string) => void;
  onClear: () => void;
}

export function ProductFilter({
  isOpen,
  onClose,
  currentStatus,
  currentSport,
  currentBrand,
  onUpdate,
  onClear
}: ProductFilterProps) {
  const t = useTranslations("Products");

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 mt-3 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[60] p-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[11px] font-heading font-bold text-[#1A1A2E]/60 uppercase tracking-widest">{t("filters.panel_title")}</h3>
        <button onClick={onClose} className="hover:rotate-90 transition-transform">
          <X size={14} className="text-gray-300" />
        </button>
      </div>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 block">{t("filters.status")}</label>
          <Select
            value={currentStatus}
            onChange={(e) => onUpdate("status", e.target.value)}
          >
            <option value="all">{t("filters.all_statuses")}</option>
            <option value="active">{t("status.active")}</option>
            <option value="draft">{t("status.draft")}</option>
            <option value="archived">{t("status.archived")}</option>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 block">{t("filters.sport")}</label>
          <Select
            value={currentSport}
            onChange={(e) => onUpdate("sport", e.target.value)}
          >
            <option value="all">{t("filters.all_sports")}</option>
            <option value="football">{t("sports.football")}</option>
            <option value="basketball">{t("sports.basketball")}</option>
            <option value="running">{t("sports.running")}</option>
            <option value="tennis">{t("sports.tennis")}</option>
            <option value="training">{t("sports.training")}</option>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 block">{t("filters.brand")}</label>
          <Select
            value={currentBrand}
            onChange={(e) => onUpdate("brand", e.target.value)}
          >
            <option value="all">{t("filters.all_brands")}</option>
            <option value="Nike">Nike</option>
            <option value="Adidas">Adidas</option>
            <option value="Puma">Puma</option>
            <option value="Under Armour">Under Armour</option>
          </Select>
        </div>

        {(currentStatus !== "all" || currentSport !== "all" || currentBrand !== "all") && (
          <button
            onClick={onClear}
            className="w-full mt-2 py-2 text-xs font-bold text-gray-400 hover:text-error transition-colors font-heading uppercase tracking-widest"
          >
            {t("filters.clear")}
          </button>
        )}
      </div>
    </div>
  );
}
