# Agent Guidelines

Use `pnpm` for all package-manager commands. Run the commands below from the repository root.

## Generating packages

If you need to create a new package, use the Turbo generator instead of manually scaffolding it. Agents should pass both answers with `--args` to avoid interactive prompts:

```bash
pnpm turbo gen package --args ui internal
```

Replace `ui` with an unscoped name using lowercase letters, numbers, and hyphens. The second argument is the package type:

- `internal`: source imports, builds declarations only.
- `library`: builds JavaScript and declarations.
- `node`: builds runnable JavaScript.
- `no-build`: scripts or externally bundled code.

The generator creates `packages/<name>` with the repository's standard configs, applies the root package scope, runs `pnpm install`, and formats the generated files. For interactive terminal use, run `pnpm turbo gen package` without `--args`.

## Verification workflow

Documentation-only changes do not require targeted verification loops or the full verification suite. The requirements below apply when changes affect code or configuration.

- While implementing or fixing an issue, run targeted checks for the affected package and task. For test failures, narrow the run to the failing test file or test case when possible.
- For lint failures, try the affected package's autofix command first. Unrelated changes produced by lint autofix may be kept. Manually fix remaining issues only if they were caused by your current changes.
- After a fix, rerun the targeted check until issues caused by your changes are resolved. Do not rerun the full suite after every edit.
- Before finishing, run the full verification suite:

  ```bash
  pnpm turbo typecheck lint test build
  ```

- If the full suite reveals an issue caused by your changes, fix it using targeted checks, then rerun the full suite.
- Across all verification checks (typecheck, lint, test, and build), fix only issues caused by your current changes, including regressions in dependent packages. Investigate failures before attributing them; do not assume a failure is pre-existing just because it occurs in an unchanged file. Except for changes produced by lint autofix as allowed above, leave unrelated or pre-existing issues untouched and report them, along with any checks that failed or could not run. Do not claim verification passed when it did not.

## Targeted commands

Replace `@la/core` with the affected package's actual `name` from its `package.json`.

```bash
pnpm turbo --filter=@la/core lint -- --fix
pnpm turbo --filter=@la/core lint
```
