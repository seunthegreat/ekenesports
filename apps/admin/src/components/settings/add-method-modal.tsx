"use client";

import { useState } from "react";
import { Truck, Clock, Euro } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface AddMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  zoneName: string;
  onSave: (method: {
    name: string;
    carrier: string;
    price: number;
    freeThreshold: number;
    minDays: number;
    maxDays: number;
    active: boolean;
  }) => void;
}

const CARRIER_PRESET_KEYS = [
  { key: "DHL Express",    price: 0,     freeThreshold: 150, minDays: 1, maxDays: 2 },
  { key: "Standard Post",  price: 4.99,  freeThreshold: 50,  minDays: 3, maxDays: 5 },
  { key: "EU Priority",    price: 12.50, freeThreshold: 200, minDays: 2, maxDays: 4 },
  { key: "Custom Carrier", price: 0,     freeThreshold: 0,   minDays: 1, maxDays: 7 },
] as const;

export function AddMethodModal({ isOpen, onClose, zoneName, onSave }: AddMethodModalProps) {
  const t = useTranslations("Shipping.add_method_modal");

  const [carrier,       setCarrier]       = useState("");
  const [name,          setName]          = useState("");
  const [price,         setPrice]         = useState(0);
  const [freeThreshold, setFreeThreshold] = useState(0);
  const [minDays,       setMinDays]       = useState(1);
  const [maxDays,       setMaxDays]       = useState(5);
  const [active,        setActive]        = useState(true);
  const [preset,        setPreset]        = useState<string | null>(null);

  const handlePreset = (p: typeof CARRIER_PRESET_KEYS[number]) => {
    setPreset(p.key);
    setCarrier(p.key);
    setName(t(`carrier_presets.${p.key}` as any));
    setPrice(p.price);
    setFreeThreshold(p.freeThreshold);
    setMinDays(p.minDays);
    setMaxDays(p.maxDays);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), carrier, price, freeThreshold, minDays, maxDays, active });
    setCarrier(""); setName(""); setPrice(0); setFreeThreshold(0);
    setMinDays(1);  setMaxDays(5); setActive(true); setPreset(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${t("title")} — ${zoneName}`}
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
            className="gap-2 min-w-[130px]"
          >
            <Truck size={15} />
            {t("submit")}
          </Button>
        </div>
      }
    >
      <div className="space-y-7 py-2">
        {/* Carrier presets */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
            {t("presets_label")}
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {CARRIER_PRESET_KEYS.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => handlePreset(p)}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all",
                  preset === p.key
                    ? "border-primary bg-primary/5 ring-2 ring-primary/15"
                    : "border-gray-100 hover:border-primary/30 bg-white"
                )}
              >
                <p className="text-xs font-bold text-neutral-dark">{t(`carrier_presets.${p.key}` as any)}</p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                  {p.price === 0 ? `€${p.freeThreshold} free` : `€${p.price.toFixed(2)}`} · {p.minDays}–{p.maxDays}d
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Method Name */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{t("name_label")}</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("name_placeholder")}
          />
        </div>

        {/* Rate + Free threshold */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
              <Euro size={11} /> {t("price_label")}
            </label>
            <Input
              type="number"
              min={0}
              step={0.01}
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
            <p className="text-[10px] text-gray-400 font-medium ml-1">{t("price_note")}</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
              {t("threshold_label")}
            </label>
            <Input
              type="number"
              min={0}
              step={1}
              value={freeThreshold}
              onChange={(e) => setFreeThreshold(parseInt(e.target.value) || 0)}
              placeholder="150"
            />
            <p className="text-[10px] text-gray-400 font-medium ml-1">{t("threshold_note")}</p>
          </div>
        </div>

        {/* Delivery window */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
            <Clock size={11} /> {t("window_label")}
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <p className="text-[10px] text-gray-400 font-medium ml-1">{t("min_label")}</p>
              <Input type="number" min={1} value={minDays} onChange={(e) => setMinDays(parseInt(e.target.value) || 1)} />
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] text-gray-400 font-medium ml-1">{t("max_label")}</p>
              <Input type="number" min={1} value={maxDays} onChange={(e) => setMaxDays(parseInt(e.target.value) || 1)} />
            </div>
          </div>
        </div>

        {/* Active toggle */}
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
