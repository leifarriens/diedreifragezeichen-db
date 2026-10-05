import type { ExternalPathString } from "expo-router";

export function isExternalHref(href: string): href is ExternalPathString {
  return /^[a-z][a-z\d+.-]*:.+/i.test(href) || href.startsWith("//");
}
