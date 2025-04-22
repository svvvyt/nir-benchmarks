import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generatePosts(count) {
  return Array.from({ length: count }, (_, i) => ({
    title: `Test post ${i + 1}`,
    text: `Test text ${i + 1}`,
    imageUrl: '/uploads/test-image.jpg',
  }));
}

async function up() {
  const numberOfPosts = 50;
  const posts = generatePosts(numberOfPosts);

  await prisma.post.createMany({ data: posts });
  console.log(`${numberOfPosts} posts inserted.`);
}

async function down() {
  await prisma.post.deleteMany();
  console.log('All posts deleted.');
}

async function main() {
  console.log('Starting database seeding...');

  try {
    await down();
    await up();
    console.log('Seeding completed successfully.');
  } catch (e) {
    console.error('Error during seeding:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
