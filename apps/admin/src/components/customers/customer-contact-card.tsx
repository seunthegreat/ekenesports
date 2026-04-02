"use client";

import { Mail, Phone, BadgeCheck, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Customer } from "@/lib/types";

interface CustomerContactCardProps {
  customer: Customer;
}

export function CustomerContactCard({ customer }: CustomerContactCardProps) {
  const t = useTranslations("Customers");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card padding="md" rounded="2xl" className="space-y-8">
      <h3 className="text-xs font-heading font-bold text-neutral-dark/40 uppercase tracking-widest border-b border-gray-50 pb-5">{t("detail.relationship")}</h3>

      <div className="space-y-7">
        <div className="flex items-center gap-5">
          <div className="w-11 h-11 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shrink-0 border border-gray-100/50">
            <Mail size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t("detail.primary_email")}</p>
            <button
              onClick={() => copyToClipboard(customer.email)}
              className="text-sm font-bold text-neutral-dark hover:text-primary transition-colors flex items-center gap-2 group truncate w-full"
            >
              <span className="truncate">{customer.email}</span>
              <Copy size={12} className="opacity-0 group-hover:opacity-100 shrink-0 text-gray-300" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="w-11 h-11 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shrink-0 border border-gray-100/50">
            <Phone size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t("detail.mobile")}</p>
            <p className="text-sm font-bold text-neutral-dark">{customer.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="w-11 h-11 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shrink-0 border border-gray-100/50">
            <BadgeCheck size={18} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t("detail.identity_check")}</p>
            <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              {t("detail.id_protected")}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
