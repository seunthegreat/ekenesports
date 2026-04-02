"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Filter,
  User,
  Edit2,
  Lock,
  Eye,
  Trash2,
  Download
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { mockCustomers } from "@/lib/mock-data";
import { Customer } from "@/lib/types";
import { DataTable } from "@/components/ui/data-table";
import { ActionMenu } from "@/components/ui/action-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/badge";

// Centralized Components
import { CustomerFormModal } from "@/components/customers/customer-form-modal";
import { CustomerStats } from "@/components/customers/customer-stats";
import { DeleteCustomerModal } from "@/components/customers/delete-customer-modal";
import { BlockCustomerModal } from "@/components/customers/block-customer-modal";
import { CustomerHeader } from "@/components/customers/customer-header";
import { CustomerFilter } from "@/components/customers/customer-filter";

export default function CustomersPage() {
  const t = useTranslations("Customers");
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const statusStyles = {
    active: { label: t("filters.active"), bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
    inactive: { label: t("filters.inactive"), bg: "bg-gray-50", text: "text-gray-400", dot: "bg-gray-300" },
    blocked: { label: t("filters.blocked"), bg: "bg-error/5", text: "text-error", dot: "bg-error" },
  };

  const currentStatus = searchParams.get("status") || "all";

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    if (isFilterOpen) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isFilterOpen]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("status");
    params.delete("segment");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  // Modal States
  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null);
  const [blockCustomer, setBlockCustomer] = useState<Customer | null>(null);
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredCustomers = useMemo(() => {
    return mockCustomers.filter(c => {
      const matchSearch = !search ||
        c.firstName.toLowerCase().includes(search.toLowerCase()) ||
        c.lastName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search);

      const matchStatus = currentStatus === "all" || c.status === currentStatus;

      return matchSearch && matchStatus;
    });
  }, [search, currentStatus]);

  const handleOpenEdit = (customer: Customer) => {
    setIsAdding(false);
    setActiveCustomer(customer);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setIsAdding(true);
    setActiveCustomer(null);
    setIsModalOpen(true);
  };

  const handleSave = (data: Partial<Customer>) => {
    // Logic would update local state here
    console.log("Saving customer data:", data);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = (customer: Customer) => {
    setDeleteCustomer(null);
    console.log("Deleted customer:", customer.id);
  };

  const columns = [
    {
      header: t("table.name"),
      accessor: (customer: Customer) => (
        <div className="flex items-center gap-4 py-1">
          <div className="w-10 h-10 rounded-xl bg-neutral-light border border-gray-100 flex items-center justify-center text-primary overflow-hidden shrink-0 shadow-sm">
            {customer.avatar ? (
              <img src={customer.avatar} alt={customer.firstName} className="w-full h-full object-cover" />
            ) : (
              <User size={18} />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-neutral-dark">{customer.firstName} {customer.lastName}</span>
            <span className="text-xs text-gray-400 font-medium uppercase">{customer.email}</span>
          </div>
        </div>
      ),
      className: "w-full"
    },
    {
      header: t("table.status"),
      accessor: (customer: Customer) => {
        const style = statusStyles[customer.status as keyof typeof statusStyles];
        return style ? (
          <StatusBadge
            label={style.label}
            bg={style.bg}
            text={style.text}
            dot={style.dot}
          />
        ) : null;
      },
      className: "w-0 whitespace-nowrap"
    },
    {
      header: t("table.orders"),
      accessor: (customer: Customer) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-neutral-dark">{customer.totalOrders}</span>
          <span className="text-xs text-gray-400 font-medium uppercase">{t("table.orders")}</span>
        </div>
      ),
      className: "w-0 whitespace-nowrap"
    },
    {
      header: t("table.spent"),
      accessor: (customer: Customer) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-neutral-dark font-mono">€{customer.totalSpend.toFixed(2)}</span>
          <span className="text-xs text-gray-400 font-medium uppercase">{t("table.spent")}</span>
        </div>
      ),
      className: "w-0 whitespace-nowrap"
    },
    {
      header: t("table.actions"),
      accessor: (customer: Customer) => (
        <div className="flex items-center">
          <ActionMenu items={[
            {
              label: t("table.view_profile") || "View Profile",
              icon: Eye,
              onClick: () => router.push(`/customers/${customer.id}`)
            },
            {
              label: t("table.edit_info") || "Edit Info",
              icon: Edit2,
              onClick: () => handleOpenEdit(customer)
            },
            {
              label: customer.status === "blocked" ? t("block.title_unblock") : t("block.confirm"),
              icon: Lock,
              onClick: () => setBlockCustomer(customer),
              variant: customer.status === "blocked" ? undefined : "danger"
            },
            {
              label: t("table.delete") || "Delete",
              icon: Trash2,
              onClick: () => setDeleteCustomer(customer),
              variant: "danger"
            }
          ]} />
        </div>
      ),
      className: "w-0 whitespace-nowrap"
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20 pt-2 px-4 md:px-0">
      <CustomerHeader onAdd={handleOpenAdd} />

      <div className="h-px w-full bg-gray-100/60" />

      <CustomerStats />

      {/* Main Table Section */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-full md:max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <Input
              placeholder={t("search")}
              className="pl-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="flex-1 md:flex-none">
              <Download size={16} />
              {t("export")}
            </Button>
            <div className="relative flex-1 md:flex-none" ref={filterRef}>
              <Button
                variant={isFilterOpen ? "default" : "outline"}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                size="sm"
                className="w-full"
              >
                <Filter size={16} />
                {t("filters.title")}
              </Button>

              <CustomerFilter
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                currentStatus={currentStatus}
                onUpdate={updateFilter}
                onClear={clearFilters}
              />
            </div>
          </div>
        </div>

        <DataTable
          data={filteredCustomers}
          columns={columns}
          onRowClick={(customer) => router.push(`/customers/${customer.id}`)}
          className="border-gray-100/60 shadow-sm"
        />
      </section>

      {/* Modals */}
      <CustomerFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={activeCustomer}
        isAdding={isAdding}
        onSave={handleSave}
      />

      <DeleteCustomerModal
        customer={deleteCustomer}
        onClose={() => setDeleteCustomer(null)}
        onConfirm={handleConfirmDelete}
      />

      <BlockCustomerModal
        customer={blockCustomer}
        isOpen={!!blockCustomer}
        onClose={() => setBlockCustomer(null)}
        onConfirm={(customer) => {
          console.log("Blocking user:", customer.id);
          setBlockCustomer(null);
        }}
      />
    </div>
  );
}
