"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface CreateZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (zone: { name: string; active: boolean }) => void;
}

const PRESET_ZONE_KEYS = ["Domestic", "European Union", "International", "Custom Region"] as const;

export function CreateZoneModal({ isOpen, onClose, onSave }: CreateZoneModalProps) {
  const t = useTranslations("Shipping.create_zone_modal");

  const [name,   setName]   = useState("");
  const [active, setActive] = useState(true);
  const [preset, setPreset] = useState<string | null>(null);

  const handlePreset = (key: string) => {
    setPreset(key);
    setName(t(`presets.${key}` as any));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), active });
    setName("");
    setPreset(null);
    setActive(true);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("title")}
      maxWidth="md"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="ghost" size="sm" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            disabled={!name.trim()}
            className="gap-2 min-w-[120px]"
          >
            <Globe size={15} />
            {t("submit")}
          </Button>
        </div>
      }
    >
      <div className="space-y-8 py-2">
        {/* Presets */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
            {t("presets_label")}
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {PRESET_ZONE_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => handlePreset(key)}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all",
                  preset === key
                    ? "border-primary bg-primary/5 ring-2 ring-primary/15"
                    : "border-gray-100 hover:border-primary/30 bg-white"
                )}
              >
                <p className="text-xs font-bold text-neutral-dark">{t(`presets.${key}` as any)}</p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">{t(`presets.${key}_hint` as any)}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Zone Name */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
            {t("name_label")}
          </label>
          <Input
            value={name}
            onChange={(e) => { setName(e.target.value); setPreset(null); }}
            placeholder={t("name_placeholder")}
          />
        </div>

        {/* Status toggle */}
        <div className="flex items-center justify-between p-4 bg-neutral-light rounded-2xl border border-gray-100">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-neutral-dark">{t("activate_label")}</p>
            <p className="text-[10px] text-gray-400 font-medium">{t("activate_desc")}</p>
          </div>
          <button
            type="button"
            onClick={() => setActive(prev => !prev)}
            className={cn(
              "relative w-10 h-5 rounded-full transition-all duration-300 focus:outline-none",
              active ? "bg-primary" : "bg-gray-200"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300",
                active ? "translate-x-5" : "translate-x-0"
              )}
            />
          </button>
        </div>
      </div>
    </Modal>
  );
}
