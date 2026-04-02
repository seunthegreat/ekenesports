"use client";

import { History } from "lucide-react";
import { useTranslations } from "next-intl";
import { Modal } from "@/components/ui/modal";

interface StockHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StockHistoryModal({ isOpen, onClose }: StockHistoryModalProps) {
  const t = useTranslations("Stock");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("modal.history_title")}
      maxWidth="lg"
    >
      <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 bg-neutral-light rounded-full flex items-center justify-center text-gray-300">
          <History size={32} />
        </div>
        <p className="text-sm font-bold text-gray-400">{t("modal.history_placeholder")}</p>
      </div>
    </Modal>
  );
}
