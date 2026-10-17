import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const repositoryRoot = process.cwd();
const templatesDirectory = path.join(
  repositoryRoot,
  "turbo/generators/templates",
);
const rootPackage = JSON.parse(
  readFileSync(path.join(repositoryRoot, "package.json"), "utf8"),
);
const packageScope = rootPackage.name.split("/")[0];

const buildConfigurations = {
  internal: "build-types",
  library: "build-lib",
  node: "build-node",
};

export default function generator(plop) {
  plop.setHelper("packageScope", () => packageScope);
  plop.setHelper("eq", (left, right) => left === right);
  plop.setHelper("buildConfig", (kind) => buildConfigurations[kind]);

  plop.setGenerator("package", {
    description: "Create a TypeScript package in packages/",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Package name (without scope):",
        validate: (name) => {
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
            return "Use lowercase letters, numbers, and hyphens (for example, billing-core).";
          }

          const packageDirectory = path.join(repositoryRoot, "packages", name);
          if (existsSync(packageDirectory)) {
            return `The package directory already exists: ${packageDirectory}`;
          }

          return true;
        },
      },
      {
        type: "list",
        name: "kind",
        message: "Package type:",
        choices: [
          {
            name: "Internal library (imports source, builds declarations only)",
            value: "internal",
          },
          {
            name: "Compiled library (builds JavaScript and declarations)",
            value: "library",
          },
          {
            name: "Node.js application (builds runnable JavaScript)",
            value: "node",
          },
          {
            name: "No-build package (scripts or externally bundled code)",
            value: "no-build",
          },
        ],
      },
    ],
    actions: (answers) => {
      const destination = path.join(
        repositoryRoot,
        "packages",
        "{{kebabCase name}}",
      );
      const actions = [
        {
          type: "addMany",
          destination,
          base: templatesDirectory,
          templateFiles: [
            path.join(templatesDirectory, "eslint.config.mjs.hbs"),
            path.join(templatesDirectory, "package.json.hbs"),
            path.join(templatesDirectory, "tsconfig.json.hbs"),
            path.join(templatesDirectory, "vitest.config.ts.hbs"),
            path.join(templatesDirectory, "src/index.ts.hbs"),
          ],
          globOptions: {},
          stripExtensions: ["hbs"],
        },
      ];

      if (answers.kind !== "no-build") {
        actions.push({
          type: "add",
          path: path.join(destination, "tsconfig.build.json"),
          templateFile: path.join(
            templatesDirectory,
            "tsconfig.build.json.hbs",
          ),
        });
      }

      if ("name" in answers && typeof answers.name === "string") {
        actions.push((answers) => {
          if ("name" in answers && typeof answers.name === "string") {
            execSync("pnpm i", { stdio: "inherit" });
            execSync(
              `pnpm prettier ./packages/${answers.name}/** --write --log-level silent`,
              {
                stdio: "inherit",
              },
            );
          }
        });
      }

      return actions;
    },
  });
}
