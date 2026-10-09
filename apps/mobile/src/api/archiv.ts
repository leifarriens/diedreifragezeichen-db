import { ArchivApi } from "@ddfdb/client/archiv";

const archivApiUrl: unknown = process.env.EXPO_PUBLIC_DDFDB_ARCHIV_API_URL;

if (typeof archivApiUrl !== "string" || !archivApiUrl) {
  throw new Error("Invalid API URL");
}

export const archivApi = new ArchivApi({ baseUrl: archivApiUrl });
