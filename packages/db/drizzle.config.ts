import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set to generate or apply migrations");
}

export default defineConfig({
  casing: "snake_case",
  dbCredentials: {
    url: databaseUrl,
  },
  dialect: "postgresql",
  out: "./migrations",
  schema: "./src/schema/index.ts",
});
