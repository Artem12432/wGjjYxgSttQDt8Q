import type { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export async function authMiddleware(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const auth = req.headers.authorization;

  if (!auth) {
    return reply.status(401).send({ error: "No token" });
  }

  if (!auth.startsWith("Bearer ")) {
    return reply.status(401).send({ error: "Invalid token format" });
  }

  const token = auth.split(" ")[1];

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { id: number; login: string };
    req.user = payload;
  } catch {
    return reply.status(401).send({ error: "Invalid token" });
  }
}
