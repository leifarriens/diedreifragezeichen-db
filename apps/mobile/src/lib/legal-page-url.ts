export type LegalPage = "privacy" | "sources";

export function getLegalPageUrl(page: LegalPage): string {
  const baseUrl: unknown = process.env.EXPO_PUBLIC_DDFDB_API_URL;

  if (typeof baseUrl !== "string" || !baseUrl) {
    throw new Error("EXPO_PUBLIC_DDFDB_API_URL must be configured");
  }

  return new URL(`/legal/${page}`, baseUrl).toString();
}
