import { PrismaClient } from '@ekene/db';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  console.log('--- PRODUCTS IN DATABASE ---');
  console.log(JSON.stringify(products, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
