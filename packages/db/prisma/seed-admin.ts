import { PrismaClient } from '../client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Super Admin...');

  const email = process.env.INITIAL_SUPERADMIN_EMAIL;
  const password = process.env.INITIAL_SUPERADMIN_PASSWORD;

  if (!email || !password) {
    console.error('Environment variables INITIAL_SUPERADMIN_EMAIL or INITIAL_SUPERADMIN_PASSWORD are not set in .env');
    process.exit(1);
  }

  // Hash the password using argon2 (which is what better-auth defaults to, or bcrypt etc. better-auth usually respects it if it's a valid hash)
  // Actually better-auth handles the hash internally, but if we do raw Prisma insert, we must hash it.
  // We'll use argon2 since it's installed in the package.
  const hashedPassword = await argon2.hash(password);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      emailVerified: true,
      isEmailVerified: true,
      name: 'Super Admin',
      firstName: 'Super',
      lastName: 'Admin'
    },
    create: {
      email,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      emailVerified: true,
      isEmailVerified: true,
      name: 'Super Admin',
      firstName: 'Super',
      lastName: 'Admin'
    }
  });

  console.log(`Successfully seeded Super Admin: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
