import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../db/prisma.js";

const JWT_SECRET = "super-secret-key";

export class AuthService {
  async register(data: {
    login: string;
    email: string;
    password: string;
    name: string;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        login: data.login,
        email: data.email,
        name: data.name,
        password: hashedPassword,
      },
    });

    return {
      id: user.id,
      login: user.login,
      email: user.email,
      name: user.name,
    };
  }

  async login(data: { login: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { login: data.login },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isValid = await bcrypt.compare(data.password, user.password);

    if (!isValid) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      { id: user.id, login: user.login },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { token };
  }
}
