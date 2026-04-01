import { PrismaClient, Role } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

// ── Mirrors apps/web/src/lib/data.ts EXACTLY ─────────────────────────────────
const brands = ["Nike", "Adidas", "Puma", "Under Armour", "New Balance", "Reebok", "Asics", "Mizuno"];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// All categories from data.ts (same order as the frontend generates products)
const categories = [
  { id: "c1" }, { id: "c1a" }, { id: "c1b" }, { id: "c1c" },
  { id: "c2" }, { id: "c3" }, { id: "c4" },
  { id: "c5" }, { id: "c6" }, { id: "c7" },
  { id: "c8" }, { id: "c9" }, { id: "c10" }, { id: "c11" },
  { id: "c12" }, { id: "c13" }, { id: "c14" }, { id: "c15" },
  { id: "c16" }, { id: "c17" }, { id: "c18" },
  { id: "c19" }, { id: "c20" }, { id: "c21" },
  { id: "c22" }, { id: "c23" }, { id: "c24" }, { id: "c25" },
];

const productTemplates: Record<string, string[]> = {
  "c1":  ["Pro Match Jersey", "Elite Game Shirt", "Stadium Jersey", "Authentic Kit", "Fan Jersey", "Player Edition Top", "Home Kit Jersey", "Away Kit Jersey"],
  "c1a": ["Barcelona Home Jersey", "Real Madrid Away Kit", "Liverpool FC Shirt", "Bayern Munich Jersey", "PSG Match Top", "Manchester City Kit", "Chelsea FC Jersey", "Juventus Shirt"],
  "c1b": ["Germany National Jersey", "Brazil Home Shirt", "Nigeria Away Kit", "France Match Jersey", "Argentina Home Kit", "England National Shirt", "Netherlands Jersey", "Japan Away Kit"],
  "c1c": ["Classic 98 Retro Jersey", "Vintage 86 Shirt", "Heritage 70s Kit", "Retro Striped Jersey", "Legacy Edition Shirt", "Throwback 90s Top"],
  "c2":  ["Mercurial Speed Boot", "Predator Strike FG", "Copa Mundial Classic", "Phantom GT Elite", "Future Z Boot", "King Platinum FG", "Tiempo Legend IX", "X Speedportal"],
  "c3":  ["Match Day Shorts", "Training Shorts Pro", "Lightweight Game Shorts", "Breathable Match Shorts", "Woven Training Shorts"],
  "c4":  ["Training Drill Top", "Warm-Up Jacket", "Track Pants Pro", "Training Jersey", "Practice Vest", "Drill Quarter Zip"],
  "c5":  ["NBA Replica Jersey", "Pro Basketball Vest", "All-Star Game Jersey", "Swingman Edition", "City Edition Jersey", "Association Jersey"],
  "c6":  ["Air Max Basketball", "Pro Bounce Hi-Top", "Court Vision Mid", "Harden Vol. 7", "LeBron XX", "Zoom Freak 5"],
  "c7":  ["Pro Basketball Shorts", "Mesh Court Shorts", "Swingman Shorts", "Icon Edition Shorts"],
  "c8":  ["UltraBoost Runner", "Pegasus 41", "Fresh Foam X", "GEL-Kayano 31", "Wave Rider 28", "Cloud X4", "Novablast 5", "Vaporfly Next%"],
  "c9":  ["Dri-Fit Running Tee", "AeroSwift Singlet", "Therma Running Top", "Ventilate Long Sleeve", "Race Day Vest"],
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

async function main() {
  console.log('--- Initializing Seed ---');

  // 1. Seed Super Admin from Environment Variables
  const adminEmail = process.env.INITIAL_SUPERADMIN_EMAIL;
  const adminPassword = process.env.INITIAL_SUPERADMIN_PASSWORD;
  const pepper = process.env.SECRET_PEPPER || 'default_pepper_change_me';

  if (adminEmail && adminPassword) {
    console.log(`Seeding Super Admin: ${adminEmail}...`);
    
    const hashedPassword = await argon2.hash(adminPassword + pepper, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {}, // Don't overwrite if exists
      create: {
        email: adminEmail,
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        role: Role.SUPER_ADMIN,
        isEmailVerified: true,
      },
    });
    console.log('✅ Super Admin seeding complete (or already exists).');
  } else {
    console.log('⚠️ Skipping Super Admin seeding: INITIAL_SUPERADMIN_EMAIL or INITIAL_SUPERADMIN_PASSWORD not set.');
  }

  console.log('Seeding products (mirroring frontend data.ts)...');

  const rand = seededRandom(42); // Same seed as frontend
  let productIndex = 0;

  for (const category of categories) {
    const templates = productTemplates[category.id] || ["Sport Product"];

    for (const template of templates) {
      // data.ts iterates brandIdx 0..3 (4 brands per template)
      for (let brandIdx = 0; brandIdx < 4; brandIdx++) {
        const brand = brands[Math.floor(rand() * brands.length)];
        // Consume gender random (data.ts calls rand() for gender too)
        rand(); // gender
        const basePrice = Math.round((20 + rand() * 180) * 100) / 100;
        // Consume isOnSale random
        const isOnSale = rand() > 0.7;
        if (isOnSale) rand(); // compareAtPrice

        const id = `p${productIndex}`;
        const slug = `${template.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, "-")}-${brand.toLowerCase()}-${id}`;

        // Consume variant randoms (data.ts generates variants inside same rand stream)
        const numColors = 2 + Math.floor(rand() * 4);
        const numSizes = 4 + Math.floor(rand() * 5); // approximate
        rand(); // startSizeIdx
        // Each variant calls rand() twice (price check + stock)
        for (let i = 0; i < numColors * numSizes; i++) {
          rand(); // variantPrice check
          rand(); // stock
        }
        // Consume featured and isNew randoms
        rand(); // featured
        rand(); // isNew
        rand(); // rating
        rand(); // reviewCount
        rand(); // createdAt

        await prisma.product.upsert({
          where: { id },
          update: { name: `${brand} ${template}`, basePrice, status: 'active' },
          create: {
            id,
            name: `${brand} ${template}`,
            slug,
            description: `Premium ${template.toLowerCase()} by ${brand}.`,
            basePrice,
            status: 'active',
          },
        });

        productIndex++;
      }
    }
  }

  console.log(`✅ Seeded ${productIndex} products matching frontend IDs (p0 → p${productIndex - 1})`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
