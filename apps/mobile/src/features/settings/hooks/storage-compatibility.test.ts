import asyncStoragePackage from "@react-native-async-storage/async-storage/package.json";
import bundledNativeModules from "expo/bundledNativeModules.json";
import { expect, it } from "vitest";

it("uses the AsyncStorage version bundled in Expo Go", () => {
  expect(asyncStoragePackage.version).toBe(
    bundledNativeModules["@react-native-async-storage/async-storage"],
  );
});
