import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.log(
      'ℹ️  SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD no están definidas — no se crea ninguna cuenta admin.'
    );
    console.log(
      '   Defínelas como variables de entorno temporales antes de correr este script si necesitas crear una cuenta.'
    );
    return;
  }

  if (password.length < 12) {
    throw new Error('SEED_ADMIN_PASSWORD debe tener al menos 12 caracteres.');
  }

  const adminUser = await prisma.user.upsert({
    where: { email },
    update: { password: await bcrypt.hash(password, 10), role: 'admin' },
    create: {
      email,
      name: 'Admin',
      password: await bcrypt.hash(password, 10),
      role: 'admin',
    },
  });
  console.log('✅ Admin user created/updated:', adminUser.email);

  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
