import { useTranslations } from "next-intl";

export function PromoBar() {
  const t = useTranslations("home");
  return (
    <div className="bg-primary text-white text-center py-2 text-xs sm:text-sm font-medium tracking-wide">
      {t("promoText")}
    </div>
  );
}
