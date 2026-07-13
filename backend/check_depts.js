const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const depts = await prisma.department.findMany();
  console.log('Departments:', depts.length);
  console.log(depts);
}

main().finally(() => prisma.$disconnect());
