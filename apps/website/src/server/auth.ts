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
const baseURL =
  process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.BETTER_AUTH_URL;

export const auth = betterAuth({
  baseURL,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: false,
  },
  plugins: [emailOTP(createEmailOtpOptions(emailTransport)), expo()],
  secret: process.env.BETTER_AUTH_SECRET,
  session: {
    expiresIn: 60 * 60 * 24 * 90,
    updateAge: 60 * 60 * 24,
  },
  trustedOrigins: [
    ...(baseURL ? [baseURL] : []),
    "ddfdb://",
    "ddfdb-preview://",
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
  // Server Components cannot send a renewed session cookie to the browser.
  auth.api.getSession({
    headers: await headers(),
    query: { disableRefresh: true },
  }),
);

export const serverSessionGuard = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return session;
};
