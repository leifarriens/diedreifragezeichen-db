import { appRouter, createTRPCContext } from "@ddfdb/user-api";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { auth } from "@/server/auth";
import { bookmarkRepository } from "@/server/repositories/bookmark/bookmark.repository";
import { listenedRepository } from "@/server/repositories/listened/listened.repository";
import { ratingRepository } from "@/server/repositories/rating/rating.repository";

const allowedOrigins = new Set(
  (process.env.TRPC_CORS_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

const handler = async (req: Request) => {
  const response = await fetchRequestHandler({
    createContext: async () => {
      const session = await auth.api.getSession({ headers: req.headers });
      return createTRPCContext({
        bookmarks: bookmarkRepository,
        headers: req.headers,
        listened: listenedRepository,
        ratings: ratingRepository,
        user: session?.user ?? null,
      });
    },
    endpoint: "/api/trpc",
    req,
    router: appRouter,
  });

  return withCors(response, req);
};

export function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin || !allowedOrigins.has(origin)) {
    return new Response(null, { status: 403 });
  }

  return new Response(null, {
    headers: corsHeaders(origin),
    status: 204,
  });
}

export { handler as GET, handler as POST };

function corsHeaders(origin: string) {
  return new Headers({
    "Access-Control-Allow-Headers": "Content-Type, trpc-accept",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Max-Age": "600",
    Vary: "Origin",
  });
}

function withCors(response: Response, req: Request) {
  const origin = req.headers.get("origin");
  if (!origin || !allowedOrigins.has(origin)) {
    return response;
  }

  const headers = new Headers(response.headers);
  const vary = headers.get("Vary");
  headers.set("Vary", vary ? `${vary}, Origin` : "Origin");

  for (const [name, value] of corsHeaders(origin)) {
    if (name !== "Vary") {
      headers.set(name, value);
    }
  }

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}
