"use client";

import { Building2, Mail, Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function StoreIdentityCard() {
  const t = useTranslations("General");

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 text-primary mb-2">
        <Building2 size={18} />
        <h2 className="text-sm font-bold text-neutral-dark">{t("identity")}</h2>
      </div>

      <Card className="p-6 space-y-6" rounded="2xl" border="primary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 block ml-1">{t("name")}</label>
            <Input
              type="text"
              defaultValue={t("defaults.store_name")}
              className="w-full px-4 py-3 bg-neutral-light border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-primary/20 transition-all shadow-sm h-11"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 block ml-1">{t("email")}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input
                type="email"
                defaultValue={t("defaults.email")}
                className="w-full pl-11 pr-4 py-3 bg-neutral-light border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-primary/20 transition-all shadow-sm h-11"
              />
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-gray-50" />

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">{t("domain")}</label>
          <div className="relative">
            <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <Input
              type="text"
              defaultValue={t("defaults.domain")}
              className="w-full pl-14 pr-5 py-4 bg-neutral-light border border-gray-100 rounded-2xl text-[13px] font-bold outline-none focus:border-primary/20 transition-all shadow-sm h-12"
            />
          </div>
        </div>
      </Card>
    </section>
  );
}
