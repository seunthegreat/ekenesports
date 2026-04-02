"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Save } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

interface StaffInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (data: { name: string; email: string; role: string }) => void;
}

export function StaffInviteModal({ isOpen, onClose, onInvite }: StaffInviteModalProps) {
  const t = useTranslations("Staff");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("staff_member");

  const handleInvite = () => {
    onInvite({ name, email, role });
    setName("");
    setEmail("");
    setRole("staff_member");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("modal.title")}
      maxWidth="md"
      footer={(
        <div className="flex justify-end gap-3 w-full">
          <Button variant="ghost" onClick={onClose} className="px-5 py-2 text-xs font-bold text-gray-400 hover:text-neutral-dark hover:bg-transparent transition-colors h-[36px]">
            {t("modal.cancel")}
          </Button>
          <Button variant="default" size="sm" className="gap-2" onClick={handleInvite}>
            <Save size={16} />
            {t("modal.send")}
          </Button>
        </div>
      )}
    >
      <div className="space-y-6 pt-2 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-dark uppercase tracking-widest ml-1 block">{t("modal.name")}</label>
            <Input 
              type="text" 
              placeholder={t("modal.name_placeholder")} 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-dark uppercase tracking-widest ml-1 block">{t("modal.email")}</label>
            <Input 
              type="email" 
              placeholder={t("modal.email_placeholder")} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-neutral-dark uppercase tracking-widest ml-1 block">{t("modal.protocol")}</label>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="super_admin">{t("modal.role_super_admin")}</option>
            <option value="logistics_manager">{t("modal.role_logistics_manager")}</option>
            <option value="catalog_editor">{t("modal.role_catalog_editor")}</option>
            <option value="staff_member">{t("modal.role_staff_member")}</option>
          </Select>
        </div>
      </div>
    </Modal>
  );
}
