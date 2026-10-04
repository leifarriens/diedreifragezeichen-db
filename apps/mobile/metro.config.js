const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

/** @type {import("expo/metro-config").MetroConfig} */
const config = getDefaultConfig(__dirname);

// react-native-css exposes its source component entrypoint as index.cts.
config.resolver.sourceExts.push("cts");

const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // The CSS runtime must use one module graph for imports and requires.
  // Mixing source, ESM and CommonJS builds splits its color variable registries.
  if (
    moduleName === "react-native-css" ||
    moduleName.startsWith("react-native-css/")
  ) {
    context = {
      ...context,
      unstable_conditionNames: [...context.unstable_conditionNames, "source"],
    };
  }

  return (defaultResolveRequest ?? context.resolveRequest)(
    context,
    moduleName,
    platform,
  );
};

module.exports = withNativewind(config);
