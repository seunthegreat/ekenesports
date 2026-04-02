"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Truck,
  Globe,
  Plus,
  Trash2,
  Edit2,
  Box,
  BadgeCheck,
  Building,
  Save,
  CheckCircle2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AddMethodModal } from "@/components/settings/add-method-modal";
import { CreateZoneModal } from "@/components/settings/create-zone-modal";
import { SaveSettingsBar } from "@/components/settings/save-settings-bar";

interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  methods: ShippingMethod[];
  active: boolean;
}

interface ShippingMethod {
  id: string;
  name: string;
  carrier: string;
  price: number;
  freeThreshold: number;
  minDays: number;
  maxDays: number;
  active: boolean;
}

export default function ShippingSettings() {
  const t = useTranslations("Shipping");
  const tGen = useTranslations("General");

  // Mock initial state
  const [zones, setZones] = useState<ShippingZone[]>([
    {
      id: "1",
      name: "Domestic (Germany)",
      countries: ["Germany"],
      active: true,
      methods: [
        { id: "m1", name: "DHL Standard", carrier: "DHL", price: 4.90, freeThreshold: 50, minDays: 2, maxDays: 3, active: true },
        { id: "m2", name: "DHL Express", carrier: "DHL", price: 12.00, freeThreshold: 150, minDays: 1, maxDays: 1, active: true },
      ]
    },
    {
      id: "2",
      name: "European Union",
      countries: ["France", "Italy", "Spain", "Austria"],
      active: true,
      methods: [
        { id: "m3", name: "EU Standard", carrier: "DPD", price: 9.90, freeThreshold: 100, minDays: 3, maxDays: 5, active: true },
      ]
    }
  ]);

  const [isAddingZone, setIsAddingZone] = useState(false);
  const [activeZoneForMethod, setActiveZoneForMethod] = useState<ShippingZone | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSaveAll = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      toast.success(tGen("toast.save_success"));
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  const handleCreateZone = (data: { name: string; active: boolean }) => {
    const newZone: ShippingZone = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      countries: [],
      active: data.active,
      methods: []
    };
    setZones([...zones, newZone]);
    toast.success(t("toast.zone_created"));
  };

  const handleAddMethod = (data: any) => {
    if (!activeZoneForMethod) return;

    const newMethod: ShippingMethod = {
      id: Math.random().toString(36).substr(2, 9),
      ...data
    };

    setZones(zones.map(z =>
      z.id === activeZoneForMethod.id
        ? { ...z, methods: [...z.methods, newMethod] }
        : z
    ));
    toast.success(t("toast.method_added"));
  };

  const removeZone = (id: string) => {
    setZones(zones.filter(z => z.id !== id));
    toast.error(t("toast.zone_removed"));
  };

  const toggleMethod = (zoneId: string, methodId: string) => {
    setZones(zones.map(z => {
      if (z.id !== zoneId) return z;
      return {
        ...z,
        methods: z.methods.map(m => m.id === methodId ? { ...m, active: !m.active } : m)
      };
    }));
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header with quick add */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-primary">
          <Truck size={20} />
          <h2 className="text-sm font-bold text-neutral-dark uppercase tracking-wider">{t("title")}</h2>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsAddingZone(true)}>
          <Plus size={14} />
          {t("add_zone")}
        </Button>
      </div>

      <div className="space-y-8">
        {zones.map((zone) => (
          <section key={zone.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Card className="overflow-hidden border-none shadow-sm" padding="none" rounded="2xl">
              {/* Zone Header */}
              <div className="p-6 bg-neutral-light/50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-gray-100">
                    <Globe size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-dark">{zone.name}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">
                      {zone.countries.length > 0 ? zone.countries.join(", ") : t("no_countries")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-300 hover:text-neutral-dark transition-colors" title={t("edit_zone")}>
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => removeZone(zone.id)}
                    className="p-2 text-gray-300 hover:text-error transition-colors"
                    title={t("remove_zone")}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Methods List */}
              <div className="divide-y divide-gray-50 bg-white">
                {zone.methods.length === 0 ? (
                  <div className="p-12 text-center space-y-3">
                    <Box size={32} className="mx-auto text-gray-100" />
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t("no_methods")}</p>
                    <Button variant="ghost" size="sm" className="text-primary mt-2" onClick={() => setActiveZoneForMethod(zone)}>
                      {t("add_first_method")}
                    </Button>
                  </div>
                ) : (
                  zone.methods.map((method) => (
                    <div
                      key={method.id}
                      className={cn(
                        "p-6 flex items-center justify-between transition-colors",
                        !method.active && "opacity-40 grayscale"
                      )}
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-10 h-10 bg-neutral-light rounded-xl flex items-center justify-center text-gray-400">
                          {method.carrier === "DHL" ? <BadgeCheck size={20} className="text-blue-500" /> : <Building size={20} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-neutral-dark">{method.name}</h4>
                            {method.price === 0 && (
                              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                {t("free")}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                            {method.carrier} · {method.minDays}–{method.maxDays} {t("days")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-sm font-bold text-neutral-dark font-mono">
                            {method.price === 0 ? "€0.00" : `€${method.price.toFixed(2)}`}
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium italic">
                            {method.freeThreshold > 0 ? t("free_over", { amount: method.freeThreshold }) : t("paid_always")}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleMethod(zone.id, method.id)}
                          className={cn(
                            "relative w-10 h-5 rounded-full transition-all duration-300 focus:outline-none shadow-inner",
                            method.active ? "bg-primary" : "bg-gray-100 border border-gray-200"
                          )}
                        >
                          <span
                            className={cn(
                              "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300",
                              method.active ? "translate-x-5" : "translate-x-0"
                            )}
                          />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add method trigger */}
              {zone.methods.length > 0 && (
                <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-50 flex justify-center">
                  <button
                    onClick={() => setActiveZoneForMethod(zone)}
                    className="text-[10px] font-bold text-gray-400 hover:text-primary uppercase tracking-widest transition-colors flex items-center gap-2"
                  >
                    <Plus size={12} />
                    {t("add_another_method")}
                  </button>
                </div>
              )}
            </Card>
          </section>
        ))}
      </div>

      {/* Modals */}
      <CreateZoneModal
        isOpen={isAddingZone}
        onClose={() => setIsAddingZone(false)}
        onSave={handleCreateZone}
      />

      <AddMethodModal
        isOpen={!!activeZoneForMethod}
        onClose={() => setActiveZoneForMethod(null)}
        zoneName={activeZoneForMethod?.name || ""}
        onSave={handleAddMethod}
      />

      <SaveSettingsBar
        isSaving={isSaving}
        showSuccess={showSuccess}
        onSave={handleSaveAll}
      />
    </div>
  );
}
