import "server-only";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { expo } from "@better-auth/expo";
import { db, schema } from "@ddfdb/db";
import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { createEmailOtpOptions } from "./email/email-otp";
import { createEmailTransport } from "./email/email-transport";

const emailTransport = createEmailTransport();

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: false,
  },
  plugins: [emailOTP(createEmailOtpOptions(emailTransport)), expo()],
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
    "ddfdb://",
    ...(process.env.NODE_ENV === "development"
      ? ["ddfdb-dev://", "exp://", "exp://**", "exp://192.168.*.*:*/**"]
      : []),
  ],
  user: {
    deleteUser: {
      enabled: true,
    },
  },
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
