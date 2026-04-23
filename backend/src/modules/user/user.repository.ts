import { prisma } from "../../db/prisma.js";

export class UserRepository {
  findAll() {
    return prisma.user.findMany();
  }

  findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  findByName(name: string) {
    return prisma.user.findFirst({
      where: { name }
    })
  }

  create(data: { name: string; email: string }) {
    return prisma.user.create({
      data,
    });
  }

  delete(id: number) {
    return prisma.user.delete({
      where: { id },
    });
  }
}
