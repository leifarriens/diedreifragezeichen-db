import { FOLGEN_RATING_MAX, FOLGEN_RATING_STEP } from "@ddfdb/core";
import { BottomSheet, Column, Text } from "@expo/ui";
import { Slider } from "@expo/ui/swift-ui";
import { useState } from "react";
import { useColorScheme } from "react-native";

import { UIButton } from "@/components/ui/button";

import { useUpdateRating, useUserFolgenRating } from "./hooks/use-ratings";

interface FolgenRatingButtonProps {
  folgeId: number;
}

interface FolgenRatingSheetProps {
  currentRating: null | number;
  folgeId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function FolgenRatingButton({ folgeId }: FolgenRatingButtonProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { isLoading, rating } = useUserFolgenRating(folgeId);

  return (
    <>
      <UIButton
        disabled={isLoading}
        {...(rating ? {} : { icon: "questionmark.diamond" })}
        iconOnly={!rating}
        label={rating ? rating.score.toString() : "Folgen bewerten"}
        onPress={() => {
          setIsSheetOpen(true);
        }}
      />

      <FolgenRatingSheet
        currentRating={rating?.score ?? null}
        folgeId={folgeId}
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

  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === "dark" ? "#FFFFFF" : "#000000" };

  return (
    <BottomSheet
      contentPadding={46}
      isPresented={isOpen}
      onDismiss={handleDismiss}
      snapPoints={["half"]}
    >
      <Column spacing={36}>
        <Text textStyle={{ ...ink, fontSize: 52, fontWeight: "700" }}>
          {`${localValue > 0 ? localValue.toString() : "?"} / 3`}
        </Text>

        <Slider
          max={FOLGEN_RATING_MAX}
          min={0} // Using 0 instead of FOLGEN_RATING_MIN to allow for a "no rating" state
          onValueChange={setDraftValue}
          step={FOLGEN_RATING_STEP}

          value={localValue}
        />
        <UIButton
          disabled={!canSubmit || isLoading}
          label="Bewertung abgeben"
          onPress={handleSubmit}
        />
      </Column>
    </BottomSheet>
  );
}
