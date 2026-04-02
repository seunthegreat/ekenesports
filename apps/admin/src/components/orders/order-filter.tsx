"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Select } from "@/components/ui/select";

interface OrderFilterProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: string;
  onUpdate: (key: string, value: string) => void;
}

export function OrderFilter({
  isOpen,
  onClose,
  currentStatus,
  onUpdate
}: OrderFilterProps) {
  const t = useTranslations("Orders");

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-3 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[60] p-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[11px] font-heading font-bold text-[#1A1A2E]/60 uppercase tracking-widest">{t("filters.panel_title")}</h3>
        <button onClick={onClose} className="hover:rotate-90 transition-transform">
          <X size={14} className="text-gray-300" />
        </button>
      </div>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-widest ml-1 block">{t("filters.status")}</label>
          <Select
            value={currentStatus}
            onChange={(e) => onUpdate("status", e.target.value)}
          >
            <option value="all">{t("filters.all_statuses")}</option>
            <option value="confirmed">{t("status.confirmed")}</option>
            <option value="processing">{t("status.processing")}</option>
            <option value="shipped">{t("status.shipped")}</option>
            <option value="delivered">{t("status.delivered")}</option>
            <option value="cancelled">{t("status.cancelled")}</option>
            <option value="refunded">{t("status.refunded")}</option>
          </Select>
        </div>

        {currentStatus !== "all" && (
          <button
            onClick={() => onUpdate("status", "all")}
            className="w-full mt-2 py-2 text-xs font-bold text-gray-400 hover:text-error transition-colors text-center font-heading uppercase tracking-widest"
          >
            {t("filters.clear")}
          </button>
        )}
      </div>
    </div>
  );
}
