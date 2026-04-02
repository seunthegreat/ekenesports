"use client";

import { ChevronLeft, Edit2, Mail, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Customer } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CustomerDetailHeaderProps {
  customer: Customer;
  onEdit: () => void;
}

export function CustomerDetailHeader({ customer, onEdit }: CustomerDetailHeaderProps) {
  const t = useTranslations("Customers");
  const router = useRouter();

  const statusStyles = {
    active: { label: t("filters.active"), bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
    inactive: { label: t("filters.inactive"), bg: "bg-gray-50", text: "text-gray-400", dot: "bg-gray-300" },
    blocked: { label: t("filters.blocked"), bg: "bg-error/5", text: "text-error", dot: "bg-error" },
  };

  const status = statusStyles[customer.status] || statusStyles.active;

  return (
    <div className="flex flex-col gap-8">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary transition-colors group mb-1"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        {t("detail.back")}
      </button>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-[28px] bg-neutral-light border border-gray-100 flex items-center justify-center text-primary overflow-hidden shadow-inner shrink-0 leading-none">
            {customer.avatar ? (
              <img src={customer.avatar} alt={customer.firstName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-heading font-bold opacity-40">
                {customer.firstName?.[0]}{customer.lastName?.[0]}
              </span>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-heading font-bold text-neutral-dark tracking-tight leading-none">
                {customer.firstName} {customer.lastName}
              </h1>
              <span className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest border transition-all",
                status.bg, status.text, "border-transparent"
              )}>
                <span className={cn("w-1.5 h-1.5 rounded-full", status.dot)} />
                {status.label}
              </span>
            </div>
            <p className="text-sm text-gray-400 font-medium flex items-center gap-2">
              <Calendar size={14} className="opacity-50" />
              {t("detail.since", { date: new Date(customer.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) })}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="gap-2.5" onClick={onEdit}>
            <Edit2 size={15} />
            {t("detail.edit")}
          </Button>
          <Button variant="default" size="sm" className="gap-2.5">
            <Mail size={15} />
            {t("detail.send_email")}
          </Button>
        </div>
      </div>
    </div>
  );
}
