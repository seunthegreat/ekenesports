"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  ShieldCheck,
  UserPlus,
  Search,
  Edit2,
  UserMinus,
  History,
  Mail,
  Shield,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { ActionMenu } from "@/components/ui/action-menu";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";
import { useHotkeys } from "@/hooks/use-hotkeys";
import { toast } from "sonner";
import { StaffInviteModal } from "@/components/settings/staff-invite-modal";

const staff = [
  { id: "1", name: "Alexander Schmidt", email: "alex@ekenesport.com", role: "super_admin", lastLogin: "2h ago", status: "active" },
  { id: "2", name: "Elena Volkov", email: "elena.v@ekenesport.com", role: "logistics_manager", lastLogin: "1d ago", status: "active" },
  { id: "3", name: "Marcus Thorne", email: "m.thorne@ekenesport.com", role: "catalog_editor", lastLogin: "3d ago", status: "active" },
  { id: "4", name: "Sarah Jenkins", email: "s.jenkins@ekenesport.com", role: "support_lead", lastLogin: "Never", status: "invited" },
];

const roleColors: Record<string, { bg: string; text: string; icon: any }> = {
  "super_admin": { bg: "bg-neutral-dark text-white", text: "text-white", icon: ShieldCheck },
  "logistics_manager": { bg: "bg-indigo-50 text-indigo-600", text: "text-indigo-600", icon: Zap },
  "catalog_editor": { bg: "bg-emerald-50 text-emerald-600", text: "text-emerald-600", icon: Shield },
  "support_lead": { bg: "bg-amber-50 text-amber-600", text: "text-amber-600", icon: Shield },
};

export default function StaffSettings() {
  const t = useTranslations("Staff");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [deleteStaff, setDeleteStaff] = useState<any>(null);
  const [search, setSearch] = useState("");

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(search.toLowerCase()) ||
    member.email.toLowerCase().includes(search.toLowerCase()) ||
    t(`roles.${member.role}`).toLowerCase().includes(search.toLowerCase())
  );

  const handleInvite = (data: any) => {
    console.log("Inviting staff member:", data);
    toast.success(t("toast.invite_success"));
    setIsInviteOpen(false);
  };

  useHotkeys("s", () => {
    // Save behavior could be defined here or inside components
  }, { ctrlOrCmd: true, preventDefault: true });

  const columns = [
    {
      header: t("table.identity"),
      id: "name",
      sortable: true,
      accessor: (member: any) => (
        <div className="flex items-center gap-4 py-1">
          <div className="w-10 h-10 rounded-xl bg-neutral-light border border-gray-100 flex items-center justify-center font-heading font-bold text-xs text-primary shadow-sm">
            {member.name.split(" ").map((n: string) => n[0]).join("")}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-neutral-dark truncate">{member.name}</h4>
            <span className="text-[10px] text-gray-400 font-normal uppercase tracking-tight flex items-center gap-1.5 mt-1">
              <Mail size={12} className="text-gray-300" />
              {member.email}
            </span>
          </div>
        </div>
      ),
      className: "w-full"
    },
    {
      header: t("table.tier"),
      id: "role",
      sortable: true,
      accessor: (member: any) => {
        const style = roleColors[member.role] || roleColors["support_lead"];
        return (
          <div className={cn(
            "inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest whitespace-nowrap",
            style.bg
          )}>
            <style.icon size={12} className="shrink-0" />
            {t(`roles.${member.role}`)}
          </div>
        );
      },
      className: "w-0"
    },
    {
      header: t("table.telemetry"),
      accessor: (member: any) => (
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 whitespace-nowrap">
          <History size={14} className="text-gray-300" />
          {t("table.last_access", { time: member.lastLogin })}
        </div>
      ),
      className: "w-0 px-8"
    },
    {
      header: t("table.status"),
      id: "status",
      sortable: true,
      accessor: (member: any) => (
        <div className={cn(
          "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]",
          member.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
        )}>
          <span className={cn("w-1.5 h-1.5 rounded-full inline-block", member.status === "active" ? "bg-emerald-500" : "bg-amber-500")} />
          {t(`status.${member.status}`)}
        </div>
      ),
      className: "w-0 px-8"
    },
    {
      header: t("table.actions"),
      accessor: (member: any) => (
        <div className="flex items-center">
          <ActionMenu items={[
            { label: t("table.action_refine"), icon: Edit2, onClick: () => setSelectedStaff(member) },
            { label: t("table.action_deactivate"), icon: UserMinus, variant: "danger", onClick: () => setDeleteStaff(member) },
          ]} />
        </div>
      ),
      className: "w-0"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Content Header */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck size={18} />
            <h2 className="text-sm font-heading font-bold text-neutral-dark tracking-tight uppercase tracking-widest">{t("title")}</h2>
          </div>
          <Button variant="default" size="sm" className="gap-2" onClick={() => setIsInviteOpen(true)}>
            <UserPlus size={16} />
            {t("invite")}
          </Button>
        </div>

        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex gap-4 text-primary">
          <ShieldCheck className="mt-0.5 flex-shrink-0" size={16} />
          <p className="text-xs font-bold leading-relaxed tracking-tight">
            {t("desc")}
          </p>
        </div>
      </section>

      {/* Staff Table */}
      <section className="space-y-6 pt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <Input
              placeholder={t("search")}
              className="pl-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <DataTable
          data={filteredStaff}
          columns={columns}
          className="border-gray-100/60 shadow-sm"
        />
      </section>

      {/* Invite Modal */}
      <StaffInviteModal 
        isOpen={isInviteOpen} 
        onClose={() => setIsInviteOpen(false)} 
        onInvite={handleInvite} 
      />

      <ConfirmDialog
        isOpen={!!deleteStaff}
        onClose={() => setDeleteStaff(null)}
        onConfirm={() => toast.success(t("toast.deactivate_success", { name: deleteStaff?.name || 'Staff member' }))}
        title={t("delete_modal.title")}
        description={t("delete_modal.desc", { name: deleteStaff?.name })}
        confirmLabel={t("delete_modal.confirm")}
      />
    </div>
  );
}
