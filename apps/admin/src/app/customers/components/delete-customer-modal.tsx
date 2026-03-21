"use client";

import { ShieldAlert } from "lucide-react";
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
  return (
    <Modal 
      isOpen={!!customer} 
      onClose={onClose}
      title="Account Elimination"
      maxWidth="sm"
      footer={(
        <div className="flex gap-3 w-full justify-end">
          <button 
            className="px-5 py-2 text-xs font-bold text-gray-400 hover:text-neutral-dark uppercase tracking-widest transition-colors" 
            onClick={onClose}
          >
            Abort
          </button>
          <button 
            className="px-7 py-3 bg-error text-white text-[10px] font-extrabold uppercase tracking-widest rounded-xl shadow-lg shadow-error/20 hover:bg-red-600 transition-all active:scale-95"
            onClick={() => customer && onConfirm(customer)}
          >
            Confirm Exclusion
          </button>
        </div>
      )}
    >
      <div className="text-center space-y-5 py-4 px-2">
        <div className="w-20 h-20 bg-error/5 rounded-[32px] flex items-center justify-center text-error mx-auto mb-4 border border-error/10">
          <ShieldAlert size={32} />
        </div>
        <div className="space-y-2">
           <h4 className="text-[15px] font-extrabold text-neutral-dark uppercase tracking-wide px-4">Destructive Session Triggered</h4>
           <p className="text-[13px] text-gray-400 font-medium leading-relaxed px-4">
              You are about to permanently purge <span className="font-extrabold text-neutral-dark">{customer ? `${customer.firstName} ${customer.lastName}` : "this account"}</span>. 
              All transaction history and saved credentials will be wiped. This action is non-reversible.
           </p>
        </div>
      </div>
    </Modal>
  );
}
