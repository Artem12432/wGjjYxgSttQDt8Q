import type { FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "./auth.service.js";

const service = new AuthService();

export class AuthController {
  async register(
    req: FastifyRequest<{
      Body: {
        login: string;
        email: string;
        password: string;
        name: string;
      };
    }>,
    reply: FastifyReply
  ) {
    const user = await service.register(req.body);
    return reply.send(user);
  }

  async login(
    req: FastifyRequest<{
      Body: { login: string; password: string };
    }>,
    reply: FastifyReply
  ) {
    const result = await service.login(req.body);
    return reply.send(result);
  }
}
