import type { ConfigContext, ExpoConfig } from "@expo/config";

import { version } from "./package.json";

interface EnvironmentConfig {
  associatedDomains: string[];
  bundleIdentifier: string;
  name: string;
  packageName: string;
  scheme: string;
}

type EnvType = "development" | "production";

const PROJECT_SLUG = "ddfdb";
const OWNER = "leifarriens";

const APP_NAME = "DDFDB";
const APP_SCHEME = "ddfdb";
const IOS_BUNDLE_IDENTIFIER = "de.leifarriens.ddfdb";
const ANDROID_PACKAGE_NAME = "de.leifarriens.ddfdb";

export default ({ config }: ConfigContext): ExpoConfig => {
  const APP_ENV = getAppEnv();
  const { associatedDomains, bundleIdentifier, name, packageName, scheme } =
    getEnvironmentConfig(APP_ENV);

  return {
    ...config,
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        backgroundImage: "./assets/images/android-icon-background.png",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      package: packageName,
      predictiveBackGestureEnabled: false,
    },
    experiments: {
      reactCompiler: true,
      typedRoutes: true,
    },
    ios: {
      associatedDomains,
      bundleIdentifier,
      icon: "./assets/expo.icon",
      userInterfaceStyle: "dark",
    },
    name,
    owner: OWNER,
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#208AEF",
          image: "./assets/images/splash-icon.png",
          imageWidth: 76,
        },
      ],
    ],
    scheme,
    slug: PROJECT_SLUG,
    version,
  };
};

function getAppEnv(): EnvType {
  const APP_ENV: unknown = process.env.APP_ENV;

  if (APP_ENV === undefined || APP_ENV === "") {
    return "development";
  }

  if (typeof APP_ENV !== "string") {
    throw new Error("Invalid APP_ENV: expected development or production");
  }

  if (APP_ENV !== "development" && APP_ENV !== "production") {
    throw new Error(`Invalid APP_ENV: ${APP_ENV}`);
  }

  return APP_ENV;
}

function getEnvironmentConfig(env: EnvType): EnvironmentConfig {
  switch (env) {
    case "production": {
      return {
        associatedDomains: [],
        bundleIdentifier: IOS_BUNDLE_IDENTIFIER,
        name: APP_NAME,
        packageName: ANDROID_PACKAGE_NAME,
        scheme: APP_SCHEME,
      };
    }
    default: {
      return {
        associatedDomains: [],
        bundleIdentifier: `${IOS_BUNDLE_IDENTIFIER}.dev`,
        name: `${APP_NAME} Development`,
        packageName: `${ANDROID_PACKAGE_NAME}.dev`,
        scheme: `${APP_SCHEME}-dev`,
      };
    }
  }
}
