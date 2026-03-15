import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-neutral-dark text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Image src="/logo.svg" alt="Ekene Sport" width={120} height={36} className="brightness-0 invert mb-4" />
            <p className="text-sm text-gray-400 leading-relaxed">{t("aboutText")}</p>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-heading font-bold text-sm mb-4">{t("customerService")}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-white transition-colors">{t("contact")}</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">{t("shipping")}</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">{t("faq")}</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">{t("sizeGuide")}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-heading font-bold text-sm mb-4">{t("company")}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-white transition-colors">{t("aboutUs")}</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">{t("careers")}</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">{t("press")}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-heading font-bold text-sm mb-4">{t("legal")}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-white transition-colors">{t("privacy")}</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">{t("terms")}</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">{t("imprint")}</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-10 pt-8 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-bold text-sm">{t("newsletter")}</h3>
              <p className="text-sm text-gray-400 mt-1">{t("newsletterText")}</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder={t("emailPlaceholder")}
                className="flex-1 sm:w-64 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              />
              <button className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-light transition-colors">
                {t("subscribe")}
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-sm text-gray-500">
          {t("copyright", { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}
