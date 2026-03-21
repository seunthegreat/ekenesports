"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  MapPin,
  Camera,
  UserPlus,
  Save
} from "lucide-react";
import { Customer } from "@/lib/types";
import { Modal } from "@/components/ui/modal";
import { Dropdown } from "@/components/ui/dropdown";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useHotkeys } from "@/hooks/use-hotkeys";
import { toast } from "sonner";
import { Select } from "@/components/ui/select";

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Customer>) => void;
  customer?: Customer | null;
  isAdding?: boolean;
}

export function CustomerFormModal({
  isOpen,
  onClose,
  onSave,
  customer,
  isAdding = false
}: CustomerFormModalProps) {
  const t = useTranslations("Customers");
  const [form, setForm] = useState<Partial<Customer>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (customer) {
      setForm({ ...customer });
    } else {
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        status: "active",
        addresses: []
      });
    }
  }, [customer, isOpen]);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate sync
    setTimeout(() => {
      onSave(form);
      toast.success(isAdding ? t("form.onboard_success") : t("form.refine_success"));
      setIsSaving(false);
      onClose();
    }, 800);
  };

  useHotkeys("s", () => {
    if (isOpen) handleSave();
  }, { ctrlOrCmd: true, preventDefault: true });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isAdding ? t("form.title_add") : t("form.title_edit")}
      maxWidth="lg"
      footer={(
        <div className="flex items-center justify-end gap-3 w-full">
          <Button
            variant="ghost"
            onClick={onClose}
            className="px-6 py-3 text-[11px] font-bold text-gray-400 hover:text-neutral-dark hover:bg-transparent uppercase tracking-widest transition-colors h-[44px]"
          >
            {t("form.cancel")}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3.5 bg-neutral-dark text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-black transition-all shadow-lg shadow-black/10 disabled:opacity-70 h-[44px]"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              isAdding ? <UserPlus size={16} /> : <Save size={16} />
            )}
            {isSaving ? t("form.saving") : t("form.save")}
          </Button>
        </div>
      )}
    >
      <div className="space-y-10 py-2">
        {/* Section: Core Identity */}
        <div className="space-y-6">
          <div className="border-l-2 border-primary pl-4 py-0.5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-dark">{t("form.personal")}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{t("form.first_name")}</label>
                <Input
                  type="text"
                  value={form.firstName || ""}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  placeholder={t("form.placeholders.first_name")}
                  className="bg-white border-gray-200"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{t("form.last_name")}</label>
                <Input
                  type="text"
                  value={form.lastName || ""}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  placeholder={t("form.placeholders.last_name")}
                  className="bg-white border-gray-200"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{t("form.status_label")}</label>
              <Select
                value={form.status || "active"}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="bg-white border-gray-200"
              >
                <option value="active">{t("filters.active")}</option>
                <option value="inactive">{t("filters.inactive")}</option>
                <option value="blocked">{t("filters.blocked")}</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Section: Contact & Secure Channels */}
        <div className="space-y-6">
          <div className="border-l-2 border-indigo-500 pl-4 py-0.5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-dark">{t("form.email")} & {t("form.phone")}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{t("form.email")}</label>
              <Input
                type="email"
                value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder={t("form.placeholders.email")}
                className="bg-white border-gray-200 font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{t("form.phone")}</label>
              <Input
                type="tel"
                value={form.phone || ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder={t("form.placeholders.phone")}
                className="bg-white border-gray-200 font-mono"
              />
            </div>
          </div>
        </div>

        {isAdding && (
          <div className="space-y-6">
            <div className="border-l-2 border-amber-500 pl-4 py-0.5">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-dark">{t("form.address")}</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{t("form.street")}</label>
                <Input
                  type="text"
                  placeholder={t("form.placeholders.street")}
                  className="bg-white border-gray-200"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Input type="text" placeholder={t("form.city")} className="bg-white border-gray-200" />
                <Input type="text" placeholder={t("form.zip")} className="bg-white border-gray-200" />
                <Input type="text" placeholder={t("form.state")} className="bg-white border-gray-200" />
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
