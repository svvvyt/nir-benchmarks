import { prisma } from '../prisma/prisma-client.ts';

export const create = async (request, reply) => {
  try {
    const { body, file } = request;
    const { title, text } = body;
    const imageUrl = file ? `/uploads/${file.filename}` : null;

    const post = await prisma.post.create({
      data: { title, text, imageUrl },
    });

    reply.send(post);
  } catch (error) {
    console.error('Error creating post:', error.message);
    reply
      .status(500)
      .send({ message: 'Failed to create post', error: error.message });
  }
};

export const getAll = async (request, reply) => {
  try {
    const posts = await prisma.post.findMany();
    reply.send(posts);
  } catch (error) {
    console.error(error);
    reply.status(500).send({ message: 'Failed to load posts' });
  }
};

export const getOne = async (request, reply) => {
  try {
    const { id } = request.params;

    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: { viewsCount: { increment: 1 } },
    });

    if (!post) {
      return reply.status(404).send({ message: 'Post not found' });
    }

    reply.send(post);
  } catch (error) {
    console.error(error);
    reply.status(500).send({ message: 'Failed to load post' });
  }
};

export const update = async (request, reply) => {
  try {
    const { params, body, file } = request;
    const { id } = params;
    const { title, text } = body;
    const imageUrl = file ? `/uploads/${file.filename}` : undefined;

    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: { title, text, ...(imageUrl && { imageUrl }) },
    });

    reply.send(post);
  } catch (error) {
    console.error('Error updating post:', error.message);
    reply
      .status(500)
      .send({ message: 'Failed to update post', error: error.message });
  }
};

export const remove = async (request, reply) => {
  try {
    const { id } = request.params;

    await prisma.post.delete({
      where: { id: parseInt(id) },
    });

    reply.send({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    reply.status(500).send({ message: 'Failed to delete post' });
  }
};
