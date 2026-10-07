"use client";

import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/use-auth";
import { useUserBookmarks } from "@/lib/use-user-bookmarks";

import { useUpdateFolgenBookmark } from "./use-folgen-bookmark";

interface FolgenBookmarkButtonProps {
  folgeId: number;
  isBookmarked: boolean;
  size?: number;
}

export function FolgenBookmarkButton({
  folgeId,
  isBookmarked,
  size,
}: FolgenBookmarkButtonProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { isLoading, toggleBookmark } = useUpdateFolgenBookmark(
    folgeId,
    isBookmarked,
  );

  const iconStyle = { height: size, width: size };

  function handleClick() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    toggleBookmark();
  }

  return (
    <button
      className="cursor-pointer text-neutral-200 transition-all hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:scale-110"
      disabled={isLoading}
      onClick={handleClick}
      type="button"
    >
      {isBookmarked ? (
        <svg
          fill="currentColor"
          height="32"
          style={iconStyle}
          viewBox="0 0 256 256"
          width="32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Z"></path>
        </svg>
      ) : (
        <svg
          fill="currentColor"
          height="32"
          style={iconStyle}
          viewBox="0 0 256 256"
          width="32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,177.57-51.77-32.35a8,8,0,0,0-8.48,0L72,209.57V48H184Z"></path>
        </svg>
      )}
    </button>
  );
}

export function FolgenBookmarkButtonForFolge({ folgeId }: { folgeId: number }) {
  const { data: userBookmarks } = useUserBookmarks();

  return (
    <FolgenBookmarkButton
      folgeId={folgeId}
      isBookmarked={
        userBookmarks?.some((bookmark) => bookmark.folgeId === folgeId) ?? false
      }
    />
  );
}
