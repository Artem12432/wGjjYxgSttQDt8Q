import { prisma } from "../../db/prisma.js";

export class PostRepository {
  findAll() {
    return prisma.post.findMany({
      include: {
        user: true,
        tags: {
          include: { tag: true },
        },
      },
    });
  }

  findById(id: number) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        user: true,
        tags: {
          include: { tag: true },
        },
      },
    });
  }

  create(data: {
    title?: string;
    content?: string;
    imageUrl?: string;
    userId: number;
  }) {
    return prisma.post.create({
      data,
      include: {
        user: true,
        tags: {
          include: { tag: true },
        },
      },
    });
  }

  delete(id: number) {
    return prisma.post.delete({
      where: { id },
    });
  }
}
