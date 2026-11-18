import tailwindcss from "@tailwindcss/postcss";

/**
 * Expo resolves string plugin names from the app root, where pnpm does not
 * expose this package's dependencies. Pass the plugin instance instead.
 * Next.js requires string plugin names, so it uses `./postcss-config`.
 */
export default {
  plugins: [tailwindcss()],
};
