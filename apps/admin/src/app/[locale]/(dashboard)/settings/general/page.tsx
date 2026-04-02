"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useHotkeys } from "@/hooks/use-hotkeys";
import { toast } from "sonner";
import { StoreIdentityCard } from "@/components/settings/store-identity-card";
import { FinanceSettingsCard } from "@/components/settings/finance-settings-card";
import { MarketingSettingsCard } from "@/components/settings/marketing-settings-card";
import { SaveSettingsBar } from "@/components/settings/save-settings-bar";

export default function GeneralSettings() {
  const t = useTranslations("General");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      toast.success(t("toast.save_success"), { description: t("toast.save_desc") });
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  useHotkeys("s", handleSave, { ctrlOrCmd: true, preventDefault: true });

  return (
    <div className="space-y-6">
      <StoreIdentityCard />
      <FinanceSettingsCard />
      <MarketingSettingsCard />

      <SaveSettingsBar 
        isSaving={isSaving} 
        showSuccess={showSuccess} 
        onSave={handleSave} 
      />
    </div>
  );
}
