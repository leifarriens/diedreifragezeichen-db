import type { Folge } from "@ddfdb/archiv/contracts";

import { CACHE_DURATION } from "@/constants/cache";

const DEFAULT_ARCHIV_API_URL = "http://localhost:8080";
const REQUEST_TIMEOUT_MS = 8_000;

class ArchivApi {
  private get baseUrl(): string {
    return (
      this.configuredBaseUrl ??
      process.env.DDFDB_ARCHIV_API_URL ??
      DEFAULT_ARCHIV_API_URL
    ).replace(/\/+$/, "");
  }

  constructor(private readonly configuredBaseUrl?: string) {}

  public async getFolgeById(id: number | string): Promise<Folge> {
    const payload = await this.request(`/folgen/${encodeURIComponent(id)}`);
    const folge = normalizeFolge(payload);
    if (!folge) {
      throw new Error("Archiv API returned an invalid Folge response");
    }

    return folge;
  }

  public async getFolgen(): Promise<Folge[]> {
    const payload = await this.request("/folgen", CACHE_DURATION.ONE_DAY);
    if (!Array.isArray(payload)) {
      throw new Error("Archiv API returned an invalid Folgen response");
    }

    const folgen = payload.map(normalizeFolge);
    if (folgen.some((folge) => folge === null)) {
      throw new Error("Archiv API returned an invalid Folgen response");
    }

    return folgen.filter((folge): folge is Folge => folge !== null);
  }

  private async request(
    endpoint: string,
    revalidate: number = CACHE_DURATION.ONE_HOUR,
  ): Promise<unknown> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: { Accept: "application/json" },
      next: { revalidate },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(
        `Archiv API responded with HTTP ${response.status.toString()}`,
      );
    }

    return response.json() as Promise<unknown>;
  }
}

export const archivApi = new ArchivApi();

function getStreamingId(link: string): string {
  try {
    const pathSegments = new URL(link).pathname.split("/").filter(Boolean);
    const encodedId = pathSegments.at(-1) ?? "";

    try {
      return decodeURIComponent(encodedId);
    } catch {
      return encodedId;
    }
  } catch {
    return "";
  }
}

function isFolge(value: unknown): value is Folge {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "number" &&
    Number.isInteger(value.id) &&
    typeof value.title === "string" &&
    (value.number === null || typeof value.number === "number") &&
    (value.collection === "serie" || value.collection === "spezial") &&
    isNullableString(value.description) &&
    isNullableString(value.release_date) &&
    (value.total_duration === null ||
      typeof value.total_duration === "number") &&
    isRecord(value.streaming) &&
    Object.values(value.streaming).every(
      (service) =>
        isRecord(service) &&
        typeof service.id === "string" &&
        typeof service.link === "string",
    ) &&
    isNullableString(value.cover) &&
    isNullableString(value.weblink) &&
    isNullableString(value.artwork)
  );
}

function isNullableString(value: unknown): value is null | string {
  return value === null || typeof value === "string";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeFolge(value: unknown): Folge | null {
  if (isFolge(value)) return value;
  if (!isRecord(value) || "streaming" in value || !isRecord(value.links)) {
    return null;
  }

  const links = Object.entries(value.links).filter(
    (entry): entry is [string, string] => typeof entry[1] === "string",
  );
  if (links.length !== Object.keys(value.links).length) return null;

  const fields = Object.fromEntries(
    Object.entries(value).filter(([key]) => key !== "links"),
  );
  const normalized = {
    ...fields,
    streaming: Object.fromEntries(
      links.map(([service, link]) => [
        service,
        { id: getStreamingId(link), link },
      ]),
    ),
  };

  return isFolge(normalized) ? normalized : null;
}
