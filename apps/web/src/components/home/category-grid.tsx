import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { categories } from "@/lib/data";
import Image from "next/image";

export function CategoryGrid() {
  const t = useTranslations("home");

  // Show only root categories, limited to 6
  const rootCategories = categories
    .filter((c) => c.parentId === null)
    .slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
      <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-dark mb-8">
        {t("categoriesTitle")}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {rootCategories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="group relative aspect-[4/3] overflow-hidden"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <h3 className="text-white font-heading font-bold text-lg md:text-xl">{cat.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
