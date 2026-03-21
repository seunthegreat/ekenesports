"use client";

import { use, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Euro,
  Clock,
  Calendar,
  BadgeCheck,
  ShieldAlert,
  ChevronRight,
  MoreVertical,
  Edit2,
  Trash2,
  Package,
  History,
  CreditCard,
  Copy,
  ExternalLink,
  Shield,
  Save,
  CheckCircle2,
  Camera,
  Plus,
  X
} from "lucide-react";
import { mockCustomers, mockOrders } from "@/lib/mock-data";
import { Customer, Order, Address } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { CustomerFormModal } from "../components/customer-form-modal";
import { BlockCustomerModal } from "../components/block-customer-modal";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";


export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations("Customers");
  const tOrders = useTranslations("Orders");
  const router = useRouter();

  const statusStyles = {
    active: { label: t("filters.active"), bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
    inactive: { label: t("filters.inactive"), bg: "bg-gray-50", text: "text-gray-400", dot: "bg-gray-300" },
    blocked: { label: t("filters.blocked"), bg: "bg-error/5", text: "text-error", dot: "bg-error" },
  };
  const { id } = use(params);

  const initialCustomer = useMemo(() =>
    mockCustomers.find(c => c.id === id) || mockCustomers[0]
    , [id]);

  const [customer, setCustomer] = useState<Customer>(initialCustomer);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const customerOrders = useMemo(() =>
    mockOrders.filter(o => o.shippingAddress.email === customer.email)
    , [customer]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };



  const orderColumns = [
    {
      header: t("table.order"),
      accessor: (order: Order) => (
        <span className="text-[11px] font-heading font-bold text-primary uppercase tracking-wider">{order.orderNumber}</span>
      ),
      className: "w-full"
    },
    {
      header: t("table.status_label"),
      accessor: (order: Order) => (
        <span className={cn(
          "inline-flex px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-widest",
          order.status === "delivered" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
        )}>
          {tOrders(`status.${order.status}`, { defaultValue: order.status })}
        </span>
      ),
      className: "w-0 whitespace-nowrap"
    },
    {
      header: t("table.amount"),
      accessor: (order: Order) => (
        <span className="text-sm font-bold text-neutral-dark font-mono">€{order.total.toFixed(2)}</span>
      ),
      className: "w-0 whitespace-nowrap"
    },
    {
      header: t("table.date"),
      accessor: (order: Order) => (
        <span className="text-[11px] text-gray-400 font-medium">
          {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      ),
      className: "w-0 whitespace-nowrap"
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 pt-2 px-4 md:px-0">
      {/* Header / Navigation */}
      <div className="flex flex-col gap-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary transition-colors group mb-1"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          {t("detail.back")}
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[28px] bg-neutral-light border border-gray-100 flex items-center justify-center text-primary overflow-hidden shadow-inner shrink-0 leading-none">
              {customer.avatar ? (
                <img src={customer.avatar} alt={customer.firstName} className="w-full h-full object-cover" />
              ) : (
                <User size={36} className="opacity-40" />
              )}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-heading font-bold text-neutral-dark tracking-tight leading-none">
                  {customer.firstName} {customer.lastName}
                </h1>
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest border transition-all",
                  statusStyles[customer.status].bg, statusStyles[customer.status].text, "border-transparent"
                )}>
                  <span className={cn("w-1.5 h-1.5 rounded-full", statusStyles[customer.status].dot)} />
                  {statusStyles[customer.status].label}
                </span>
              </div>
              <p className="text-sm text-gray-400 font-medium flex items-center gap-2">
                <Calendar size={14} className="opacity-50" />
                {t("detail.since", { date: new Date(customer.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) })}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2.5 px-6 py-3.5 border border-gray-100 bg-white text-gray-500 text-[11px] font-heading font-bold uppercase tracking-widest rounded-2xl hover:bg-neutral-light transition-all shadow-sm active:scale-95 transition-all text-neutral-dark"
            >
              <Edit2 size={16} />
              {t("detail.edit")}
            </button>
            <button className="flex items-center gap-2.5 px-6 py-3.5 bg-neutral-dark text-white text-[11px] font-heading font-bold uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-lg shadow-black/10 active:scale-95 transition-all">
              <Mail size={16} />
              {t("detail.send_email")}
            </button>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-gray-100/60" />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column: Stats & Order History */}
        <div className="lg:col-span-8 space-y-8">

          {/* Key Metrics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card padding="md" rounded="2xl" border="primary">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <ShoppingBag size={18} />
                </div>
                <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                  <ArrowLeft size={10} className="rotate-135" /> {t("stats.growth")}
                </span>
              </div>
              <h4 className="text-3xl font-heading font-bold text-neutral-dark leading-none">{customer.totalOrders}</h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 ml-0.5">{t("table.orders")}</p>
            </Card>

            <Card padding="md" rounded="2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                  <Euro size={18} />
                </div>
              </div>
              <h4 className="text-3xl font-heading font-bold text-neutral-dark leading-none">€{customer.totalSpend.toFixed(2)}</h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 ml-0.5">{t("table.spent")}</p>
            </Card>

            <Card padding="md" rounded="2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                  <CreditCard size={18} />
                </div>
              </div>
              <h4 className="text-3xl font-heading font-bold text-neutral-dark leading-none">€{(customer.totalSpend / customer.totalOrders || 0).toFixed(2)}</h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 ml-0.5">{t("detail.basket_size")}</p>
            </Card>
          </div>

          {/* Transactions Table */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[11px] font-heading font-bold text-neutral-dark/60 uppercase tracking-[0.2em]">{t("detail.ledger")}</h3>
              <button className="text-[10px] font-bold text-primary flex items-center gap-1.5 hover:underline uppercase tracking-widest">
                {t("detail.full_history")} <ExternalLink size={12} />
              </button>
            </div>
            <DataTable
              data={customerOrders}
              columns={orderColumns}
              onRowClick={(order) => router.push(`/orders/${order.id}`)}
              className="border-gray-100 shadow-sm"
            />
          </section>

          {/* Activity Log (UX Polish) */}
          <Card padding="md" rounded="2xl" className="bg-neutral-light/30 border-dashed border-2">
            <div className="flex flex-col items-center justify-center text-center py-10 space-y-5">
              <div className="w-14 h-14 bg-white rounded-full border border-gray-100 flex items-center justify-center text-gray-300 shadow-sm">
                <History size={24} />
              </div>
              <div className="max-w-[320px] space-y-1.5">
                <h4 className="text-[15px] font-bold text-neutral-dark">{t("detail.intel_tracking")}</h4>
                <p className="text-xs text-gray-400 leading-relaxed px-4">
                  {t("detail.intel_desc")}
                </p>
              </div>
              <button className="px-6 py-2.5 text-[10px] font-bold text-primary border border-primary/20 rounded-xl uppercase tracking-widest hover:bg-primary/5 transition-all shadow-sm bg-white">
                {t("detail.setup_auto")}
              </button>
            </div>
          </Card>
        </div>

        {/* Right Column: Contact & Addresses */}
        <div className="lg:col-span-4 space-y-8">

          {/* Contact Card */}
          <Card padding="md" rounded="2xl" className="space-y-8">
            <h3 className="text-[11px] font-heading font-bold text-neutral-dark/40 uppercase tracking-[0.2em] border-b border-gray-50 pb-5">{t("detail.relationship")}</h3>

            <div className="space-y-7">
              <div className="flex items-center gap-5">
                <div className="w-11 h-11 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shrink-0 border border-gray-100/50">
                  <Mail size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t("detail.primary_email")}</p>
                  <button
                    onClick={() => copyToClipboard(customer.email)}
                    className="text-sm font-bold text-neutral-dark hover:text-primary transition-colors flex items-center gap-2 group truncate w-full"
                  >
                    <span className="truncate">{customer.email}</span>
                    <Copy size={12} className="opacity-0 group-hover:opacity-100 shrink-0 text-gray-300" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="w-11 h-11 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shrink-0 border border-gray-100/50">
                  <Phone size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t("detail.mobile")}</p>
                  <p className="text-sm font-bold text-neutral-dark">{customer.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="w-11 h-11 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shrink-0 border border-gray-100/50">
                  <BadgeCheck size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t("detail.identity_check")}</p>
                  <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    {t("detail.id_protected")}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Address Book Card */}
          <Card padding="md" rounded="2xl" className="space-y-8 overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-50 pb-5 px-1">
              <h3 className="text-[11px] font-heading font-bold text-neutral-dark/40 uppercase tracking-[0.2em]">{t("detail.saved_addresses")}</h3>
              <span className="px-2.5 py-1 bg-gray-50 text-[10px] font-bold rounded-lg text-gray-400 border border-gray-100/50">{customer.addresses?.length || 0}</span>
            </div>

            <div className="space-y-5">
              {customer.addresses?.map((address, idx) => (
                <div key={idx} className="group p-6 bg-neutral-light/40 border border-gray-100/60 rounded-[20px] space-y-5 relative hover:border-primary/20 transition-all shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-300 shrink-0">
                      <MapPin size={16} />
                    </div>
                    <div className="text-[13px] font-medium text-neutral-dark leading-relaxed pt-1">
                      {address.street}, {address.apartment && `${address.apartment}, `}
                      <br />
                      <span className="font-bold text-neutral-dark">{address.city}, {address.postalCode}</span>
                      <br />
                      <span className="text-gray-400 font-bold uppercase text-[11px] tracking-wider">{address.country}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      copyToClipboard(`${address.street}, ${address.city}, ${address.country}`);
                    }}
                    className="w-full py-2.5 bg-white border border-gray-100 rounded-xl text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-primary hover:border-primary/20 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Copy size={12} />
                    {t("detail.quick_copy")}
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button className="w-full py-4 bg-gray-50/80 text-[10px] font-bold text-gray-400 rounded-2xl uppercase tracking-[0.2em] hover:bg-gray-100 hover:text-neutral-dark transition-all border border-gray-100/50 shadow-sm">
                {t("detail.manage_locations")}
              </button>
            </div>
          </Card>

          {/* Security Area */}
          <Card padding="md" rounded="2xl" className="border-error/10 bg-error/[0.01] space-y-6">
            <div className="flex items-center gap-3 text-error">
              <div className="w-9 h-9 bg-error/10 rounded-xl flex items-center justify-center">
                <ShieldAlert size={18} />
              </div>
              <h4 className="text-[11px] font-heading font-bold uppercase tracking-[0.2em]">{t("detail.risk_mgmt")}</h4>
            </div>
            <p className="text-[12px] text-gray-500 font-medium leading-[1.6]">
              {t("detail.risk_desc")}
            </p>
            <button
              onClick={() => setIsBlockModalOpen(true)}
              className="w-full py-3.5 bg-white border border-error/20 text-error text-[10px] font-bold rounded-xl uppercase tracking-widest hover:bg-error hover:text-white transition-all shadow-sm"
            >
              {customer.status === "blocked" ? t("block.confirm_unblock") : t("block.confirm")}
            </button>
          </Card>
        </div>
      </div>

      <CustomerFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        customer={customer}
        onSave={(data) => {
          setCustomer(prev => ({ ...prev, ...data }));
          setIsEditModalOpen(false);
        }}
      />

      <BlockCustomerModal
        customer={customer}
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        onConfirm={(customer) => {
          const newStatus = customer.status === "blocked" ? "active" : "blocked";
          setCustomer(prev => ({ ...prev, status: newStatus }));
          setIsBlockModalOpen(false);
        }}
      />
    </div>
  );
}
