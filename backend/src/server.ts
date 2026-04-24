import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import bcrypt from "bcrypt";

import { userRoutes } from "./modules/user/user.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { prisma } from "./db/prisma.js";
import { postRoutes } from "./modules/post/post.routes.js";

const app = Fastify();


async function seedTestData() {

  let user = await prisma.user.findUnique({
    where: { login: "test" },
  });

  if (!user) {
    const hashedPassword = await bcrypt.hash("test", 10);

    user = await prisma.user.create({
      data: {
        login: "test",
        email: "test@test.com",
        name: "Test User",
        password: hashedPassword,
      },
    });

    console.log("✅ Test user created");
  }

  const tagNames = ["frontend", "backend", "prisma", "fastify"];

  const tags = await Promise.all(
    tagNames.map(async (name) => {
      return prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name },
      });
    })
  );

  console.log("✅ Tags ready");

  const postsCount = await prisma.post.count({
    where: { userId: user.id },
  });

  let posts: any[] = [];

  if (postsCount === 0) {
    posts = await Promise.all([
      prisma.post.create({
        data: {
          title: "Hello World",
          content: "My first post",
          userId: user.id,
        },
      }),
      prisma.post.create({
        data: {
          title: "Fastify API",
          content: "Backend is working",
          userId: user.id,
        },
      }),
      prisma.post.create({
        data: {
          title: "Prisma Relations",
          content: "Many-to-many example",
          userId: user.id,
        },
      }),
    ]);

    console.log("✅ Posts created");
  } else {
    posts = await prisma.post.findMany({
      where: { userId: user.id },
    });

    console.log("ℹ️ Posts already exist");
  }

  const relationsExist = await prisma.postTag.count();

  if (relationsExist === 0) {
    await prisma.postTag.createMany({
      data: [
        {
          postId: posts[0].id,
          tagId: tags[0].id,
        },
        {
          postId: posts[0].id,
          tagId: tags[1].id,
        },
        {
          postId: posts[1].id,
          tagId: tags[1].id,
        },
        {
          postId: posts[1].id,
          tagId: tags[2].id,
        },
        {
          postId: posts[2].id,
          tagId: tags[2].id,
        },
        {
          postId: posts[2].id,
          tagId: tags[3].id,
        },
      ],
    });

    console.log("✅ PostTag relations created");
  } else {
    console.log("ℹ️ PostTag relations already exist");
  }
}

async function registerPlugins() {
  await app.register(cors, {
    origin: "http://localhost:5173",
    credentials: true,
  });
}


async function registerRoutes() {
  await app.register(userRoutes);
  await app.register(authRoutes);
  await app.register(postRoutes);
}


function setupErrorHandler() {
  app.setErrorHandler((error, req, reply) => {
    const status = (error as any).statusCode ?? 500;

    reply.status(status).send({
      error: error.message,
    });
  });
}


async function start() {
  try {
    await registerPlugins();
    await registerRoutes();
    setupErrorHandler();

    await app.listen({ port: 3301 });

    console.log("🚀 Server running on http://localhost:3301");

    await seedTestData();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
