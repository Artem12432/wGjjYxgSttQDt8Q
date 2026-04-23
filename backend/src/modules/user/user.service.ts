import { UserRepository } from "./user.repository.js";

export class UserService {
  private repo = new UserRepository();

  getAllUsers() {
    return this.repo.findAll();
  }

  getUserById(id: number) {
    return this.repo.findById(id);
  }

  getUserByName(name: string){
    return this.repo.findByName(name);
  }

  createUser(data: { name: string; email: string }) {
    return this.repo.create(data);
  }

  deleteUser(id: number) {
    return this.repo.delete(id);
  }
}
