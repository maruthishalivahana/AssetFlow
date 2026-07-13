const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const cats = await prisma.assetCategory.findMany();
  console.log('Categories:', cats);
}

main().finally(() => prisma.$disconnect());
