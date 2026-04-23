import type { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "./user.service.js";

const service = new UserService();

export class UserController {
  async getAll(req: FastifyRequest, reply: FastifyReply) {
    const users = await service.getAllUsers();
    return users;
  }

  async getById(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const id = Number(req.params.id);

    const user = await service.getUserById(id);

    if (!user) {
      return reply.status(404).send({ error: "User not found" });
    }

    return user;
  }

  async getByName(
    req: FastifyRequest<{ Params: { name: string }}>,
    reply: FastifyReply
  ) { 
    const user = await service.getUserByName(req.params.name);

    if (!user) {
     return reply.status(404).send({ error: "User not found"});
    }

    return user;
  }

  async create(
    req: FastifyRequest<{ Body: { name: string; email: string } }>,
    reply: FastifyReply
  ) {
    return service.createUser(req.body);
  }

  async delete(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const id = Number(req.params.id);
    return service.deleteUser(id);
  }
}
