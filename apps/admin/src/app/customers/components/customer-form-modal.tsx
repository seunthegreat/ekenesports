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
import { useHotkeys } from "@/hooks/use-hotkeys";
import { toast } from "sonner";

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
      toast.success(isAdding ? "Customer onboarded successfully" : "Profile refined successfully");
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
      title={isAdding ? "Onboard New Customer" : "Refine Customer Profile"}
      maxWidth="lg"
      footer={(
        <div className="flex items-center justify-end gap-3 w-full">
          <Button
            variant="ghost"
            onClick={onClose}
            className="px-6 py-3 text-[11px] font-extrabold text-gray-400 hover:text-neutral-dark hover:bg-transparent uppercase tracking-widest transition-colors h-[44px]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3.5 bg-neutral-dark text-white text-[11px] font-extrabold uppercase tracking-[0.2em] rounded-2xl hover:bg-black transition-all shadow-lg shadow-black/10 disabled:opacity-70 h-[44px]"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              isAdding ? <UserPlus size={16} /> : <Save size={16} />
            )}
            {isSaving ? "Processing..." : (isAdding ? "Onboard Account" : "Apply Changes")}
          </Button>
        </div>
      )}
    >
      <div className="space-y-10 py-2">
        {/* Section: Identity Preview */}
        <div className="flex items-center gap-6 p-6 bg-neutral-light/30 rounded-3xl border border-gray-100/50 border-dashed">
          <div className="relative group">
            <div className="w-24 h-24 rounded-[32px] bg-white border border-gray-100 shadow-sm flex items-center justify-center text-primary group-hover:border-primary/20 transition-all overflow-hidden cursor-pointer">
              {form.avatar ? (
                <img src={form.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={32} className="opacity-20" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Camera size={20} />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-extrabold text-neutral-dark uppercase tracking-tight">Identity Digitalization</h4>
            <p className="text-xs text-gray-400 leading-relaxed max-w-[240px]">
              Provide the core credentials for this customer profile. Fields marked as persistent will be used for order vetting.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-primary mb-2">
              <User size={18} />
              <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em]">Full Legal Name</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest ml-1">Given Name</label>
                <Input
                  type="text"
                  value={form.firstName || ""}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  placeholder="e.g. John"
                  className="w-full px-5 py-4 bg-neutral-light/40 border border-gray-100 rounded-2xl text-sm font-bold text-neutral-dark outline-none focus:border-primary/30 focus:bg-white transition-all shadow-sm h-12"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest ml-1">Surname</label>
                <Input
                  type="text"
                  value={form.lastName || ""}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  placeholder="e.g. Doe"
                  className="w-full px-5 py-4 bg-neutral-light/40 border border-gray-100 rounded-2xl text-sm font-bold text-neutral-dark outline-none focus:border-primary/30 focus:bg-white transition-all shadow-sm h-12"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 text-emerald-500 mb-2">
              <Shield size={18} />
              <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em]">Risk Authorization</h3>
            </div>
            <div className="space-y-2 mt-3">
              <label className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest ml-1 mb-1 block">Account status</label>
              <Dropdown
                options={[
                  { label: "Active Account", value: "active" },
                  { label: "Inactive Account", value: "inactive" },
                  { label: "Blocked / Restricted", value: "blocked" }
                ]}
                value={form.status || "active"}
                onChange={(val) => setForm({ ...form, status: val as any })}
                fullWidth
                variant="input"
              />
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-gray-100/50" />

        {/* Section: Contact & Secure Channels */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-indigo-500">
            <Mail size={18} />
            <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em]">Verified Channels</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest ml-1">Digital Mail</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <Input
                  type="email"
                  value={form.email || ""}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="primary@ekenesports.com"
                  className="w-full pl-14 pr-5 py-4 bg-neutral-light/40 border border-gray-100 rounded-2xl text-sm font-bold text-neutral-dark outline-none focus:border-primary/30 focus:bg-white transition-all shadow-sm h-12"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest ml-1">Secure Mobile</label>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <Input
                  type="tel"
                  value={form.phone || ""}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+44 (0) 7..."
                  className="w-full pl-14 pr-5 py-4 bg-neutral-light/40 border border-gray-100 rounded-2xl text-sm font-bold text-neutral-dark outline-none focus:border-primary/30 focus:bg-white transition-all shadow-sm h-12"
                />
              </div>
            </div>
          </div>
        </div>

        {isAdding && (
          <>
            <div className="h-px w-full bg-gray-100/50" />
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-amber-500">
                <MapPin size={18} />
                <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em]">Initial Gateway Address</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest ml-1">Logistics Point (Street)</label>
                  <Input
                    type="text"
                    placeholder="e.g. 10 Downing Street"
                    className="w-full px-5 py-4 bg-neutral-light/40 border border-gray-100 rounded-2xl text-sm font-bold text-neutral-dark outline-none focus:border-primary/30 transition-all shadow-sm h-12"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Input type="text" placeholder="City" className="col-span-1 px-5 py-4 bg-neutral-light/40 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-primary/30 focus:bg-white transition-all shadow-sm h-12" />
                  <Input type="text" placeholder="Postal" className="col-span-1 px-5 py-4 bg-neutral-light/40 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-primary/30 focus:bg-white transition-all shadow-sm h-12" />
                  <Input type="text" placeholder="Country" className="col-span-1 px-5 py-4 bg-neutral-light/40 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-primary/30 focus:bg-white transition-all shadow-sm h-12" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
