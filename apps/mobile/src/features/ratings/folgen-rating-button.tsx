import { BottomSheet, Button, Column, Slider, Text } from "@expo/ui";
import { useState } from "react";
import { useColorScheme } from "react-native";

import { UIButton } from "@/components/ui/button";

export function FolgenRatingButton() {
  const [isPresented, setIsPresented] = useState(false);
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === "dark" ? "#FFFFFF" : "#000000" };
  const [value, setValue] = useState(0);

  return (
    <>
      <UIButton
        icon="star"
        iconOnly
        label="Folgen bewerten"
        onPress={() => {
          setIsPresented(true);
        }}
      />
      <BottomSheet
        contentPadding={28}
        isPresented={isPresented}
        onDismiss={() => {
          setIsPresented(false);
        }}
      >
        <Column spacing={36}>
          <Text textStyle={{ ...ink, fontSize: 18, fontWeight: "700" }}>
            Sheet contents
          </Text>
          <Text textStyle={ink}>Drag down or tap the overlay to dismiss.</Text>
          <Slider
            max={6}
            min={0}
            onValueChange={setValue}
            // step={1}
            value={value}
          />
          <Button
            label="Close"
            onPress={() => {
              setIsPresented(false);
            }}
          />
        </Column>
      </BottomSheet>
    </>
  );
}
