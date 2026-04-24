import type { FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "./auth.service.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

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

  async refresh(
    req: FastifyRequest<{ Body: { refreshToken: string } }>,
    reply: FastifyReply
  ) {
    const result = await service.refresh(req.body.refreshToken);
    return reply.send(result);
  }

  async logout(
    req: FastifyRequest<{ Body: { refreshToken: string } }>,
    reply: FastifyReply
  ) {
    await service.logout(req.body.refreshToken);
    return reply.send({ message: "Logged out" });
  }

  async me(req: FastifyRequest, reply: FastifyReply) {
    const user = await service.me(req.user!.id);
    return reply.send(user);
  }
}
