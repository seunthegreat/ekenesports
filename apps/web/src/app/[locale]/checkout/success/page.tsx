"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useOrderStore } from "@/lib/order-store";
import { COUNTRIES } from "@/lib/dhl-shipping";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package } from "lucide-react";

export default function CheckoutSuccessPage() {
  const t = useTranslations("checkout");
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const order = useOrderStore((s) => (orderNumber ? s.getOrder(orderNumber) : undefined));

  if (!order) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <CheckCircle className="w-16 h-16 mx-auto text-primary mb-6" />
        <h1 className="font-heading text-2xl md:text-3xl font-bold mb-3">
          {t("successTitle")}
        </h1>
        <p className="text-gray-500 mb-8">{t("successMessage")}</p>
        <Link href="/products">
          <Button size="lg">{t("backToShop")}</Button>
        </Link>
      </div>
    );
  }

  const countryName = COUNTRIES.find((c) => c.code === order.shippingAddress.country)?.name ?? order.shippingAddress.country;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <CheckCircle className="w-16 h-16 mx-auto text-primary mb-4" />
        <h1 className="font-heading text-2xl md:text-3xl font-bold mb-2">
          {t("successTitle")}
        </h1>
        <p className="text-gray-500">{t("successMessage")}</p>
      </div>

      <div className="bg-neutral-light rounded-lg p-6 space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">{t("orderNumber")}</p>
            <p className="font-mono font-semibold">{order.orderNumber}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">{t("waybill")}</p>
            <p className="font-mono font-semibold text-sm">{order.waybill}</p>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500">{t("estimatedArrival")}</p>
          <p className="text-sm font-medium">
            {t("estimatedDelivery", { min: order.shippingRate.estimatedDays.min, max: order.shippingRate.estimatedDays.max })} — {order.shippingRate.name}
          </p>
        </div>
      </div>

      {/* Shipping address */}
      <div className="bg-neutral-light rounded-lg p-6 mb-6">
        <p className="text-xs text-gray-500 mb-1">{t("shippingAddress")}</p>
        <p className="text-sm">
          {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
          {order.shippingAddress.street}{order.shippingAddress.apartment ? `, ${order.shippingAddress.apartment}` : ""}<br />
          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
          {countryName}
        </p>
      </div>

      {/* Items summary */}
      <div className="bg-neutral-light rounded-lg p-6 mb-6">
        <p className="text-xs text-gray-500 mb-3">{t("orderSummary")}</p>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.variantId} className="flex justify-between text-sm">
              <span>{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
              <span className="font-mono">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2 flex justify-between text-sm">
            <span>{t("shippingCost")}</span>
            <span className="font-mono">{order.shippingCost === 0 ? t("freeShipping") : formatPrice(order.shippingCost)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>{t("total")}</span>
            <span className="font-mono">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href={`/orders/track?waybill=${order.waybill}`} className="flex-1">
          <Button size="lg" className="w-full gap-2">
            <Package className="w-4 h-4" />
            {t("trackOrder")}
          </Button>
        </Link>
        <Link href="/products" className="flex-1">
          <Button variant="outline" size="lg" className="w-full">
            {t("backToShop")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
