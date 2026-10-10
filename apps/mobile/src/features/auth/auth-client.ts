import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const configuredBaseUrl: unknown = process.env.EXPO_PUBLIC_DDFDB_API_URL;

if (typeof configuredBaseUrl !== "string" || !configuredBaseUrl) {
  throw new Error("EXPO_PUBLIC_DDFDB_API_URL must be configured");
}

const configuredScheme = Constants.expoConfig?.scheme;
const scheme = Array.isArray(configuredScheme)
  ? configuredScheme[0]
  : (configuredScheme ?? undefined);

export const authClient = createAuthClient({
  baseURL: configuredBaseUrl.replace(/\/+$/, ""),
  plugins: [
    expoClient({
      scheme,
      storage: SecureStore,
      storagePrefix: "ddfdb",
    }),
  ],
});
