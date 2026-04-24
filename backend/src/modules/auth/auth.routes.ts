import type { FastifyInstance } from "fastify";
import { AuthController } from "./auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const controller = new AuthController();

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/register", controller.register.bind(controller));
  app.post("/auth/login", controller.login.bind(controller));
  app.post("/auth/refresh", controller.refresh.bind(controller));
  app.post("/auth/logout", controller.logout.bind(controller));
  app.get(
    "/auth/me",
    { preHandler: [authMiddleware] },
    controller.me.bind(controller)
  );
}
