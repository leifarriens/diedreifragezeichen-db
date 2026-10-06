import * as tailwindcssPlugin from "prettier-plugin-tailwindcss";

export default {
  plugins: [tailwindcssPlugin],
  tailwindFunctions: ["tv", "cn", "cx"],
  tailwindStylesheet: "./src/app/globals.css",
};
