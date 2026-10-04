import * as Haptics from "expo-haptics";

// eslint-disable-next-line turbo/no-undeclared-env-vars
const isIos = process.env.EXPO_OS === "ios";

/**
 * General button presses, opening a modal, or clicking a search icon.
 */
function button() {
  if (isIos) {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

function continuous() {
  if (isIos) {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
  }
}

/**
 * Deleting a single item.
 */
function deleteMinor() {
  if (isIos) {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
}

/**
 * Deleting a major item, or multiple at once.
 */
function destructive() {
  if (isIos) {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }
}

function error() {
  if (isIos) {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }
}

/**
 * Toggling a checkbox, wheel pickers, sliders, or changing sort direction.
 */
function selection() {
  if (isIos) {
    void Haptics.selectionAsync();
  }
}

function success() {
  if (isIos) {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }
}

function warning() {
  if (isIos) {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }
}

export const HapticFeedback = {
  button,
  continuous,
  deleteMinor,
  destructive,
  error,
  selection,
  success,
  warning,
} as const;
