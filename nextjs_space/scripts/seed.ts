import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Crear usuario de prueba por defecto (john@doe.com)
  const testUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      name: 'Test Admin',
      password: await bcrypt.hash('johndoe123', 10),
      role: 'admin',
    },
  });
  console.log('✅ Test user created:', testUser.email);

  // Crear usuario admin adicional (admin@migranteglobal.com)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@migranteglobal.com' },
    update: {},
    create: {
      email: 'admin@migranteglobal.com',
      name: 'Migrante Global Admin',
      password: await bcrypt.hash('migrante2024', 10),
      role: 'admin',
    },
  });
  console.log('✅ Admin user created:', adminUser.email);

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
