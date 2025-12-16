import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash passwords
  const hashedAdminPassword = await bcrypt.hash('Admin@123', 10);
  const hashedUserPassword = await bcrypt.hash('Test@123', 10);

  // Create or update admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sudaksha.com' },
    update: {},
    create: {
      email: 'admin@sudaksha.com',
      password: hashedAdminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: Role.ADMIN,
      department: 'IT',
      designation: 'System Administrator',
      isEmailVerified: true,
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create or update test user
  const testUser = await prisma.user.upsert({
    where: { email: 'test@sudaksha.com' },
    update: {},
    create: {
      email: 'test@sudaksha.com',
      password: hashedUserPassword,
      firstName: 'Test',
      lastName: 'User',
      role: Role.USER,
      department: 'Sales',
      designation: 'Sales Executive',
      managerId: admin.id, // Reports to admin
      isEmailVerified: true,
    },
  });

  console.log('✅ Test user created:', testUser.email);

  // Create manager user
  const manager = await prisma.user.upsert({
    where: { email: 'manager@sudaksha.com' },
    update: {},
    create: {
      email: 'manager@sudaksha.com',
      password: hashedAdminPassword,
      firstName: 'Manager',
      lastName: 'User',
      role: Role.MANAGER,
      department: 'Sales',
      designation: 'Sales Manager',
      managerId: admin.id, // Reports to admin
      isEmailVerified: true,
    },
  });

  console.log('✅ Manager user created:', manager.email);

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📧 Test Credentials:');
  console.log('Admin: admin@sudaksha.com / Admin@123');
  console.log('User: test@sudaksha.com / Test@123');
  console.log('Manager: manager@sudaksha.com / Admin@123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
