import { prisma } from '../prisma/prisma-client.ts';
import { logger } from '../utils/logger.js';

export const create = async (request, reply) => {
  const start = process.hrtime();
  try {
    const { body, file } = request;
    const { title, text } = body;
    const imageUrl = file ? `/uploads/${file.filename}` : null;

    const post = await prisma.post.create({
      data: { title, text, imageUrl },
    });

    const [seconds, nanoseconds] = process.hrtime(start);
    const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
    logger.info(`create executed in ${durationMs} ms`);

    reply.send(post);
  } catch (error) {
    const [seconds, nanoseconds] = process.hrtime(start);
    const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
    logger.error(`Error creating post in ${durationMs} ms: ${error.message}`);
    reply
      .status(500)
      .send({ message: 'Failed to create post', error: error.message });
  }
};

export const getAll = async (request, reply) => {
  const start = process.hrtime();
  try {
    const posts = await prisma.post.findMany();

    const [seconds, nanoseconds] = process.hrtime(start);
    const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
    logger.info(
      `getAll executed in ${durationMs} ms; posts fetched: ${posts.length}`
    );

    reply.send(posts);
  } catch (error) {
    const [seconds, nanoseconds] = process.hrtime(start);
    const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
    logger.error(`Error in getAll in ${durationMs} ms: ${error.message}`);
    reply.status(500).send({ message: 'Failed to load posts' });
  }
};

export const getOne = async (request, reply) => {
  const start = process.hrtime();
  try {
    const { id } = request.params;

    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: { viewsCount: { increment: 1 } },
    });

    if (!post) {
      const [seconds, nanoseconds] = process.hrtime(start);
      const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
      logger.info(`getOne (id: ${id}) post not found in ${durationMs} ms`);
      return reply.status(404).send({ message: 'Post not found' });
    }

    const [seconds, nanoseconds] = process.hrtime(start);
    const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
    logger.info(`getOne (id: ${id}) executed in ${durationMs} ms`);

    reply.send(post);
  } catch (error) {
    const [seconds, nanoseconds] = process.hrtime(start);
    const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
    logger.error(
      `Error in getOne (id: ${id}) in ${durationMs} ms: ${error.message}`
    );
    reply.status(500).send({ message: 'Failed to load post' });
  }
};

export const update = async (request, reply) => {
  const start = process.hrtime();
  try {
    const { params, body, file } = request;
    const { id } = params;
    const { title, text } = body;
    const imageUrl = file ? `/uploads/${file.filename}` : undefined;

    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: { title, text, ...(imageUrl && { imageUrl }) },
    });

    const [seconds, nanoseconds] = process.hrtime(start);
    const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
    logger.info(`update (id: ${id}) executed in ${durationMs} ms`);

    reply.send(post);
  } catch (error) {
    const [seconds, nanoseconds] = process.hrtime(start);
    const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
    logger.error(
      `Error updating post (id: ${id}) in ${durationMs} ms: ${error.message}`
    );
    reply
      .status(500)
      .send({ message: 'Failed to update post', error: error.message });
  }
};

export const remove = async (request, reply) => {
  const start = process.hrtime();
  try {
    const { id } = request.params;

    await prisma.post.delete({
      where: { id: parseInt(id) },
    });

    const [seconds, nanoseconds] = process.hrtime(start);
    const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
    logger.info(`remove (id: ${id}) executed in ${durationMs} ms`);

    reply.send({ message: 'Post deleted successfully' });
  } catch (error) {
    const [seconds, nanoseconds] = process.hrtime(start);
    const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
    logger.error(
      `Error in remove (id: ${id}) in ${durationMs} ms: ${error.message}`
    );
    reply.status(500).send({ message: 'Failed to delete post' });
  }
};
