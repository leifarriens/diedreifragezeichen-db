import { Host, RNHostView } from "@expo/ui";
import { Button, ContextMenu } from "@expo/ui/swift-ui";
import { disabled } from "@expo/ui/swift-ui/modifiers";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { useUpdateFolgenBookmark } from "@/features/bookmarks/use-bookmarks";
import { useUpdateFolgenListenStatus } from "@/features/listened/use-listened";
import { FolgenRatingSheet } from "@/features/ratings/folgen-rating-button";
import { HapticFeedback } from "@/lib/haptic-feedback";

import type { FolgenGridContextMenuProps } from "./folgen-grid-context-menu.types";

export function FolgenGridContextMenu({
  children,
  folgeId,
  folgenTitle,
  hasListened,
  isBookmarked,
  userRating,
}: FolgenGridContextMenuProps) {
  const [isRatingSheetOpen, setIsRatingSheetOpen] = useState(false);
  const { isAuthenticated, isPending: isAuthPending } = useAuth();
  const router = useRouter();
  const {
    addBookmarkMutation,
    isLoading: isBookmarkLoading,
    removeBookmarkMutation,
  } = useUpdateFolgenBookmark();
  const {
    isLoading: isListenedLoading,
    markFolgeAsListenedMutation,
    markFolgeAsNotListenedMutation,
  } = useUpdateFolgenListenStatus();

  function handleBookmark() {
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

  function handleListened() {
    if (!isAuthenticated) {
      router.navigate("/login");
      return;
    }

    HapticFeedback.button();
    if (hasListened) {
      markFolgeAsNotListenedMutation.mutate({ folgeId });
    } else {
      markFolgeAsListenedMutation.mutate({ folgeId });
    }
  }

  function handleRating() {
    if (!isAuthenticated) {
      router.navigate("/login");
      return;
    }

    HapticFeedback.button();
    setIsRatingSheetOpen(true);
  }

  return (
    <>
      <Host style={{ width: "100%" }}>
        <ContextMenu>
          <ContextMenu.Items>
            <Button
              label={isBookmarked ? "Lesezeichen entfernen" : "Lesezeichen setzen"}
              modifiers={[disabled(isAuthPending || isBookmarkLoading)]}
              onPress={handleBookmark}
              systemImage={isBookmarked ? "bookmark.fill" : "bookmark"}
            />
            <Button
              label={hasListened ? "Als ungehört markieren" : "Als gehört markieren"}
              modifiers={[disabled(isAuthPending || isListenedLoading)]}
              onPress={handleListened}
              systemImage={hasListened ? "checkmark.circle.fill" : "checkmark.circle"}
            />
            <Button
              label={userRating === null ? "Bewerten" : "Bewertung ändern"}
              modifiers={[disabled(isAuthPending)]}
              onPress={handleRating}
              systemImage="star"
            />
          </ContextMenu.Items>
          <ContextMenu.Trigger>
            <RNHostView matchContents={{ vertical: true }}>
              <View>{children}</View>
            </RNHostView>
          </ContextMenu.Trigger>
        </ContextMenu>
      </Host>

      {isRatingSheetOpen ? (
        <FolgenRatingSheet
          currentRating={userRating}
          folgeId={folgeId}
          folgenTitle={folgenTitle}
          isOpen
          onClose={() => {
            setIsRatingSheetOpen(false);
          }}
        />
      ) : null}
    </>
  );
}
