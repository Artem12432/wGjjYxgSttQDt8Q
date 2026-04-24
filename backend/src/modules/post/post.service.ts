import { PostRepository } from "./post.repository.js";

export class PostService {
  private repo = new PostRepository();

  getAllPosts() {
    return this.repo.findAll();
  }

  getPostById(id: number) {
    return this.repo.findById(id);
  }

  createPost(data: {
    title?: string;
    content?: string;
    imageUrl?: string;
    userId: number;
  }) {
    return this.repo.create(data);
  }

  deletePost(id: number) {
    return this.repo.delete(id);
  }
}
