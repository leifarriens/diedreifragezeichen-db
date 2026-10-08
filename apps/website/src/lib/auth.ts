import "server-only";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { expo } from "@better-auth/expo";
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
  plugins: [expo()],
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
    "ddfdb://",
    ...(process.env.NODE_ENV === "development"
      ? ["ddfdb-dev://", "exp://", "exp://**", "exp://192.168.*.*:*/**"]
      : []),
  ],
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
