"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { User, ArrowRight, FileText, MapPin, Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Order } from "@/lib/types";

interface OrderCustomerCardProps {
  order: Order;
}

export function OrderCustomerCard({ order }: OrderCustomerCardProps) {
  const t = useTranslations("Orders");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="space-y-6" padding="md" shadow="sm">
      <div className="flex items-center justify-between border-b border-gray-50 pb-4">
        <h3 className="text-xs font-heading font-bold text-neutral-dark/60 uppercase tracking-widest flex items-center gap-2">
          <User size={14} className="text-primary" />
          {t("detail.customer_log")}
        </h3>
        <Link href={`/customers/${order.id}`} className="p-1.5 hover:bg-neutral-light rounded-lg text-gray-300 hover:text-primary transition-colors">
          <ArrowRight size={14} />
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-heading font-bold text-sm">
          {order.shippingAddress.firstName?.[0] || ""}{order.shippingAddress.lastName?.[0] || ""}
        </div>
        <div>
          <h4 className="text-sm font-bold text-neutral-dark">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</h4>
          <p className="text-xs text-gray-400 font-medium">{t("detail.customer_id", { id: "8271" })}</p>
        </div>
      </div>
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3 text-xs text-gray-500 font-medium group">
          <FileText size={14} className="text-gray-300 group-hover:text-primary" />
          <span className="truncate">{order.shippingAddress.email}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500 font-medium group">
          <MapPin size={14} className="text-gray-300 group-hover:text-primary" />
          <span>{order.shippingAddress.city}, {order.shippingAddress.country}</span>
        </div>
      </div>

      <div className="h-px bg-gray-50" />

      <div className="space-y-4">
        <h4 className="text-xs font-heading font-bold text-gray-400 uppercase tracking-widest">{t("detail.delivery_address")}</h4>
        <div className="relative p-4 bg-neutral-light rounded-2xl border border-gray-100 group">
          <button
            onClick={() => handleCopy(`${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`)}
            className="absolute top-3 right-3 p-2 bg-white rounded-lg text-gray-300 opacity-0 group-hover:opacity-100 hover:text-primary transition-all shadow-sm border border-gray-100"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
          <p className="text-[13px] text-neutral-dark font-bold leading-relaxed pr-8">
            {order.shippingAddress.street}<br />
            {order.shippingAddress.apartment && <>{order.shippingAddress.apartment}<br /></>}
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
            {order.shippingAddress.country}
          </p>
        </div>
      </div>
    </Card>
  );
}
