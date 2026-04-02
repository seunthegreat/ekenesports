"use client";

import { use, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { mockCustomers, mockOrders } from "@/lib/mock-data";
import { Customer } from "@/lib/types";
import { CustomerFormModal } from "@/components/customers/customer-form-modal";
import { BlockCustomerModal } from "@/components/customers/block-customer-modal";
import { CustomerDetailHeader } from "@/components/customers/customer-detail-header";
import { CustomerKeyMetrics } from "@/components/customers/customer-key-metrics";
import { CustomerOrdersTable } from "@/components/customers/customer-orders-table";
import { CustomerIntelCard } from "@/components/customers/customer-intel-card";
import { CustomerContactCard } from "@/components/customers/customer-contact-card";
import { CustomerAddressBookCard } from "@/components/customers/customer-address-book-card";
import { CustomerSecurityCard } from "@/components/customers/customer-security-card";

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const initialCustomer = useMemo(() =>
    mockCustomers.find(c => c.id === id) || mockCustomers[0]
    , [id]);

  const [customer, setCustomer] = useState<Customer>(initialCustomer);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  const customerOrders = useMemo(() =>
    mockOrders.filter(o => o.shippingAddress.email === customer.email)
    , [customer]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 pt-2 px-4 md:px-0">
      {/* Header / Navigation */}
      <CustomerDetailHeader 
        customer={customer} 
        onEdit={() => setIsEditModalOpen(true)} 
      />

      <div className="h-px w-full bg-gray-100/60" />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column: Stats & Order History */}
        <div className="lg:col-span-8 space-y-8">
          <CustomerKeyMetrics customer={customer} />
          
          <CustomerOrdersTable orders={customerOrders} />

          <CustomerIntelCard />
        </div>

        {/* Right Column: Contact & Addresses */}
        <div className="lg:col-span-4 space-y-8">
          <CustomerContactCard customer={customer} />

          <CustomerAddressBookCard customer={customer} />

          <CustomerSecurityCard 
            customer={customer} 
            onBlock={() => setIsBlockModalOpen(true)} 
          />
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
