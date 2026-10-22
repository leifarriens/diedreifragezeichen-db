import { caller } from "@/trpc/server";

export const getMe = () => caller.user.me();
