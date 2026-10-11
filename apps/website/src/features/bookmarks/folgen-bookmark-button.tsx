"use client";

import { Toggle } from "@base-ui/react/toggle";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/ui/toast/toast";
import { useAuth } from "@/features/auth/use-auth";

import { useUpdateFolgenBookmark, useUserBookmarks } from "./use-bookmarks";

interface FolgenBookmarkButtonProps {
  folgeId: number;
  folgeTitle: string;
  isBookmarked: boolean;
  size?: number;
}

export function FolgenBookmarkButton({
  folgeId,
  folgeTitle,
  isBookmarked,
  size,
}: FolgenBookmarkButtonProps) {
  const { isAuthenticated, isPending } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const { addBookmarkMutation, isLoading, removeBookmarkMutation } =
    useUpdateFolgenBookmark();

  const iconStyle = { height: size, width: size };

  function handlePressedChange() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isBookmarked) {
      removeBookmarkMutation.mutate({ folgeId });
    } else {
      addBookmarkMutation.mutate(
        { folgeId },
        {
          onSuccess() {
            toast.add({
              title: `${folgeTitle} gespeichert`,
            });
          },
        },
      );
    }
  }

  return (
    <Toggle
      aria-label={
        isBookmarked
          ? `Gespeichert: ${folgeTitle}`
          : `Nicht gespeichert: ${folgeTitle}`
      }
      className="cursor-pointer"
      disabled={isLoading || isPending}
      onPressedChange={handlePressedChange}
      pressed={isBookmarked}
      render={(props, state) => {
        if (state.pressed) {
          return (
            <button type="button" {...props}>
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
            </button>
          );
        }

        return (
          <button type="button" {...props}>
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
          </button>
        );
      }}
    />
  );
}

export function FolgenBookmarkButtonForFolge({
  folgeId,
  folgeTitle,
}: {
  folgeId: number;
  folgeTitle: string;
}) {
  const { data: userBookmarks } = useUserBookmarks();

  return (
    <FolgenBookmarkButton
      folgeId={folgeId}
      folgeTitle={folgeTitle}
      isBookmarked={
        userBookmarks?.some((bookmark) => bookmark.folgeId === folgeId) ?? false
      }
    />
  );
}
