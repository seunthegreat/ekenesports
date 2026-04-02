import { PrismaClient } from '../client';

const prisma = new PrismaClient();

// ─── Mock Data Extraction ──────────────────────────────────────────────────
const sports = [
  { id: "s1", name: "Football", slug: "football", icon: "⚽", image: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&h=400&fit=crop" },
  { id: "s2", name: "Basketball", slug: "basketball", icon: "🏀", image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop" },
  { id: "s3", name: "Running", slug: "running", icon: "🏃", image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&h=400&fit=crop" },
  { id: "s4", name: "Gym & Training", slug: "gym-training", icon: "🏋️", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop" },
  { id: "s5", name: "Tennis", slug: "tennis", icon: "🎾", image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop" },
  { id: "s6", name: "Swimming", slug: "swimming", icon: "🏊", image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&h=400&fit=crop" },
  { id: "s7", name: "Accessories", slug: "accessories", icon: "🎒", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop" },
];

const categories = [
  // Football
  { id: "c1", name: "Jerseys", slug: "jerseys", parentId: null, sportId: "s1", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop" },
  { id: "c2", name: "Boots", slug: "football-boots", parentId: null, sportId: "s1", image: "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=400&h=400&fit=crop" },
  // Basketball
  { id: "c5", name: "Jerseys", slug: "basketball-jerseys", parentId: null, sportId: "s2", image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=400&h=400&fit=crop" },
  { id: "c6", name: "Shoes", slug: "basketball-shoes", parentId: null, sportId: "s2", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop" },
  // Running
  { id: "c8", name: "Shoes", slug: "running-shoes", parentId: null, sportId: "s3", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop" },
  // Gym & Training
  { id: "c12", name: "Tops", slug: "gym-tops", parentId: null, sportId: "s4", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop" },
  // Accessories
  { id: "c22", name: "Bags", slug: "bags", parentId: null, sportId: "s7", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop" },
];

const brands = ["Nike", "Adidas", "Puma", "Under Armour", "New Balance"];
const colors = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Navy", hex: "#1B2A4A" },
  { name: "Red", hex: "#DC2626" },
];
const clothingSizes = ["S", "M", "L", "XL"];
const shoeSizes = ["40", "41", "42", "43", "44"];

async function main() {
  console.log('Seed started...');

  // 1. Seed Sports
  for (const sport of sports) {
    await prisma.sport.upsert({
      where: { slug: sport.slug },
      update: {},
      create: sport
    });
  }
  console.log('Sports seeded.');

  // 2. Seed Categories
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat
    });
  }
  console.log('Categories seeded.');

  // 3. Seed Products for each Category
  for (const category of categories) {
    const sport = sports.find(s => s.id === category.sportId)!;
    
    for (let i = 1; i <= 3; i++) { // 3 products per category
      const brand = brands[Math.floor(Math.random() * brands.length)];
      const name = `${brand} ${category.name} ${i}`;
      const slug = `${name.toLowerCase().replace(/\s+/g, '-')}-${category.id}-${i}`;
      const basePrice = 50 + Math.floor(Math.random() * 150);
      const isShoe = category.slug.includes('boot') || category.slug.includes('shoe');
      const sizes = isShoe ? shoeSizes : clothingSizes;

      await prisma.product.upsert({
        where: { slug },
        update: {},
        create: {
          name,
          slug,
          description: `Premium quality ${category.name.toLowerCase()} by ${brand}. Perfect for ${sport.name.toLowerCase()}.`,
          basePrice,
          brand,
          gender: 'unisex',
          featured: Math.random() > 0.5,
          isNew: Math.random() > 0.7,
          sportId: sport.id,
          categoryId: category.id,
          images: {
            create: [
              { url: category.image, alt: name }
            ]
          },
          variants: {
            create: colors.flatMap(color => 
              sizes.map(size => ({
                size,
                color: color.name,
                colorHex: color.hex,
                sku: `${brand.toUpperCase().slice(0,3)}-${category.id.toUpperCase()}-${i}-${size}-${color.name.toUpperCase().slice(0,3)}`,
                price: basePrice,
                stock: 20 + Math.floor(Math.random() * 80)
              }))
            )
          }
        }
      });
    }
  }

  console.log('Seed finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
