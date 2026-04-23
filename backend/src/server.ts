import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { userRoutes } from "./modules/user/user.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { prisma } from "./db/prisma.js";
import bcrypt from "bcrypt";

const app = Fastify();

async function seedTestUser() {
  const existing = await prisma.user.findUnique({
    where: { login: "test" },
  });

  if (!existing) {
    const hashedPassword = await bcrypt.hash("test", 10);
    await prisma.user.create({
      data: {
        login: "test",
        email: "test@test.com",
        name: "Test User",
        password: hashedPassword,
      },
    });
    console.log("Test user created (login: test, password: test)");
  } else {
    console.log("Test user already exists");
  }
}

app.register(cors, {
  origin: "http://localhost:5173",
  credentials: true,
});

app.register(userRoutes);
app.register(authRoutes);

app.setErrorHandler((error, req, reply) => {
  const status = (error as any).statusCode ?? 500;
  reply.status(status).send({ error: error.message });
});

app.listen({ port: 3301 }, async (err, addr) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("🚀 Server running on", addr);
  await seedTestUser();
})
