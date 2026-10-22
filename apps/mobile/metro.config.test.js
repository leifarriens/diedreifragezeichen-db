import { createRequire } from "node:module";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

const require = createRequire(import.meta.url);
const config = require("./metro.config.js");
const resolveRequest = config.resolver.resolveRequest;

function createContext(isESMImport) {
  const defaultResolver = vi.fn((_context, moduleName) => ({
    filePath: join(import.meta.dirname, "node_modules", moduleName, "index.js"),
    type: "sourceFile",
  }));
  const context = {
    isESMImport,
    originModulePath: join(import.meta.dirname, "src", "app", "_layout.tsx"),
    resolveRequest: defaultResolver,
    unstable_conditionNames: ["react-native"],
  };

  return { context, defaultResolver };
}

describe("NativeWind Metro resolution", () => {
  it("supports the CSS runtime's CommonJS TypeScript source entrypoint", () => {
    expect(config.resolver.sourceExts).toContain("cts");
  });

  it.each(["ios", "android", "web"])(
    "selects one CSS runtime source graph for imports and requires on %s",
    (platform) => {
      for (const isESMImport of [true, false]) {
        for (const moduleName of [
          "react-native-css",
          "react-native-css/native-internal",
          "react-native-css/components",
          "react-native-css/components/Text",
          "react-native-css/utilities",
        ]) {
          const { context, defaultResolver } = createContext(isESMImport);

          resolveRequest(context, moduleName, platform);

          const resolvedContext = defaultResolver.mock.calls[0][0];
          expect(resolvedContext.unstable_conditionNames).toEqual([
            "react-native",
            "source",
          ]);
          expect(resolvedContext.isESMImport).toBe(isESMImport);
          expect(context.unstable_conditionNames).toEqual(["react-native"]);
        }
      }
    },
  );

  it("also selects source when NativeWind redirects React Native primitives", () => {
    const { context, defaultResolver } = createContext(false);

    resolveRequest(context, "react-native", "ios");

    expect(defaultResolver.mock.calls.at(-1)?.[1]).toBe(
      "react-native-css/components",
    );
    expect(
      defaultResolver.mock.calls.at(-1)?.[0].unstable_conditionNames,
    ).toContain("source");
  });

  it.each(["react", "expo-router", "react-native-css-other"])(
    "preserves the default resolver context for %s",
    (moduleName) => {
      const { context, defaultResolver } = createContext(true);

      const resolution = resolveRequest(context, moduleName, "ios");

      expect(defaultResolver).toHaveBeenCalledExactlyOnceWith(
        context,
        moduleName,
        "ios",
      );
      expect(defaultResolver.mock.calls[0][0]).toBe(context);
      expect(resolution).toEqual(defaultResolver.mock.results[0].value);
    },
  );
});
