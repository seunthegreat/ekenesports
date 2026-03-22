"use client";

import { useTranslations } from "next-intl";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary" | "warning";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
  variant = "danger",
}: ConfirmDialogProps) {
  const t = useTranslations("Common");
  
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="sm"
      footer={(
        <div className="flex items-center justify-end gap-3 w-full">
          <Button
            variant="ghost"
            onClick={onClose}
            className="px-6 py-2 text-xs font-bold text-gray-500 hover:text-neutral-dark hover:bg-transparent"
          >
            {cancelLabel || t("confirm.cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            className={`px-6 py-2 text-xs font-bold rounded-xl text-white shadow-lg transition-all ${
              variant === "danger" 
                ? "bg-error hover:bg-error/90 shadow-error/20" 
                : variant === "warning"
                ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20"
                : "bg-primary hover:bg-primary/90 shadow-primary/20"
            }`}
          >
            {confirmLabel || t("confirm.confirm")}
          </Button>
        </div>
      )}
    >
      <div className="pt-2 pb-6 space-y-4 text-center">
        {variant === "danger" && (
          <div className="w-14 h-14 rounded-full bg-error/10 flex items-center justify-center text-error mx-auto mb-2">
            <AlertCircle size={26} />
          </div>
        )}
        <p className="text-sm text-gray-500 font-medium leading-relaxed">
          {description}
        </p>
      </div>
    </Modal>
  );
}
