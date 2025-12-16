import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Hash password
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  const userPassword = await bcrypt.hash('Test@123', 10);

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sudaksha.com' },
    update: {},
    create: {
      email: 'admin@sudaksha.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create Test User
  const testUser = await prisma.user.upsert({
    where: { email: 'test@sudaksha.com' },
    update: {},
    create: {
      email: 'test@sudaksha.com',
      password: userPassword,
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
    },
  });
  console.log('✅ Test user created:', testUser.email);

  // Create Manager User
  const manager = await prisma.user.upsert({
    where: { email: 'manager@sudaksha.com' },
    update: {},
    create: {
      email: 'manager@sudaksha.com',
      password: hashedPassword,
      firstName: 'Manager',
      lastName: 'User',
      role: 'MANAGER',
    },
  });
  console.log('✅ Manager user created:', manager.email);

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📋 Available Users:');
  console.log('  1. admin@sudaksha.com / Admin@123 (ADMIN)');
  console.log('  2. test@sudaksha.com / Test@123 (USER)');
  console.log('  3. manager@sudaksha.com / Admin@123 (MANAGER)\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
