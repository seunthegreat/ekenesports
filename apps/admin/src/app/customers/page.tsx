"use client";

import { useState, useMemo, useRef } from "react";
import {
  UserPlus,
  Search,
  Filter,
  User,
  Edit2,
  Lock,
  Eye,
  Trash2,
  X,
  Check,
  Download
} from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { mockCustomers } from "@/lib/mock-data";
import { Customer } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/ui/data-table";
import { ActionMenu } from "@/components/ui/action-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

// Local Components
import { CustomerFormModal } from "./components/customer-form-modal";
import { CustomerStats } from "./components/customer-stats";
import { DeleteCustomerModal } from "./components/delete-customer-modal";
import { BlockCustomerModal } from "./components/block-customer-modal";
import Link from "next/link";

const statusStyles = {
  active: { label: "Active", bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
  inactive: { label: "Inactive", bg: "bg-gray-50", text: "text-gray-400", dot: "bg-gray-300" },
  blocked: { label: "Blocked", bg: "bg-error/5", text: "text-error", dot: "bg-error" },
};

function CustomerHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
      <div className="max-w-xl space-y-2">
        <h1 className="text-3xl lg:text-[40px] font-heading font-extrabold text-neutral-dark tracking-tight leading-none">
          Customer Directory
        </h1>
        <p className="text-[15px] text-gray-500 font-medium leading-relaxed mt-2">
          Manage your customer base, analyze engagement, and personalize your outreach efforts.
        </p>
      </div>
      <div className="flex gap-3">
        <Link
          href="/customers/new"
          onClick={(e) => { e.preventDefault(); onAdd(); }}
          className="flex items-center gap-2 px-6 py-2 bg-neutral-dark text-white font-bold rounded-lg text-xs hover:bg-neutral-dark/90 transition-all shadow-lg shadow-neutral-dark/10"
        >
          <UserPlus size={18} />
          Add New Customer
        </Link>
      </div>
    </div>
  );
}

export default function CustomersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const currentStatus = searchParams.get("status") || "all";
  const currentSegment = searchParams.get("segment") || "all";

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
      header: "Customer",
      accessor: (customer: Customer) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-neutral-light border border-gray-100 flex items-center justify-center text-primary overflow-hidden shrink-0">
            {customer.avatar ? (
              <img src={customer.avatar} alt={customer.firstName} className="w-full h-full object-cover" />
            ) : (
              <User size={18} />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-neutral-dark">{customer.firstName} {customer.lastName}</span>
            <span className="text-[11px] text-gray-400 font-medium">{customer.email}</span>
          </div>
        </div>
      ),
      className: "w-full"
    },
    {
      header: "Status",
      accessor: (customer: Customer) => {
        const style = statusStyles[customer.status];
        return (
          <span className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-extrabold rounded-full uppercase tracking-widest border border-transparent transition-all",
            style.bg, style.text
          )}>
            <span className={cn("w-1.5 h-1.5 rounded-full", style.dot)} />
            {style.label}
          </span>
        );
      },
      className: "w-0 whitespace-nowrap"
    },
    {
      header: "Orders",
      accessor: (customer: Customer) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-neutral-dark">{customer.totalOrders}</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Total Orders</span>
        </div>
      ),
      className: "w-0 whitespace-nowrap"
    },
    {
      header: "Total Spend",
      accessor: (customer: Customer) => (
        <div className="flex flex-col">
          <span className="text-sm font-extrabold text-neutral-dark font-mono">€{customer.totalSpend.toFixed(2)}</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Lifetime Value</span>
        </div>
      ),
      className: "w-0 whitespace-nowrap"
    },
    {
      header: "Actions",
      accessor: (customer: Customer) => (
        <div className="flex items-center">
          <ActionMenu items={[
            {
              label: "View Profile",
              icon: Eye,
              onClick: () => router.push(`/customers/${customer.id}`)
            },
            {
              label: "Edit Info",
              icon: Edit2,
              onClick: () => handleOpenEdit(customer)
            },
            {
              label: customer.status === "blocked" ? "Unblock" : "Block User",
              icon: Lock,
              onClick: () => setBlockCustomer(customer),
              variant: customer.status === "blocked" ? undefined : "danger"
            },
            {
              label: "Delete",
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
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <Input
              placeholder="Search by name, email or mobile..."
              className="pl-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Download size={16} />
              Export
            </Button>
            <div className="relative" ref={filterRef}>
              <Button
                variant={isFilterOpen ? "default" : "outline"}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                size="sm"
              >
                <Filter size={16} />
                Filters
              </Button>

              {isFilterOpen && (
                <div className="absolute top-full right-0 mt-3 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[60] p-6 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[11px] font-heading font-extrabold text-[#1A1A2E]/60 uppercase tracking-widest">Filter Customers</h3>
                    <button onClick={() => setIsFilterOpen(false)}><X size={14} className="text-gray-300" /></button>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1 block">Status</label>
                      <Select
                        value={currentStatus}
                        onChange={(e) => updateFilter("status", e.target.value)}
                      >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="blocked">Blocked</option>
                      </Select>
                    </div>

                    {(currentStatus !== "all") && (
                      <button
                        onClick={clearFilters}
                        className="w-full mt-2 py-2 text-xs font-bold text-gray-400 hover:text-error transition-colors font-heading uppercase tracking-widest"
                      >
                        Clear All Filters
                      </button>
                    )}
                  </div>
                </div>
              )}
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
