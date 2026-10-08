# Agent Guidelines

Use `pnpm` for all package-manager commands. Run the commands below from the repository root.

## Verification workflow

- While implementing or fixing an issue, run targeted checks for the affected package and task. For test failures, narrow the run to the failing test file or test case when possible.
- For lint failures, try the affected package's autofix command first, then inspect the diff. Keep only changes related to your work; fix remaining issues manually.
- After a fix, rerun the targeted check until issues caused by your changes are resolved. Do not rerun the full suite after every edit.
- Before finishing, always run the full verification suite:

  ```bash
  pnpm turbo typecheck lint test build
  ```

- If the full suite reveals an issue caused by your changes, fix it using targeted checks, then rerun the full suite.
- Fix only issues caused by your current changes, including regressions in dependent packages. Investigate failures before attributing them; do not assume a failure is pre-existing just because it occurs in an unchanged file. Leave unrelated or pre-existing issues untouched and report them, along with any checks that failed or could not run. Do not claim verification passed when it did not.

## Targeted commands

Replace `@la/core` with the affected package's actual `name` from its `package.json`.

```bash
pnpm turbo --filter=@la/core lint -- --fix
pnpm turbo --filter=@la/core lint
```
