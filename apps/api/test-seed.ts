import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.product.upsert({
    where: { id: 'p0' },
    update: {},
    create: {
      id: 'p0',
      name: 'Nike Pro Match Jersey',
      slug: 'pro-match-jersey-nike-p0',
      description: 'Premium jersey',
      basePrice: 45.0,
      status: 'active',
    },
  });
  console.log('Seed test success');
}

main().catch(console.error).finally(() => prisma.$disconnect());
