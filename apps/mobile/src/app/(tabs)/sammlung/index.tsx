import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function SammlungScreen() {
  return (
    <>
      <Stack.Screen options={{ headerTitle: "Sammlung" }} />
      <View className="justify-center items-center flex-1">
        <Text>User</Text>
      </View>
    </>
  );
}
