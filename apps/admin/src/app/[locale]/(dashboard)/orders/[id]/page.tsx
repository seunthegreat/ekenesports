"use client";

import { useState, useMemo, use } from "react";
import { useRouter } from "@/i18n/routing";
import {
  ChevronLeft,
  Printer,
  Truck,
} from "lucide-react";
import { mockOrders } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { OrderItemsCard } from "@/components/orders/order-items-card";
import { OrderPaymentCard } from "@/components/orders/order-payment-card";
import { OrderShippingCard } from "@/components/orders/order-shipping-card";
import { OrderCustomerCard } from "@/components/orders/order-customer-card";
import { OrderTimeline } from "@/components/orders/order-timeline";
import { FulfillmentModal } from "@/components/orders/fulfillment-modal";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations("Orders");
  const router = useRouter();
  const { id } = use(params);
  const [isFulfilling, setIsFulfilling] = useState(false);

  const statusStyles: Record<string, { label: string; bg: string; text: string; dot: string }> = {
    confirmed:        { label: t("status.confirmed"),  bg: "bg-primary/5",    text: "text-primary",       dot: "bg-primary"       },
    processing:       { label: t("status.processing"), bg: "bg-secondary/10",  text: "text-secondary",     dot: "bg-secondary"     },
    shipped:          { label: t("status.shipped"),    bg: "bg-primary/5",    text: "text-primary",       dot: "bg-primary"       },
    delivered:        { label: t("status.delivered"),  bg: "bg-primary/10",   text: "text-primary-light", dot: "bg-primary-light"  },
    cancelled:        { label: t("status.cancelled"),  bg: "bg-error/5",      text: "text-error",         dot: "bg-error"         },
    refunded:         { label: t("status.refunded"),   bg: "bg-gray-50",      text: "text-gray-500",      dot: "bg-gray-300"      },
  };

  const order = useMemo(() => mockOrders.find(o => o.id === id) || mockOrders[0], [id]);

  const status = statusStyles[order.status] || statusStyles.confirmed;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-20 pt-2 font-body">
      {/* breadcrumb & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary transition-colors group mb-1"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            {t("detail.back")}
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl lg:text-[40px] font-heading font-bold text-neutral-dark tracking-tight leading-none">
              {t("detail.order_title", { orderNumber: order.orderNumber })}
            </h1>
            <span className={cn(
              "px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest border",
              status.bg, status.text, "border-transparent"
            )}>
              <span className={cn("w-1.5 h-1.5 rounded-full inline-block mr-1.5", status.dot)} />
              {status.label}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span className="font-medium">
              {t("detail.placed_at", {
                date: new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
                time: "14:32"
              })}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-200" />
            <span className="font-bold text-gray-500">{t("detail.items_total", { count: 2 })}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Printer size={16} />
            {t("detail.invoicing")}
          </Button>
          <Button variant="default" size="sm" className="gap-2" onClick={() => setIsFulfilling(true)}>
            <Truck size={16} />
            {t("detail.fulfill_order")}
          </Button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Items & Payment */}
        <div className="lg:col-span-2 space-y-8">
          <OrderItemsCard order={order} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OrderPaymentCard />
            <OrderShippingCard order={order} />
          </div>
        </div>

        {/* Right Col: Customer & Timeline */}
        <div className="space-y-8">
          <OrderCustomerCard order={order} />
          <OrderTimeline />
        </div>
      </div>

      {/* Fulfillment Modal */}
      <FulfillmentModal
        isOpen={isFulfilling}
        onClose={() => setIsFulfilling(false)}
      />
    </div>
  );
}
