"use client";

import { useState } from "react";
import { 
  ShieldCheck, 
  UserPlus, 
  Search, 
  MoreVertical, 
  Edit2, 
  UserMinus, 
  History, 
  Mail,
  Shield,
  BadgeCheck,
  Zap,
  Lock,
  X
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { ActionMenu } from "@/components/ui/action-menu";
import { DataTable } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";
import { useHotkeys } from "@/hooks/use-hotkeys";
import { toast } from "sonner";

const staff = [
  { id: "1", name: "Alexander Schmidt", email: "alex@ekenesport.com", role: "Super Admin", lastLogin: "2h ago", status: "Active" },
  { id: "2", name: "Elena Volkov", email: "elena.v@ekenesport.com", role: "Logistics Manager", lastLogin: "1d ago", status: "Active" },
  { id: "3", name: "Marcus Thorne", email: "m.thorne@ekenesport.com", role: "Catalog Editor", lastLogin: "3d ago", status: "Active" },
  { id: "4", name: "Sarah Jenkins", email: "s.jenkins@ekenesport.com", role: "Support Lead", lastLogin: "Never", status: "Invited" },
];

const roleColors: Record<string, { bg: string; text: string; icon: any }> = {
  "Super Admin": { bg: "bg-neutral-dark text-white", text: "text-white", icon: ShieldCheck },
  "Logistics Manager": { bg: "bg-indigo-50 text-indigo-600", text: "text-indigo-600", icon: Zap },
  "Catalog Editor": { bg: "bg-emerald-50 text-emerald-600", text: "text-emerald-600", icon: Shield },
  "Support Lead": { bg: "bg-amber-50 text-amber-600", text: "text-amber-600", icon: Shield },
};

export default function StaffSettings() {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [deleteStaff, setDeleteStaff] = useState<any>(null);
  const [inviteRole, setInviteRole] = useState("Staff Member");

  const handleInvite = () => {
    toast.success("Invitation dispatched successfully");
    setIsInviteOpen(false);
  };

  useHotkeys("s", () => {
    if (isInviteOpen) handleInvite();
  }, { ctrlOrCmd: true, preventDefault: true });

  const columns = [
    {
      header: "Administrative Identity",
      id: "name",
      sortable: true,
      accessor: (member: any) => (
        <div className="flex items-center gap-4 py-1">
          <div className="w-10 h-10 rounded-xl bg-neutral-light border border-gray-100 flex items-center justify-center font-heading font-bold text-xs text-primary shadow-sm hover:scale-105 transition-transform">
             {member.name.split(" ").map((n: string) => n[0]).join("")}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-neutral-dark truncate">{member.name}</h4>
            <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5 mt-1">
               <Mail size={12} className="text-gray-400" />
               {member.email}
            </span>
          </div>
        </div>
      ),
      className: "w-full"
    },
    {
      header: "Authorization Tier",
      id: "role",
      sortable: true,
      accessor: (member: any) => {
        const style = roleColors[member.role] || roleColors["Support Lead"];
        return (
          <div className={cn(
            "inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest whitespace-nowrap",
            style.bg
          )}>
            <style.icon size={12} className="shrink-0" />
            {member.role}
          </div>
        );
      },
      className: "w-0"
    },
    {
       header: "System Telemetry",
       accessor: (member: any) => (
         <div className="flex items-center gap-2 text-xs font-bold text-gray-500 whitespace-nowrap">
            <History size={14} className="text-gray-300" />
            Last Access: {member.lastLogin}
         </div>
       ),
       className: "w-0 px-8"
     },
     {
        header: "Logic Status",
        id: "status",
        sortable: true,
        accessor: (member: any) => (
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.2em]",
            member.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
          )}>
             <span className={cn("w-1.5 h-1.5 rounded-full inline-block", member.status === "Active" ? "bg-emerald-500" : "bg-amber-500")} />
             {member.status}
          </div>
        ),
        className: "w-0 px-8"
      },
      {
        header: "Actions",
        accessor: (member: any) => (
          <div className="flex items-center">
             <ActionMenu items={[
               { label: "Refine Permissions", icon: Edit2, onClick: () => setSelectedStaff(member) },
               { label: "Deactivate Identity", icon: UserMinus, variant: "danger", onClick: () => setDeleteStaff(member) },
             ]} />
          </div>
        ),
        className: "w-0"
      }
  ];

  return (
    <div className="space-y-6">
      
      {/* Staff Stats / Top Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-xl space-y-2">
          <h1 className="text-3xl lg:text-[40px] font-heading font-extrabold text-neutral-dark tracking-tight leading-none">
             Staff & <span className="text-primary">Intelligence</span>
          </h1>
          <p className="text-[15px] text-gray-500 font-medium leading-relaxed mt-2">
            Provision and manage administrative accounts with strict role-based access protocols.
          </p>
        </div>

        <Button 
           onClick={() => setIsInviteOpen(true)}
           className="flex items-center gap-2 px-6 py-2.5 bg-neutral-dark text-white font-bold rounded-xl text-xs hover:bg-neutral-dark/90 transition-all shadow-lg shadow-neutral-dark/10 whitespace-nowrap shrink-0 h-[36px]"
        >
           <UserPlus size={18} />
           Invite New Staff
        </Button>
      </div>

      <div className="h-px w-full bg-gray-100/60" />

      {/* Staff Table */}
      <section className="space-y-6 pt-2">
         <div className="flex items-center justify-between">
           <div className="relative flex-1 max-w-sm">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
             <Input 
               type="text" 
               placeholder="Search by name, email, or role..." 
               className="w-full pl-12 pr-5 py-4 bg-white border border-gray-100 rounded-2xl text-[13px] font-bold outline-none focus:border-primary/20 transition-all shadow-sm h-[44px]"
             />
           </div>
         </div>

         <DataTable 
           data={staff} 
           columns={columns} 
           className="border-gray-100/60 bg-white"
         />
      </section>

      {/* Invite Modal */}
      <Modal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        title="Provision Management Account"
        maxWidth="md"
        footer={(
           <div className="flex justify-end gap-3 w-full">
              <Button variant="ghost" onClick={() => setIsInviteOpen(false)} className="px-5 py-2 text-xs font-bold text-gray-400 hover:text-neutral-dark hover:bg-transparent transition-colors h-[36px]">
                Cancel
              </Button>
              <Button onClick={handleInvite} className="flex items-center gap-2 px-6 py-2.5 bg-neutral-dark text-white text-xs font-bold rounded-xl hover:bg-neutral-dark/90 transition-all shadow-lg shadow-neutral-dark/10 h-[36px]">
                 Send Invitation
              </Button>
           </div>
        )}
      >
        <div className="space-y-6 pt-2 pb-4">
           <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex gap-3 text-primary">
              <Zap className="mt-0.5 flex-shrink-0" size={16} />
              <p className="text-[11px] font-bold leading-relaxed tracking-tight">
                Staff members will receive a secure onboarding vector via their verified email channel. Accounts are restricted to view-only until validated.
              </p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                 <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1 block">Staff Candidate Name</label>
                 <Input type="text" placeholder="e.g. Johnathan Miller" className="w-full px-4 py-3 bg-neutral-light border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-primary/20 h-11" />
              </div>
              <div className="space-y-1.5">
                 <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1 block">Verified Email</label>
                 <Input type="email" placeholder="staff@ekenesport.com" className="w-full px-4 py-3 bg-neutral-light border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-primary/20 h-11" />
              </div>
           </div>
           
           <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1 block">Authorization Protocol</label>
              <Dropdown
                 options={[
                   { label: "Super Admin (Full Access)", value: "Super Admin" },
                   { label: "Logistics Manager (Rates & Zones)", value: "Logistics Manager" },
                   { label: "Catalog Editor (Products & Categories)", value: "Catalog Editor" },
                   { label: "Staff Member (View Only)", value: "Staff Member" },
                 ]}
                 value={inviteRole}
                 onChange={(val) => setInviteRole(val as string)}
                 fullWidth
                 variant="input"
              />
           </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteStaff}
        onClose={() => setDeleteStaff(null)}
        onConfirm={() => toast.success(`${deleteStaff?.name || 'Staff member'} has been deactivated`)}
        title="Deactivate Staff Identity"
        description={`Are you sure you want to revoke system access for ${deleteStaff?.name}? They will be immediately logged out and unable to access the control pane.`}
        confirmLabel="Deactivate"
      />
    </div>
  );
}
