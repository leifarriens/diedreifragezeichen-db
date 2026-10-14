import * as tailwindcssPlugin from "prettier-plugin-tailwindcss";

const config = {
  plugins: [tailwindcssPlugin],
  tailwindFunctions: ["tv", "cn", "cx"],
  tailwindStylesheet: "./src/app/globals.css",
};

export default config;
