// prisma.config.ts
import { defineConfig, env } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  datasource: {
    url: env("DATABASE_URL"),
  },
  seed: {
    paths: ["./prisma/seed.js"],
  },
});