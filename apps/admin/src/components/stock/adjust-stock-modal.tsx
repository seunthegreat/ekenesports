"use client";

import { useTranslations } from "next-intl";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdjustStockModalProps {
  editingStock: any;
  onClose: () => void;
  onConfirm: (newStock: number) => void;
}

export function AdjustStockModal({ editingStock, onClose, onConfirm }: AdjustStockModalProps) {
  const t = useTranslations("Stock");

  return (
    <Modal
      isOpen={!!editingStock}
      onClose={onClose}
      title={t("modal.adjust_title")}
      maxWidth="sm"
      footer={(
        <>
          <Button variant="ghost" onClick={onClose}>{t("form.cancel")}</Button>
          <Button onClick={() => onConfirm(editingStock.stock)}>
            {t("modal.confirm")}
          </Button>
        </>
      )}
    >
      {editingStock && (
        <div className="space-y-6 py-2">
          {/* Simple Product Context */}
          <div className="border-l-2 border-primary pl-4 py-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{editingStock.sku}</p>
            <h4 className="text-sm font-bold text-neutral-dark">{editingStock.productName}</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{editingStock.color} / {editingStock.size}</p>
          </div>

          {/* Simple Formal Inputs */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{t("modal.current")}</label>
              <Input
                disabled
                value={editingStock.stock}
                className="bg-gray-50/50 border-gray-100 text-gray-400 font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-dark uppercase tracking-widest ml-1">{t("modal.new")}</label>
              <Input
                type="number"
                defaultValue={editingStock.stock}
                className="font-mono bg-white border-gray-200"
                autoFocus
              />
            </div>
          </div>

          <p className="text-[11px] text-gray-400 font-medium italic leading-relaxed pt-2">
            {t("modal.alert")}
          </p>
        </div>
      )}
    </Modal>
  );
}
