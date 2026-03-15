"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useOrderStore } from "@/lib/order-store";
import { generateMockTimeline, COUNTRIES } from "@/lib/dhl-shipping";
import { formatPrice } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Package, MapPin, CheckCircle2 } from "lucide-react";

export default function TrackingPage() {
  const t = useTranslations("tracking");
  const tCheckout = useTranslations("checkout");
  const searchParams = useSearchParams();
  const initialWaybill = searchParams.get("waybill") ?? "";
  const [waybillInput, setWaybillInput] = useState(initialWaybill);
  const [searchWaybill, setSearchWaybill] = useState(initialWaybill);

  const order = useOrderStore((s) => (searchWaybill ? s.getOrderByWaybill(searchWaybill) : undefined));
  const timeline = order ? generateMockTimeline(order) : [];
  const currentStatus = timeline.findLast((e) => e.completed);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchWaybill(waybillInput.trim());
  }

  const statusLabels: Record<string, string> = {
    confirmed: t("statusConfirmed"),
    processing: t("statusProcessing"),
    shipped: t("statusShipped"),
    in_transit: t("statusInTransit"),
    out_for_delivery: t("statusOutForDelivery"),
    delivered: t("statusDelivered"),
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-heading text-2xl md:text-3xl font-bold mb-6">{t("title")}</h1>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-10">
        <Input
          value={waybillInput}
          onChange={(e) => setWaybillInput(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="flex-1"
        />
        <Button type="submit" size="default" className="gap-2">
          <Search className="w-4 h-4" />
          {t("search")}
        </Button>
      </form>

      {searchWaybill && !order && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="font-heading text-xl font-bold mb-2">{t("notFound")}</h2>
          <p className="text-gray-500 text-sm">{t("notFoundMessage")}</p>
        </div>
      )}

      {order && (
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-neutral-light rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-gray-500">{tCheckout("waybill")}</p>
                <p className="font-mono font-semibold">{order.waybill}</p>
              </div>
              {currentStatus && (
                <Badge variant={currentStatus.status === "delivered" ? "default" : "sale"}>
                  {statusLabels[currentStatus.status]}
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-500">{tCheckout("orderNumber")}</p>
                <p className="font-mono">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{tCheckout("estimatedArrival")}</p>
                <p>{tCheckout("estimatedDelivery", { min: order.shippingRate.estimatedDays.min, max: order.shippingRate.estimatedDays.max })}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h2 className="font-semibold mb-4">{t("shipmentDetails")}</h2>
            <div className="relative pl-8">
              {/* Vertical line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-200" />

              {timeline.map((event, index) => {
                const isLast = index === timeline.length - 1;
                const isCurrent = event.completed && (isLast || !timeline[index + 1]?.completed);

                return (
                  <div key={event.status} className="relative pb-6 last:pb-0">
                    {/* Dot */}
                    <div
                      className={`absolute -left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center ${
                        event.completed
                          ? isCurrent
                            ? "bg-primary text-white ring-4 ring-primary/20"
                            : "bg-primary text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {event.completed ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                      )}
                    </div>

                    <div>
                      <p className={`text-sm font-semibold ${event.completed ? "text-neutral-dark" : "text-gray-400"}`}>
                        {statusLabels[event.status]}
                      </p>
                      <p className={`text-xs mt-0.5 ${event.completed ? "text-gray-600" : "text-gray-400"}`}>
                        {event.description}
                      </p>
                      {event.completed && (
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                          <span>{new Date(event.timestamp).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                          {event.location && (
                            <span className="flex items-center gap-0.5">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order details */}
          <div>
            <h2 className="font-semibold mb-3">{t("orderDetails")}</h2>
            <div className="bg-neutral-light rounded-lg p-5 space-y-2">
              {order.items.map((item) => (
                <div key={item.variantId} className="flex justify-between text-sm">
                  <span>{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                  <span className="font-mono">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-semibold text-sm">
                <span>{tCheckout("total")}</span>
                <span className="font-mono">{formatPrice(order.total)}</span>
              </div>
              <div className="text-xs text-gray-500 pt-1">
                <p>
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}, {order.shippingAddress.city},{" "}
                  {COUNTRIES.find((c) => c.code === order.shippingAddress.country)?.name ?? order.shippingAddress.country}
                </p>
              </div>
            </div>
          </div>

          <Link href="/products">
            <Button variant="outline" className="w-full">{tCheckout("backToShop")}</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
