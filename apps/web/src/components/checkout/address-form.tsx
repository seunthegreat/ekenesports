"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCheckoutStore } from "@/lib/checkout-store";
import { ShippingAddress } from "@/lib/types";
import { COUNTRIES } from "@/lib/dhl-shipping";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function AddressForm() {
  const t = useTranslations("checkout");
  const existingAddress = useCheckoutStore((s) => s.address);
  const setAddress = useCheckoutStore((s) => s.setAddress);

  const [form, setForm] = useState<ShippingAddress>(
    existingAddress ?? {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      street: "",
      apartment: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    }
  );
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress, boolean>>>({});

  function update(field: keyof ShippingAddress, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: false }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const required: (keyof ShippingAddress)[] = ["firstName", "lastName", "email", "phone", "street", "city", "state", "postalCode", "country"];
    const newErrors: Partial<Record<keyof ShippingAddress, boolean>> = {};
    for (const field of required) {
      if (!form[field]?.trim()) newErrors[field] = true;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = true;
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setAddress(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">{t("firstName")}</label>
          <Input value={form.firstName} onChange={(e) => update("firstName", e.target.value)} error={errors.firstName} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">{t("lastName")}</label>
          <Input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} error={errors.lastName} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">{t("email")}</label>
        <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} error={errors.email} />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">{t("phone")}</label>
        <Input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} error={errors.phone} />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">{t("country")}</label>
        <Select value={form.country} onChange={(e) => update("country", e.target.value)} error={errors.country}>
          <option value="">{t("selectCountry")}</option>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </Select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">{t("street")}</label>
        <Input value={form.street} onChange={(e) => update("street", e.target.value)} error={errors.street} />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">{t("apartment")}</label>
        <Input value={form.apartment ?? ""} onChange={(e) => update("apartment", e.target.value)} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">{t("city")}</label>
          <Input value={form.city} onChange={(e) => update("city", e.target.value)} error={errors.city} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">{t("state")}</label>
          <Input value={form.state} onChange={(e) => update("state", e.target.value)} error={errors.state} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">{t("postalCode")}</label>
          <Input value={form.postalCode} onChange={(e) => update("postalCode", e.target.value)} error={errors.postalCode} />
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full mt-6">
        {t("continueToShipping")}
      </Button>
    </form>
  );
}
