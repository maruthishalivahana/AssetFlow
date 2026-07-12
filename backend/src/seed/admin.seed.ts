import { Role } from '@prisma/client';
import { prisma } from '@config/prisma';
import { hashPassword } from '@shared/utils/hash';

export const seedAdmin = async (): Promise<void> => {
  try {
    const adminEmail = 'admin@assetflow.com';

    // Check if an ADMIN user already exists (by role or email)
    const adminExists = await prisma.user.findFirst({
      where: {
        OR: [{ role: Role.ADMIN }, { email: adminEmail }],
      },
    });

    if (adminExists) {
      console.log('Admin user already exists. Seed skipped.');
      return;
    }

    const hashedPassword = await hashPassword('Admin@123');

    await prisma.user.create({
      data: {
        firstName: 'System',
        lastName: 'Administrator',
        email: adminEmail,
        passwordHash: hashedPassword,
        role: Role.ADMIN,
        status: 'ACTIVE',
        employeeCode: 'ADMIN-001',
        jobTitle: 'System Administrator',
      },
    });

    console.log('Default admin account seeded successfully.');
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};
