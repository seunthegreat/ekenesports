"use client";

import { Save, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SaveSettingsBarProps {
  isSaving: boolean;
  showSuccess: boolean;
  onSave: () => void;
}

export function SaveSettingsBar({ isSaving, showSuccess, onSave }: SaveSettingsBarProps) {
  const t = useTranslations("General");

  return (
    <div className="sticky bottom-8 z-20">
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 p-4 rounded-3xl shadow-2xl flex items-center justify-between mx-auto max-w-lg scale-in-center">
        <div className="flex items-center gap-4 pl-4 whitespace-nowrap overflow-hidden">
          {showSuccess ? (
            <div className="flex items-center gap-2 text-emerald-500 animate-in fade-in slide-in-from-left-2">
              <CheckCircle2 size={18} />
              <span className="text-[11px] font-bold uppercase tracking-widest">{t("success")}</span>
            </div>
          ) : (
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              {t("unsaved")}
            </div>
          )}
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          className={cn(
            "gap-2 min-w-[130px] transition-all",
            showSuccess && "bg-primary/80 pointer-events-none"
          )}
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : showSuccess ? (
            <CheckCircle2 size={16} />
          ) : (
            <span className="flex items-center gap-2">
              <Save size={16} />
              {t("save")}
            </span>
          )}
          {isSaving && t("saving")}
          {!isSaving && showSuccess && t("save")}
          {!isSaving && !showSuccess && ""}
        </Button>
      </div>
    </div>
  );
}
