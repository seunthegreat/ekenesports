"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Select } from "@/components/ui/select";

interface StockFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: string;
  currentSport: string;
  onUpdate: (key: string, value: string) => void;
  onClear: () => void;
}

export function StockFilterPanel({
  isOpen,
  onClose,
  currentLevel,
  currentSport,
  onUpdate,
  onClear
}: StockFilterPanelProps) {
  const t = useTranslations("Stock");

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-3 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[60] p-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[11px] font-heading font-bold text-[#1A1A2E]/60 uppercase tracking-widest">{t("filter.panel_title")}</h3>
        <button onClick={onClose}><X size={14} className="text-gray-300" /></button>
      </div>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 block">{t("filter.level")}</label>
          <Select
            value={currentLevel}
            onChange={(e) => onUpdate("level", e.target.value)}
          >
            <option value="all">{t("filter.all_levels")}</option>
            <option value="low">{t("filter.low_stock")}</option>
            <option value="out">{t("filter.out_of_stock")}</option>
            <option value="healthy">{t("filter.healthy_stock")}</option>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 block">{t("filter.sport")}</label>
          <Select
            value={currentSport}
            onChange={(e) => onUpdate("sport", e.target.value)}
          >
            <option value="all">{t("filter.all_sports")}</option>
            <option value="football">{t("filter.football")}</option>
            <option value="basketball">{t("filter.basketball")}</option>
            <option value="running">{t("filter.running")}</option>
            <option value="training">{t("filter.training")}</option>
          </Select>
        </div>

        {(currentLevel !== "all" || currentSport !== "all") && (
          <button
            onClick={onClear}
            className="w-full mt-2 py-2 text-xs font-bold text-gray-400 hover:text-error transition-colors text-center"
          >
            {t("filter.clear")}
          </button>
        )}
      </div>
    </div>
  );
}
