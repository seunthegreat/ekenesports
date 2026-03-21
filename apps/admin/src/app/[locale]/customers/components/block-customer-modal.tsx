"use client";

import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Customer } from "@/lib/types";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

interface BlockCustomerModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (customer: Customer) => void;
}

export function BlockCustomerModal({ 
  customer, 
  isOpen,
  onClose, 
  onConfirm 
}: BlockCustomerModalProps) {
  const t = useTranslations("Customers");

  if (!customer) return null;

  const isBlocked = customer.status === "blocked";

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={isBlocked ? t("block.title_unblock") : t("block.title")}
      maxWidth="sm"
      footer={(
        <div className="flex gap-3 w-full justify-end">
          <button 
            className="px-5 py-2 text-xs font-bold text-gray-400 hover:text-neutral-dark uppercase tracking-widest transition-colors" 
            onClick={onClose}
          >
            {t("block.abort")}
          </button>
          <button 
            className={cn(
              "px-7 py-3 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-lg transition-all active:scale-95",
              isBlocked 
                ? "bg-emerald-500 shadow-emerald-500/20 hover:bg-emerald-600" 
                : "bg-error shadow-error/20 hover:bg-red-600"
            )}
            onClick={() => onConfirm(customer)}
          >
            {isBlocked ? t("block.confirm_unblock") : t("block.confirm")}
          </button>
        </div>
      )}
    >
      <div className="text-center space-y-5 py-4 px-2">
        <div className={cn(
          "w-20 h-20 rounded-[32px] flex items-center justify-center mx-auto mb-4 border",
          isBlocked 
            ? "bg-emerald-50 text-emerald-500 border-emerald-100" 
            : "bg-error/5 text-error border-error/10"
        )}>
          {isBlocked ? <ShieldCheck size={32} /> : <ShieldAlert size={32} />}
        </div>
        <div className="space-y-2">
           <h4 className="text-[15px] font-bold text-neutral-dark uppercase tracking-wide px-4">
            {isBlocked ? t("block.title_unblock") : t("block.title")}
           </h4>
           <p className="text-[13px] text-gray-400 font-medium leading-relaxed px-4">
              {isBlocked 
                ? t("block.desc_unblock", { name: `${customer.firstName} ${customer.lastName}` })
                : t("block.desc", { name: `${customer.firstName} ${customer.lastName}` })
              }
           </p>
        </div>
      </div>
    </Modal>
  );
}
