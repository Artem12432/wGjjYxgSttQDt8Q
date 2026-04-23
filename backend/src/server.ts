import Fastify from "fastify";
import { userRoutes } from "./modules/user/user.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";

const app = Fastify();

app.register(userRoutes);
app.register(authRoutes);

app.listen({ port: 3301 }, (err, addr) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log("🚀 Server running on", addr);
});
