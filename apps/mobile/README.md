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
eas build --profile development --platform ios

# Internal preview build
eas build --profile preview --platform ios

# Store / TestFlight build
eas build --profile production --platform ios

# Submit a production iOS build
eas submit --profile production --platform ios
```

Use `--platform android` for Android builds. Internal iOS preview builds require registered devices; they are not TestFlight builds.

### EAS updates to the preview branch

From `apps/mobile`:

```bash
APP_ENV=preview eas update --branch preview --environment preview --platform ios --message "Describe the update"
```

Test in a compatible preview build: fully close and reopen the app, allowing time to download, then repeat if needed. Native changes require a new build.

See [Expo's environment variable guide](https://docs.expo.dev/eas/environment-variables/usage/) and [app variants guide](https://docs.expo.dev/build-reference/variants/).
