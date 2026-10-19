import { Icon } from "@expo/ui";
import { useRouter } from "expo-router";

import { UIButton } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { HapticFeedback } from "@/lib/haptic-feedback";

import { useUpdateFolgenBookmark } from "./use-bookmarks";

interface FolgenBookmarkButtonProps {
  folgeId: number;
  folgeTitle: string;
  isBookmarked: boolean;
}

export function FolgenBookmarkButton({
  folgeId,
  folgeTitle,
  isBookmarked,
}: FolgenBookmarkButtonProps) {
  const { isAuthenticated, isPending } = useAuth();
  const router = useRouter();

  const { addBookmarkMutation, isLoading, removeBookmarkMutation } =
    useUpdateFolgenBookmark();

  function handlePress() {
    if (!isAuthenticated) {
      router.navigate("/login");
      return;
    }

    HapticFeedback.button();
    if (isBookmarked) {
      removeBookmarkMutation.mutate({ folgeId });
    } else {
      addBookmarkMutation.mutate({ folgeId });
    }
  }

  return (
    <UIButton
      accessibilityLabel={
        isBookmarked
          ? `Gespeichert: ${folgeTitle}`
          : `Nicht gespeichert: ${folgeTitle}`
      }
      disabled={isLoading || isPending}
      icon={
        isBookmarked
          ? Icon.select({
              android: import("@expo/material-symbols/bookmark_added.xml"),
              ios: "bookmark.fill",
            })
          : Icon.select({
              android: import("@expo/material-symbols/bookmark_add.xml"),
              ios: "bookmark",
            })
      }
      iconOnly
      isLoading={true}
      label={isBookmarked ? "Lesezeichen entfernen" : "Als Lesezeichen merken"}
      onPress={handlePress}
    />
  );
}
