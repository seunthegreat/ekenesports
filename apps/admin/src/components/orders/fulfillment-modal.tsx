"use client";

import { useTranslations } from "next-intl";
import { AlertCircle, Truck } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface FulfillmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FulfillmentModal({ isOpen, onClose }: FulfillmentModalProps) {
  const t = useTranslations("Orders");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("fulfill_modal.title")}
      maxWidth="md"
      footer={
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2 text-primary">
            <AlertCircle size={14} />
            <span className="text-xs font-bold">{t("fulfill_modal.dhl_integrated")}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>{t("fulfill_modal.cancel")}</Button>
            <Button variant="default" size="sm">{t("fulfill_modal.confirm")}</Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6 pt-2">
        <div className="p-4 bg-neutral-light/50 rounded-2xl border border-gray-100 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-[11px] font-heading font-bold text-[#1A1A2E]/60 uppercase tracking-widest">{t("fulfill_modal.weight")}</p>
            <span className="text-xs font-bold text-neutral-dark">1.25 kg</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-[11px] font-heading font-bold text-[#1A1A2E]/60 uppercase tracking-widest">{t("fulfill_modal.courier")}</p>
            <span className="text-xs font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg">DHL PRO-EXP 24H</span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[11px] font-heading font-bold text-gray-400 uppercase tracking-widest ml-1">{t("fulfill_modal.note_label")}</label>
          <textarea
            className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-sm outline-none focus:border-primary/20 transition-all resize-none h-24 font-medium"
            placeholder={t("fulfill_modal.note_placeholder")}
          />
        </div>

        <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex gap-3 text-primary">
          <Truck size={18} className="shrink-0 mt-0.5" />
          <p className="text-[11px] font-bold leading-normal">
            {t("fulfill_modal.info")}
          </p>
        </div>
      </div>
    </Modal>
  );
}
