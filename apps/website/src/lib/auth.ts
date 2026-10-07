import "server-only";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db, schema } from "@ddfdb/db";
import { betterAuth } from "better-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET,
});

export const getServerSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);

export const serverSessionGuard = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return session;
};
