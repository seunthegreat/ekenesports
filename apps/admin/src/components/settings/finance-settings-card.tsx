"use client";

import { CreditCard, Percent } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export function FinanceSettingsCard() {
  const t = useTranslations("General");

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 text-secondary mb-2">
        <CreditCard size={20} />
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em]">{t("finance")}</h2>
      </div>

      <Card className="p-8 space-y-8" rounded="2xl" border="primary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 block">{t("currency")}</label>
            <Select
              defaultValue="EUR"
              className="w-full px-5 py-4 bg-neutral-light border border-gray-100 rounded-2xl text-[13px] font-bold outline-none focus:border-primary/20 transition-all shadow-sm h-12"
            >
              <option value="EUR">Euro (€)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="GBP">British Pound (£)</option>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 block">{t("vat")}</label>
            <div className="relative">
              <Percent className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
              <Input
                type="number"
                defaultValue={19}
                className="w-full pl-14 pr-5 py-4 bg-neutral-light border border-gray-100 rounded-2xl text-[13px] font-bold outline-none focus:border-primary/20 transition-all shadow-sm h-12"
              />
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
