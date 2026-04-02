"use client";

import { ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { Customer } from "@/lib/types";
import { Modal } from "@/components/ui/modal";

interface DeleteCustomerModalProps {
  customer: Customer | null;
  onClose: () => void;
  onConfirm: (customer: Customer) => void;
}

export function DeleteCustomerModal({ 
  customer, 
  onClose, 
  onConfirm 
}: DeleteCustomerModalProps) {
  const t = useTranslations("Customers");

  return (
    <Modal 
      isOpen={!!customer} 
      onClose={onClose}
      title={t("delete.title")}
      maxWidth="sm"
      footer={(
        <div className="flex gap-3 w-full justify-end">
          <button 
            className="px-5 py-2 text-xs font-bold text-gray-400 hover:text-neutral-dark uppercase tracking-widest transition-colors" 
            onClick={onClose}
          >
            {t("delete.abort")}
          </button>
          <button 
            className="px-7 py-3 bg-error text-white text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-error/20 hover:bg-red-600 transition-all active:scale-95"
            onClick={() => customer && onConfirm(customer)}
          >
            {t("delete.confirm")}
          </button>
        </div>
      )}
    >
      <div className="text-center space-y-5 py-4 px-2">
        <div className="w-20 h-20 bg-error/5 rounded-[32px] flex items-center justify-center text-error mx-auto mb-4 border border-error/10">
          <ShieldAlert size={32} />
        </div>
        <div className="space-y-2">
           <h4 className="text-[15px] font-bold text-neutral-dark uppercase tracking-wide px-4">{t("delete.title")}</h4>
           <p className="text-[13px] text-gray-400 font-medium leading-relaxed px-4">
              {t("delete.desc", { name: customer ? `${customer.firstName} ${customer.lastName}` : "this account" })}
           </p>
        </div>
      </div>
    </Modal>
  );
}
