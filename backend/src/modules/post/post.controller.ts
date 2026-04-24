import type { FastifyRequest, FastifyReply } from "fastify";
import { PostService } from "./post.service.js";

const service = new PostService();

export class PostController {
  async getAll(req: FastifyRequest, reply: FastifyReply) {
    const posts = await service.getAllPosts();
    return reply.send(posts);
  }

  async getById(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const post = await service.getPostById(Number(req.params.id));

    if (!post) {
      return reply.status(404).send({ error: "Post not found" });
    }

    return reply.send(post);
  }

  async create(
    req: FastifyRequest<{
      Body: {
        title?: string;
        content?: string;
        imageUrl?: string;
      };
    }>,
    reply: FastifyReply
  ) {
    const userId = req.user!.id;

    const post = await service.createPost({
      ...req.body,
      userId,
    });

    return reply.send(post);
  }

  async delete(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    await service.deletePost(Number(req.params.id));
    return reply.send({ success: true });
  }
}
