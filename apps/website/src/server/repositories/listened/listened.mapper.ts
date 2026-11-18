import type { schema } from "@ddfdb/db";
import type { ListenedFolge } from "@ddfdb/user-api";

type ListenedSelectRow = Pick<
  typeof schema.listened.$inferSelect,
  "createdAt" | "folgeId"
>;

export function toListenedResponse({
  createdAt,
  folgeId,
}: ListenedSelectRow): ListenedFolge {
  return {
    createdAt: createdAt.toISOString(),
    folgeId,
  };
}
