import { Sport, Category, Product, Variant, ProductImage, Facets, FacetCount, FilterState } from "./types";

// ─── Sports ────────────────────────────────────────────────────────────────
export const sports: Sport[] = [
  { id: "s1", name: "Football", slug: "football", icon: "⚽", image: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&h=400&fit=crop" },
  { id: "s2", name: "Basketball", slug: "basketball", icon: "🏀", image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop" },
  { id: "s3", name: "Running", slug: "running", icon: "🏃", image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&h=400&fit=crop" },
  { id: "s4", name: "Gym & Training", slug: "gym-training", icon: "🏋️", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop" },
  { id: "s5", name: "Tennis", slug: "tennis", icon: "🎾", image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop" },
  { id: "s6", name: "Swimming", slug: "swimming", icon: "🏊", image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&h=400&fit=crop" },
  { id: "s7", name: "Accessories", slug: "accessories", icon: "🎒", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop" },
];

// ─── Categories ────────────────────────────────────────────────────────────
export const categories: Category[] = [
  // Football
  { id: "c1", name: "Jerseys", slug: "jerseys", parentId: null, sportId: "s1", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop" },
  { id: "c1a", name: "Club Jerseys", slug: "club-jerseys", parentId: "c1", sportId: "s1", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop" },
  { id: "c1b", name: "National Jerseys", slug: "national-jerseys", parentId: "c1", sportId: "s1", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop" },
  { id: "c1c", name: "Retro Jerseys", slug: "retro-jerseys", parentId: "c1", sportId: "s1", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop" },
  { id: "c2", name: "Boots", slug: "football-boots", parentId: null, sportId: "s1", image: "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=400&h=400&fit=crop" },
  { id: "c3", name: "Shorts", slug: "football-shorts", parentId: null, sportId: "s1", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop" },
  { id: "c4", name: "Training", slug: "football-training", parentId: null, sportId: "s1", image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=400&h=400&fit=crop" },
  // Basketball
  { id: "c5", name: "Jerseys", slug: "basketball-jerseys", parentId: null, sportId: "s2", image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=400&h=400&fit=crop" },
  { id: "c6", name: "Shoes", slug: "basketball-shoes", parentId: null, sportId: "s2", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop" },
  { id: "c7", name: "Shorts", slug: "basketball-shorts", parentId: null, sportId: "s2", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop" },
  // Running
  { id: "c8", name: "Shoes", slug: "running-shoes", parentId: null, sportId: "s3", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop" },
  { id: "c9", name: "Tops", slug: "running-tops", parentId: null, sportId: "s3", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop" },
  { id: "c10", name: "Tights", slug: "running-tights", parentId: null, sportId: "s3", image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=400&fit=crop" },
  { id: "c11", name: "Accessories", slug: "running-accessories", parentId: null, sportId: "s3", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop" },
  // Gym & Training
  { id: "c12", name: "Tops", slug: "gym-tops", parentId: null, sportId: "s4", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop" },
  { id: "c13", name: "Bottoms", slug: "gym-bottoms", parentId: null, sportId: "s4", image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=400&fit=crop" },
  { id: "c14", name: "Sports Bras", slug: "sports-bras", parentId: null, sportId: "s4", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop" },
  { id: "c15", name: "Gloves", slug: "gym-gloves", parentId: null, sportId: "s4", image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400&h=400&fit=crop" },
  // Tennis
  { id: "c16", name: "Racquet Wear", slug: "racquet-wear", parentId: null, sportId: "s5", image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=400&fit=crop" },
  { id: "c17", name: "Shoes", slug: "tennis-shoes", parentId: null, sportId: "s5", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop" },
  { id: "c18", name: "Skirts", slug: "tennis-skirts", parentId: null, sportId: "s5", image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=400&fit=crop" },
  // Swimming
  { id: "c19", name: "Swimsuits", slug: "swimsuits", parentId: null, sportId: "s6", image: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=400&h=400&fit=crop" },
  { id: "c20", name: "Goggles", slug: "goggles", parentId: null, sportId: "s6", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop" },
  { id: "c21", name: "Rash Guards", slug: "rash-guards", parentId: null, sportId: "s6", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop" },
  // Accessories
  { id: "c22", name: "Bags", slug: "bags", parentId: null, sportId: "s7", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop" },
  { id: "c23", name: "Socks", slug: "socks", parentId: null, sportId: "s7", image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&h=400&fit=crop" },
  { id: "c24", name: "Headbands", slug: "headbands", parentId: null, sportId: "s7", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop" },
  { id: "c25", name: "Water Bottles", slug: "water-bottles", parentId: null, sportId: "s7", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop" },
];

// ─── Product Generation Helpers ────────────────────────────────────────────
const brands = ["Nike", "Adidas", "Puma", "Under Armour", "New Balance", "Reebok", "Asics", "Mizuno"];
const genders: Array<"men" | "women" | "unisex" | "kids"> = ["men", "women", "unisex", "kids"];
const clothingSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const shoeSizes = ["38", "39", "40", "41", "42", "43", "44", "45", "46"];
const colors = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Navy", hex: "#1B2A4A" },
  { name: "Red", hex: "#DC2626" },
  { name: "Blue", hex: "#2563EB" },
  { name: "Green", hex: "#16A34A" },
  { name: "Grey", hex: "#6B7280" },
  { name: "Orange", hex: "#EA580C" },
  { name: "Yellow", hex: "#EAB308" },
  { name: "Pink", hex: "#EC4899" },
];

const productImages: Record<string, string[]> = {
  jerseys: [
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&h=600&fit=crop",
  ],
  boots: [
    "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
  ],
  shoes: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop",
  ],
  tops: [
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
  ],
  shorts: [
    "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&h=600&fit=crop",
  ],
  bottoms: [
    "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=600&fit=crop",
  ],
  accessories: [
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop",
  ],
  default: [
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop",
  ],
};

function getImagesForCategory(slug: string): string[] {
  if (slug.includes("jersey")) return productImages.jerseys;
  if (slug.includes("boot")) return productImages.boots;
  if (slug.includes("shoe")) return productImages.shoes;
  if (slug.includes("top") || slug.includes("wear") || slug.includes("guard")) return productImages.tops;
  if (slug.includes("short") || slug.includes("skirt")) return productImages.shorts;
  if (slug.includes("tight") || slug.includes("bottom") || slug.includes("bra")) return productImages.bottoms;
  if (slug.includes("bag") || slug.includes("sock") || slug.includes("headband") || slug.includes("bottle") || slug.includes("goggle") || slug.includes("glove")) return productImages.accessories;
  return productImages.default;
}

function isShoeCategory(slug: string): boolean {
  return slug.includes("boot") || slug.includes("shoe");
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const productTemplates: Record<string, string[]> = {
  "c1": ["Pro Match Jersey", "Elite Game Shirt", "Stadium Jersey", "Authentic Kit", "Fan Jersey", "Player Edition Top", "Home Kit Jersey", "Away Kit Jersey"],
  "c1a": ["Barcelona Home Jersey", "Real Madrid Away Kit", "Liverpool FC Shirt", "Bayern Munich Jersey", "PSG Match Top", "Manchester City Kit", "Chelsea FC Jersey", "Juventus Shirt"],
  "c1b": ["Germany National Jersey", "Brazil Home Shirt", "Nigeria Away Kit", "France Match Jersey", "Argentina Home Kit", "England National Shirt", "Netherlands Jersey", "Japan Away Kit"],
  "c1c": ["Classic 98 Retro Jersey", "Vintage 86 Shirt", "Heritage 70s Kit", "Retro Striped Jersey", "Legacy Edition Shirt", "Throwback 90s Top"],
  "c2": ["Mercurial Speed Boot", "Predator Strike FG", "Copa Mundial Classic", "Phantom GT Elite", "Future Z Boot", "King Platinum FG", "Tiempo Legend IX", "X Speedportal"],
  "c3": ["Match Day Shorts", "Training Shorts Pro", "Lightweight Game Shorts", "Breathable Match Shorts", "Woven Training Shorts"],
  "c4": ["Training Drill Top", "Warm-Up Jacket", "Track Pants Pro", "Training Jersey", "Practice Vest", "Drill Quarter Zip"],
  "c5": ["NBA Replica Jersey", "Pro Basketball Vest", "All-Star Game Jersey", "Swingman Edition", "City Edition Jersey", "Association Jersey"],
  "c6": ["Air Max Basketball", "Pro Bounce Hi-Top", "Court Vision Mid", "Harden Vol. 7", "LeBron XX", "Zoom Freak 5"],
  "c7": ["Pro Basketball Shorts", "Mesh Court Shorts", "Swingman Shorts", "Icon Edition Shorts"],
  "c8": ["UltraBoost Runner", "Pegasus 41", "Fresh Foam X", "GEL-Kayano 31", "Wave Rider 28", "Cloud X4", "Novablast 5", "Vaporfly Next%"],
  "c9": ["Dri-Fit Running Tee", "AeroSwift Singlet", "Therma Running Top", "Ventilate Long Sleeve", "Race Day Vest"],
  "c10": ["Performance Tights", "Compression Leggings", "Thermal Running Tights", "Sprint Capri Tights", "Elite Pro Tights"],
  "c11": ["GPS Running Watch", "Hydration Belt", "Running Armband", "Reflective Vest", "Running Cap"],
  "c12": ["Performance Tank", "Muscle Fit Tee", "Compression Top", "Tech-Fit Shirt", "Dry-Fit Training Top", "HeatGear Tee"],
  "c13": ["Jogger Pants Pro", "Compression Shorts", "Flex Training Pants", "Tapered Track Pants", "Workout Leggings"],
  "c14": ["High Impact Sports Bra", "Medium Support Bra", "Infinity Bra", "Swoosh Sports Bra", "Powerreact Bra"],
  "c15": ["Weight Training Gloves", "CrossFit Gloves", "Grip Gym Gloves", "Pro Lifting Gloves"],
  "c16": ["Court Dri-Fit Polo", "Tennis Flex Top", "Performance Crew Neck", "Match Polo Shirt", "Tournament Tee"],
  "c17": ["Court Air Zoom", "Barricade Tennis", "Solution Speed FF", "Gel Resolution 9", "Rush Pro 4.0"],
  "c18": ["Pleated Court Skirt", "Performance Skort", "Victory Tennis Skirt", "Dri-Fit Club Skirt"],
  "c19": ["Pro Jammer Swim", "Racing Swimsuit", "Training One-Piece", "Endurance Swimsuit", "Competition Brief"],
  "c20": ["Hydrodynamic Goggles", "Mirror Lens Goggles", "Training Swim Goggles", "Racing Pro Goggles"],
  "c21": ["UV Protection Rashie", "Long Sleeve Rash Guard", "Printed Rash Guard", "Performance Rash Guard"],
  "c22": ["Pro Training Duffel", "Gym Backpack Elite", "Sports Tote Bag", "Shoe Bag Organizer", "Travel Kit Bag"],
  "c23": ["Performance Crew Socks", "Cushioned Ankle Socks", "Compression Running Socks", "No-Show Training Socks", "Grip Socks Pro"],
  "c24": ["Sweat Headband", "Performance Wristband", "Elastic Sports Band", "Wide Training Headband"],
  "c25": ["Insulated Sports Bottle", "Squeeze Water Bottle", "Stainless Steel Flask", "Hydro Running Bottle"],
};

function generateProducts(): Product[] {
  const products: Product[] = [];
  const rand = seededRandom(42);
  let productIndex = 0;

  for (const category of categories) {
    const templates = productTemplates[category.id] || ["Sport Product"];
    const sport = sports.find((s) => s.id === category.sportId)!;
    const categoryImages = getImagesForCategory(category.slug);
    const isShoeCat = isShoeCategory(category.slug);
    const availableSizes = isShoeCat ? shoeSizes : clothingSizes;

    for (const template of templates) {
      for (let brandIdx = 0; brandIdx < 4; brandIdx++) {
        const brand = brands[Math.floor(rand() * brands.length)];
        const gender = genders[Math.floor(rand() * genders.length)];
        const basePrice = Math.round((20 + rand() * 180) * 100) / 100;
        const isOnSale = rand() > 0.7;
        const compareAtPrice = isOnSale ? Math.round(basePrice * (1.2 + rand() * 0.4) * 100) / 100 : null;
        const id = `p${productIndex}`;
        const slug = `${template.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, "-")}-${brand.toLowerCase()}-${id}`;

        // Generate variants
        const numColors = 2 + Math.floor(rand() * 4);
        const selectedColors = [...colors].sort(() => rand() - 0.5).slice(0, numColors);
        const numSizes = 4 + Math.floor(rand() * (availableSizes.length - 3));
        const startSizeIdx = Math.floor(rand() * Math.max(1, availableSizes.length - numSizes));
        const selectedSizes = availableSizes.slice(startSizeIdx, startSizeIdx + numSizes);

        const variants: Variant[] = [];
        for (const color of selectedColors) {
          for (const size of selectedSizes) {
            const variantPrice = basePrice + (rand() > 0.8 ? Math.round(rand() * 10 * 100) / 100 : 0);
            variants.push({
              id: `v${productIndex}-${variants.length}`,
              size,
              color: color.name,
              colorHex: color.hex,
              sku: `EK-${sport.slug.toUpperCase().slice(0, 3)}-${id.toUpperCase()}-${size}-${color.name.toUpperCase().slice(0, 3)}`,
              price: variantPrice,
              compareAtPrice,
              stock: Math.floor(rand() * 50),
            });
          }
        }

        const images: ProductImage[] = categoryImages.map((url, idx) => ({
          url,
          alt: `${template} ${brand} - View ${idx + 1}`,
        }));

        products.push({
          id,
          name: `${brand} ${template}`,
          slug,
          description: `Premium ${template.toLowerCase()} by ${brand}. Designed for peak performance in ${sport.name.toLowerCase()}. Features advanced moisture-wicking technology and ergonomic fit for maximum comfort and style on and off the field.`,
          basePrice,
          compareAtPrice,
          brand,
          gender,
          tags: [sport.slug, category.slug, brand.toLowerCase(), gender, isOnSale ? "sale" : "", rand() > 0.7 ? "new" : ""].filter(Boolean),
          sportId: sport.id,
          categoryId: category.id,
          images,
          variants,
          featured: rand() > 0.85,
          isNew: rand() > 0.7,
          rating: Math.round((3.5 + rand() * 1.5) * 10) / 10,
          reviewCount: Math.floor(rand() * 200),
          createdAt: new Date(Date.now() - Math.floor(rand() * 90 * 24 * 60 * 60 * 1000)).toISOString(),
        });

        productIndex++;
      }
    }
  }

  return products;
}

// ─── Singleton product list ────────────────────────────────────────────────
let _products: Product[] | null = null;

export function getProducts(): Product[] {
  if (!_products) {
    _products = generateProducts();
  }
  return _products;
}

// ─── Query functions ───────────────────────────────────────────────────────

export function getProductBySlug(slug: string): Product | undefined {
  return getProducts().find((p) => p.slug === slug);
}

export function getFeaturedProducts(limit = 8): Product[] {
  return getProducts()
    .filter((p) => p.featured)
    .slice(0, limit);
}

export function getNewArrivals(limit = 8): Product[] {
  return getProducts()
    .filter((p) => p.isNew)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function getProductsBySport(sportSlug: string, limit?: number): Product[] {
  const sport = sports.find((s) => s.slug === sportSlug);
  if (!sport) return [];
  const filtered = getProducts().filter((p) => p.sportId === sport.id);
  return limit ? filtered.slice(0, limit) : filtered;
}

export function getProductsByCategory(categorySlug: string, limit?: number): Product[] {
  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) return [];
  // Include children
  const catIds = [category.id, ...categories.filter((c) => c.parentId === category.id).map((c) => c.id)];
  const filtered = getProducts().filter((p) => catIds.includes(p.categoryId));
  return limit ? filtered.slice(0, limit) : filtered;
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return getProducts()
    .filter((p) => p.id !== product.id && (p.categoryId === product.categoryId || p.sportId === product.sportId))
    .slice(0, limit);
}

export function getCategoryTree(): (Category & { children: Category[] })[] {
  const roots = categories.filter((c) => c.parentId === null);
  return roots.map((root) => ({
    ...root,
    children: categories.filter((c) => c.parentId === root.id),
  }));
}

export function getCategoriesBySport(sportSlug: string): Category[] {
  const sport = sports.find((s) => s.slug === sportSlug);
  if (!sport) return [];
  return categories.filter((c) => c.sportId === sport.id && c.parentId === null);
}

const PAGE_SIZE = 12;

export function filterProducts(filters: FilterState): { products: Product[]; total: number; facets: Facets } {
  let filtered = getProducts();

  // Apply filters
  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q))
    );
  }

  if (filters.sport) {
    const sport = sports.find((s) => s.slug === filters.sport);
    if (sport) filtered = filtered.filter((p) => p.sportId === sport.id);
  }

  if (filters.category) {
    const cat = categories.find((c) => c.slug === filters.category);
    if (cat) {
      const catIds = [cat.id, ...categories.filter((c) => c.parentId === cat.id).map((c) => c.id)];
      filtered = filtered.filter((p) => catIds.includes(p.categoryId));
    }
  }

  if (filters.gender) {
    filtered = filtered.filter((p) => p.gender === filters.gender);
  }

  if (filters.brand) {
    filtered = filtered.filter((p) => p.brand.toLowerCase() === filters.brand!.toLowerCase());
  }

  if (filters.sizes && filters.sizes.length > 0) {
    filtered = filtered.filter((p) => p.variants.some((v) => filters.sizes!.includes(v.size)));
  }

  if (filters.colors && filters.colors.length > 0) {
    filtered = filtered.filter((p) => p.variants.some((v) => filters.colors!.includes(v.color)));
  }

  if (filters.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.basePrice >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.basePrice <= filters.maxPrice!);
  }

  // Compute facets from filtered set
  const facets = computeFacets(filtered);

  // Sort
  switch (filters.sort) {
    case "price-asc":
      filtered.sort((a, b) => a.basePrice - b.basePrice);
      break;
    case "price-desc":
      filtered.sort((a, b) => b.basePrice - a.basePrice);
      break;
    case "popular":
      filtered.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case "newest":
    default:
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }

  const total = filtered.length;
  const page = filters.page || 1;
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return { products: paginated, total, facets };
}

function computeFacets(products: Product[]): Facets {
  const sportCounts = new Map<string, number>();
  const categoryCounts = new Map<string, number>();
  const genderCounts = new Map<string, number>();
  const sizeCounts = new Map<string, number>();
  const colorCounts = new Map<string, { count: number; hex: string }>();
  const brandCounts = new Map<string, number>();
  let minPrice = Infinity;
  let maxPrice = 0;

  for (const p of products) {
    const sport = sports.find((s) => s.id === p.sportId);
    if (sport) sportCounts.set(sport.slug, (sportCounts.get(sport.slug) || 0) + 1);

    const cat = categories.find((c) => c.id === p.categoryId);
    if (cat) categoryCounts.set(cat.slug, (categoryCounts.get(cat.slug) || 0) + 1);

    genderCounts.set(p.gender, (genderCounts.get(p.gender) || 0) + 1);
    brandCounts.set(p.brand, (brandCounts.get(p.brand) || 0) + 1);

    if (p.basePrice < minPrice) minPrice = p.basePrice;
    if (p.basePrice > maxPrice) maxPrice = p.basePrice;

    const seenSizes = new Set<string>();
    const seenColors = new Set<string>();
    for (const v of p.variants) {
      if (!seenSizes.has(v.size)) {
        seenSizes.add(v.size);
        sizeCounts.set(v.size, (sizeCounts.get(v.size) || 0) + 1);
      }
      if (!seenColors.has(v.color)) {
        seenColors.add(v.color);
        const existing = colorCounts.get(v.color);
        colorCounts.set(v.color, { count: (existing?.count || 0) + 1, hex: v.colorHex });
      }
    }
  }

  const toFacet = (map: Map<string, number>, labelFn?: (k: string) => string): FacetCount[] =>
    Array.from(map.entries())
      .map(([value, count]) => ({ value, label: labelFn ? labelFn(value) : value, count }))
      .sort((a, b) => b.count - a.count);

  const sportLabel = (slug: string) => sports.find((s) => s.slug === slug)?.name || slug;
  const catLabel = (slug: string) => categories.find((c) => c.slug === slug)?.name || slug;

  return {
    sports: toFacet(sportCounts, sportLabel),
    categories: toFacet(categoryCounts, catLabel),
    genders: toFacet(genderCounts),
    sizes: toFacet(sizeCounts),
    colors: Array.from(colorCounts.entries())
      .map(([value, { count, hex }]) => ({ value, label: value, count, hex }))
      .sort((a, b) => b.count - a.count),
    brands: toFacet(brandCounts),
    priceRange: { min: minPrice === Infinity ? 0 : Math.floor(minPrice), max: Math.ceil(maxPrice) },
  };
}

export function searchProducts(query: string, limit = 20): Product[] {
  const q = query.toLowerCase();
  return getProducts()
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q))
    )
    .slice(0, limit);
}

// ─── Stats ─────────────────────────────────────────────────────────────────
export function getStats() {
  const products = getProducts();
  const totalVariants = products.reduce((sum, p) => sum + p.variants.length, 0);
  return {
    products: products.length,
    variants: totalVariants,
    sports: sports.length,
    categories: categories.length,
  };
}
