import { HeroBanner } from "@/components/home/hero-banner";
import { SportSelector } from "@/components/home/sport-selector";
import { FeaturedProducts } from "@/components/home/featured-products";
import { CategoryGrid } from "@/components/home/category-grid";
import { NewArrivals } from "@/components/home/new-arrivals";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <SportSelector />
      <FeaturedProducts />
      <CategoryGrid />
      <NewArrivals />
    </>
  );
}
