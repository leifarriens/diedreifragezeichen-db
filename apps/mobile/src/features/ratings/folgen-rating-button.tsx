import { FOLGEN_RATING_MAX, FOLGEN_RATING_STEP } from "@ddfdb/core";
import { BottomSheet, Button, Column, RNHostView } from "@expo/ui";
import { Slider } from "@expo/ui/swift-ui";
import { buttonStyle, controlSize } from "@expo/ui/swift-ui/modifiers";
import { useState } from "react";
import { Pressable } from "react-native";

import { FolgenRatingDisplay } from "./folgen-rating-display";
import { useUpdateRating, useUserFolgenRating } from "./hooks/use-ratings";

interface FolgenRatingButtonProps {
  folgeId: number;
  folgenTitle: string;
}

interface FolgenRatingSheetProps {
  currentRating: null | number;
  folgeId: number;
  folgenTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function FolgenRatingButton({
  folgeId,
  folgenTitle,
}: FolgenRatingButtonProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { isLoading, rating } = useUserFolgenRating(folgeId);

  return (
    <>
      <Pressable
        disabled={isLoading}
        onPress={() => {
          setIsSheetOpen(true);
        }}
      >
        <FolgenRatingDisplay
          folgenTitle={folgenTitle}
          size="lg"
          type="user"
          value={rating?.score ?? null}
        />
      </Pressable>

      <FolgenRatingSheet
        currentRating={rating?.score ?? null}
        folgeId={folgeId}
        folgenTitle={folgenTitle}
        isOpen={isSheetOpen}
        onClose={() => {
          setIsSheetOpen(false);
        }}
      />
    </>
  );
}

function FolgenRatingSheet({
  currentRating,
  folgeId,
  folgenTitle,
  isOpen,
  onClose,
}: FolgenRatingSheetProps) {
  const [draftValue, setDraftValue] = useState<null | number>(null);
  const localValue = draftValue ?? currentRating ?? 0;
  const canSubmit = draftValue && draftValue > 0;
  const { isLoading, ratingMutation } = useUpdateRating();

  function handleSubmit() {
    if (!canSubmit) return;
    ratingMutation.mutate({ folgeId, score: draftValue });
    onClose();
  }

  function handleDismiss() {
    setDraftValue(null);
    onClose();
  }

  return (
    <BottomSheet
      containerColor="#00000025"
      contentPadding={{ bottom: 36, left: 36, right: 36, top: 64 }}
      isPresented={isOpen}
      onDismiss={handleDismiss}
    >
      <Column alignment="center" spacing={48}>
        <RNHostView matchContents>
          <FolgenRatingDisplay
            folgenTitle={folgenTitle}
            size="xl"
            type="user"
            value={localValue}
          />
        </RNHostView>
        <Slider
          max={FOLGEN_RATING_MAX}
          min={0} // Using 0 instead of FOLGEN_RATING_MIN to allow for a "no rating" state
          onValueChange={setDraftValue}
          step={FOLGEN_RATING_STEP}
          value={localValue}
        />

        <Button
          disabled={!canSubmit || isLoading}
          label="Bewertung abgeben"
          modifiers={[buttonStyle("glass"), controlSize("large")]}
          onPress={handleSubmit}
        />
      </Column>
    </BottomSheet>
  );
}
