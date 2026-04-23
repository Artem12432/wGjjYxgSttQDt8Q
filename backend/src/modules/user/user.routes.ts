import type { FastifyInstance } from "fastify";
import { UserController } from "./user.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const controller = new UserController();

export async function userRoutes(app: FastifyInstance) {
  app.get(
    "/users",
    { preHandler: [authMiddleware] },
    controller.getAll.bind(controller)
  );

  app.get("/users/by-name/:name", controller.getByName.bind(controller));
  
  app.get("/users/:id", controller.getById.bind(controller));

  app.post("/users", controller.create.bind(controller));

  app.delete("/users/:id", controller.delete.bind(controller));
}
