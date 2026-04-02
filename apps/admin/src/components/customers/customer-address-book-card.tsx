"use client";

import { MapPin, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Customer } from "@/lib/types";

interface CustomerAddressBookCardProps {
  customer: Customer;
}

export function CustomerAddressBookCard({ customer }: CustomerAddressBookCardProps) {
  const t = useTranslations("Customers");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card padding="md" rounded="2xl" className="space-y-8 overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-50 pb-5 px-1">
        <h3 className="text-xs font-heading font-bold text-neutral-dark/40 uppercase tracking-widest">{t("detail.saved_addresses")}</h3>
        <span className="px-2.5 py-1 bg-gray-50 text-[10px] font-bold rounded-lg text-gray-400 border border-gray-100/50">{customer.addresses?.length || 0}</span>
      </div>

      <div className="space-y-5">
        {customer.addresses?.map((address, idx) => (
          <div key={idx} className="group p-6 bg-neutral-light/40 border border-gray-100/60 rounded-[20px] space-y-5 relative hover:border-primary/20 transition-all shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-300 shrink-0">
                <MapPin size={16} />
              </div>
              <div className="text-[13px] font-medium text-neutral-dark leading-relaxed pt-1">
                {address.street}, {address.apartment && `${address.apartment}, `}
                <br />
                <span className="font-bold text-neutral-dark">{address.city}, {address.postalCode}</span>
                <br />
                <span className="text-gray-400 font-bold uppercase text-[11px] tracking-wider">{address.country}</span>
              </div>
            </div>
            <button
              onClick={() => {
                copyToClipboard(`${address.street}, ${address.city}, ${address.country}`);
              }}
              className="w-full py-2.5 bg-white border border-gray-100 rounded-xl text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-primary hover:border-primary/20 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Copy size={12} />
              {t("detail.quick_copy")}
            </button>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <button className="w-full py-4 bg-gray-50/80 text-[10px] font-bold text-gray-400 rounded-2xl uppercase tracking-[0.2em] hover:bg-gray-100 hover:text-neutral-dark transition-all border border-gray-100/50 shadow-sm">
          {t("detail.manage_locations")}
        </button>
      </div>
    </Card>
  );
}
