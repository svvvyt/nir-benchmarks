import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js'; // Новый файл для логирования

const prisma = new PrismaClient();

export const getAll = async (req, res) => {
  const start = process.hrtime();
  try {
    const posts = await prisma.post.findMany();
    const [seconds, nanoseconds] = process.hrtime(start);
    const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
    logger.info(
      `getAll executed in ${durationMs} ms; posts fetched: ${posts.length}`
    );
    res.json(posts);
  } catch (error) {
    logger.error('Error in getAll:', error);
    res.status(500).json({ message: 'Failed to load posts' });
  }
};

export const getOne = async (req, res) => {
  const start = process.hrtime();
  try {
    const { id } = req.params;

    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        viewsCount: {
          increment: 1,
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const [seconds, nanoseconds] = process.hrtime(start);
    const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
    logger.info(`getOne (id: ${id}) executed in ${durationMs} ms`);
    res.json(post);
  } catch (error) {
    logger.error('Error in getOne:', error);
    res.status(500).json({ message: 'Failed to load post' });
  }
};

export const create = async (req, res) => {
  const start = process.hrtime();
  try {
    const { title, text } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.originalname}` : null;

    const post = await prisma.post.create({
      data: {
        title,
        text,
        imageUrl,
      },
    });

    const [seconds, nanoseconds] = process.hrtime(start);
    const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
    logger.info(`create executed in ${durationMs} ms`);
    res.json(post);
  } catch (error) {
    logger.error('Error creating post:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
};

export const update = async (req, res) => {
  const start = process.hrtime();
  try {
    const { id } = req.params;
    const { title, text } = req.body;
    let updateData = { title, text };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    const [seconds, nanoseconds] = process.hrtime(start);
    const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
    logger.info(`update (id: ${id}) executed in ${durationMs} ms`);
    res.json(post);
  } catch (error) {
    logger.error('Error updating post:', error);
    res.status(500).json({ message: 'Failed to update post' });
  }
};

export const remove = async (req, res) => {
  const start = process.hrtime();
  try {
    const { id } = req.params;

    await prisma.post.delete({
      where: { id: parseInt(id) },
    });

    const [seconds, nanoseconds] = process.hrtime(start);
    const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
    logger.info(`remove (id: ${id}) executed in ${durationMs} ms`);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    logger.error('Error in remove:', error);
    res.status(500).json({ message: 'Failed to delete post' });
  }
};
