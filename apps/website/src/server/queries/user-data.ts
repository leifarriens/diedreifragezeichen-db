import { caller } from "@/trpc/server";

export const getMyBookmarks = () => caller.bookmarks.getMyBookmarks();

export const getMyListenedFolgen = () => caller.listened.getMyListenedFolgen();

export const getMyRatings = () => caller.ratings.getMyRatings();

export const getMe = () => caller.user.me();
