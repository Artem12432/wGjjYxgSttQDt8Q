import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../db/prisma.js";
import { env } from "../../config/env.js";

export class AuthService {
  async login(data: { login: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { login: data.login } });
    if (!user) throw new Error("User not found");
    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) throw new Error("Invalid password");
    const accessToken = jwt.sign(
      { id: user.id, login: user.login },
      env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id },
    });
    return { accessToken, refreshToken };
  }

  async refresh(token: string) {
    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as { id: number };
    const stored = await prisma.refreshToken.findFirst({
      where: { token, userId: payload.id },
    });
    if (!stored) throw new Error("Invalid refresh token");
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) throw new Error("User not found");
    const accessToken = jwt.sign(
      { id: user.id, login: user.login },
      env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    return { accessToken };
  }

  async logout(token: string) {
    await prisma.refreshToken.deleteMany({ where: { token } });
  }

  async register(data: {
    login: string;
    email: string;
    password: string;
    name: string;
  }) {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ login: data.login }, { email: data.email }] },
    });
    if (existing) throw new Error("Login or email already taken");
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        login: data.login,
        email: data.email,
        name: data.name,
        password: hashedPassword,
      },
    });
    return { id: user.id, login: user.login, email: user.email, name: user.name };
  }

  async me(id: number) {
    const user = await prisma.user.findUnique({ where: { id }, include: {posts: true} });
    if (!user) throw new Error("User not found");
    return { id: user.id, login: user.login, email: user.email, name: user.name, posts: user.posts };
  }
}
