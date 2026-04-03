import { prisma } from './src/lib/prisma';

async function main() {
  const products = await prisma.product.findMany({ take: 5 });
  console.log(JSON.stringify(products, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
