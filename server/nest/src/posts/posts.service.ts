import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { logger } from '../../utils/logger';

@Injectable()
export class PostsService {
  constructor(@Inject('PRISMA') private readonly prisma: PrismaClient) {}

  async getAll() {
    const start = process.hrtime();
    try {
      const posts = await this.prisma.post.findMany();
      const [seconds, nanoseconds] = process.hrtime(start);
      const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
      logger.info(`getAll executed in ${durationMs} ms`);
      return posts;
    } catch (error) {
      logger.error('Error in getAll:', error);
      throw error;
    }
  }

  async getOne(id: number) {
    const start = process.hrtime();
    try {
      const post = await this.prisma.post.update({
        where: { id },
        data: { viewsCount: { increment: 1 } },
      });
      if (!post) throw new Error('Post not found');
      const [seconds, nanoseconds] = process.hrtime(start);
      const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
      logger.info(`getOne (id: ${id}) executed in ${durationMs} ms`);
      return post;
    } catch (error) {
      logger.error('Error in getOne:', error);
      throw error;
    }
  }

  async create(title: string, text: string, imageUrl?: string) {
    const start = process.hrtime();
    try {
      const post = await this.prisma.post.create({
        data: { title, text, imageUrl },
      });
      const [seconds, nanoseconds] = process.hrtime(start);
      const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
      logger.info(`create executed in ${durationMs} ms`);
      return post;
    } catch (error) {
      logger.error('Error creating post:', error);
      throw error;
    }
  }

  async update(id: number, title: string, text: string, imageUrl?: string) {
    const start = process.hrtime();
    try {
      const post = await this.prisma.post.update({
        where: { id },
        data: { title, text, imageUrl },
      });
      const [seconds, nanoseconds] = process.hrtime(start);
      const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
      logger.info(`update (id: ${id}) executed in ${durationMs} ms`);
      return post;
    } catch (error) {
      logger.error('Error updating post:', error);
      throw error;
    }
  }

  async remove(id: number) {
    const start = process.hrtime();
    try {
      await this.prisma.post.delete({ where: { id } });
      const [seconds, nanoseconds] = process.hrtime(start);
      const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
      logger.info(`remove (id: ${id}) executed in ${durationMs} ms`);
      return { message: 'Post deleted successfully' };
    } catch (error) {
      logger.error('Error in remove:', error);
      throw error;
    }
  }
}