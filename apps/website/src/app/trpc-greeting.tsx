"use client";

import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

export function TRPCGreeting() {
  const trpc = useTRPC();
  const greeting = useQuery(trpc.hello.queryOptions({ text: "world" }));

  if (greeting.data === undefined) {
    return (
      <p role="status">
        {greeting.error
          ? "Could not load the tRPC greeting."
          : "Loading tRPC greeting..."}
      </p>
    );
  }

  return (
    <p>
      {greeting.data.greeting}
      {greeting.error ? " (showing cached data)" : ""}
    </p>
  );
}
