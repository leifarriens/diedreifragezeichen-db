# DDFDB Mobile App

### Local development

Inspect the resolved preview configuration without building:

```bash
APP_ENV=preview pnpm --dir apps/mobile exec expo config --type public
```

Without `APP_ENV`, the app configuration defaults to `development`.

### EAS builds

```bash
# Development client
pnpm --dir apps/mobile dlx eas-cli@latest build --profile development --platform ios

# Internal preview build
pnpm --dir apps/mobile dlx eas-cli@latest build --profile preview --platform ios

# Store / TestFlight build
pnpm --dir apps/mobile dlx eas-cli@latest build --profile production --platform ios

# Submit a production iOS build
pnpm --dir apps/mobile dlx eas-cli@latest submit --profile production --platform ios
```

Use `--platform android` for Android builds. Internal iOS preview builds require registered devices; they are not TestFlight builds.

See [Expo's environment variable guide](https://docs.expo.dev/eas/environment-variables/usage/) and [app variants guide](https://docs.expo.dev/build-reference/variants/).
