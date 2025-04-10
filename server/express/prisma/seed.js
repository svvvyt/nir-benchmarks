import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

function generatePosts(count) {
  return Array.from({ length: count }, (_, i) => ({
    title: `Test post ${i + 1}`,
    text: `Test text ${i + 1}`,
    imageUrl: '/uploads/test-image.jpg',
  }));
}

async function up() {
  const numberOfPosts = 50; // 50 | 500 | 5000
  const posts = generatePosts(numberOfPosts);

  await prisma.post.createMany({ data: posts });
  logger.info(`${numberOfPosts} posts inserted.`);
}

async function down() {
  await prisma.post.deleteMany();
  logger.info('All posts deleted.');
}

async function main() {
  logger.info('Starting database seeding...');

  try {
    await down();
    await up();
    logger.info('Seeding completed successfully.');
  } catch (e) {
    logger.error('Error during seeding:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
