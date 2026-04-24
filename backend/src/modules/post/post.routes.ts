import type { FastifyInstance } from "fastify";
import { PostController } from "./post.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const controller = new PostController();

export async function postRoutes(app: FastifyInstance) {
  app.get("/posts", controller.getAll.bind(controller));
  app.get("/posts/:id", controller.getById.bind(controller));
  app.post(
    "/posts",
    { preHandler: [authMiddleware] },
    controller.create.bind(controller)
  );
  app.delete(
    "/posts/:id",
    { preHandler: [authMiddleware] },
    controller.delete.bind(controller)
  );
}
