import type { PropsWithChildren } from "react";

import { useWindowDimensions, View } from "react-native";

export function FolgenListEmptyContainer({ children }: PropsWithChildren) {
  const { height } = useWindowDimensions();

  return (
    <View
      className="items-center justify-center px-16"
      style={{ height: height / 1.75 }}
    >
      {children}
    </View>
  );
}
