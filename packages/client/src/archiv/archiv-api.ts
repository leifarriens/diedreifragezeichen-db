import type { Folge, SearchOptions } from "@ddfdb/archiv/contracts";

export type ArchivApiErrorCode = "http" | "invalid-response" | "network";

export interface ArchivApiOptions {
  baseUrl: string;
  /** Wrap fetch here to supply platform-specific caching, headers, or timeouts. */
  fetch?: ArchivFetch;
}

export type ArchivFetch = (
  url: string,
  options: RequestInit,
) => Promise<Response>;

export interface ArchivRequestOptions {
  signal?: AbortSignal;
}

/** A framework-independent client for the current Archiv service contract. */
export class ArchivApi {
  private readonly baseUrl: string;
  private readonly fetch: ArchivFetch;

  constructor(options: ArchivApiOptions) {
    const url = new URL(options.baseUrl);
    if (
      (url.protocol !== "http:" && url.protocol !== "https:") ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    ) {
      throw new TypeError(
        "Archiv API base URL must be an HTTP(S) URL without credentials, query, or fragment",
      );
    }

    this.baseUrl = url.toString().replace(/\/+$/, "");
    this.fetch = options.fetch ?? ((url, init) => globalThis.fetch(url, init));
  }

  public async getFolgeById(
    id: number | string,
    options: ArchivRequestOptions = {},
  ): Promise<Folge> {
    const payload = await this.request(
      `/folgen/${encodeURIComponent(id)}`,
      options,
    );
    if (!isFolge(payload)) {
      throw new ArchivApiError(
        "Archiv API returned an invalid Folge response",
        "invalid-response",
      );
    }
    return payload;
  }

  public async getFolgen(options: ArchivRequestOptions = {}): Promise<Folge[]> {
    const payload = await this.request("/folgen", options);
    if (!Array.isArray(payload) || !payload.every(isFolge)) {
      throw new ArchivApiError(
        "Archiv API returned an invalid Folgen response",
        "invalid-response",
      );
    }
    return payload;
  }

  public async getSearchOptions(
    options: ArchivRequestOptions = {},
  ): Promise<SearchOptions> {
    const payload = await this.request("/search-options", options);
    if (!isSearchOptions(payload)) {
      throw new ArchivApiError(
        "Archiv API returned an invalid search options response",
        "invalid-response",
      );
    }
    return payload;
  }

  private async request(
    endpoint: string,
    options: ArchivRequestOptions,
  ): Promise<unknown> {
    let response: Response;
    try {
      response = await this.fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: { Accept: "application/json" },
        method: "GET",
      });
    } catch (cause) {
      // Preserve cancellation/timeout semantics for query libraries and adapters.
      if (
        options.signal?.aborted ||
        (cause instanceof Error &&
          (cause.name === "AbortError" || cause.name === "TimeoutError"))
      ) {
        throw cause;
      }
      throw new ArchivApiError(
        "Archiv API request failed",
        "network",
        undefined,
        { cause },
      );
    }

    if (!response.ok) {
      throw new ArchivApiError(
        `Archiv API responded with HTTP ${response.status.toString()}`,
        "http",
        response.status,
      );
    }

    try {
      const payload: unknown = await response.json();
      return payload;
    } catch (cause) {
      if (
        options.signal?.aborted ||
        (cause instanceof Error &&
          (cause.name === "AbortError" || cause.name === "TimeoutError"))
      ) {
        throw cause;
      }
      throw new ArchivApiError(
        "Archiv API returned an invalid JSON response",
        "invalid-response",
        response.status,
        { cause },
      );
    }
  }
}

export class ArchivApiError extends Error {
  constructor(
    message: string,
    public readonly code: ArchivApiErrorCode,
    public readonly status?: number,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "ArchivApiError";
  }
}

function isFolge(value: unknown): value is Folge {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "number" &&
    Number.isSafeInteger(value.id) &&
    typeof value.title === "string" &&
    isNullableInteger(value.number) &&
    (value.collection === "serie" || value.collection === "specials") &&
    isNullableString(value.description) &&
    isNullableString(value.releaseDate) &&
    isNullableInteger(value.totalDuration) &&
    isRecord(value.streaming) &&
    Object.values(value.streaming).every(
      (service) =>
        isRecord(service) &&
        typeof service.id === "string" &&
        typeof service.link === "string",
    ) &&
    isNullableString(value.cover) &&
    isNullableString(value.weblink) &&
    isNullableString(value.artwork) &&
    isStringArray(value.authors) &&
    isStringArray(value.scriptAuthors) &&
    Array.isArray(value.voiceRoles) &&
    value.voiceRoles.every(
      (credit: unknown) =>
        isRecord(credit) &&
        typeof credit.role === "string" &&
        typeof credit.speaker === "string",
    )
  );
}

function isNullableInteger(value: unknown): value is null | number {
  return (
    value === null || (typeof value === "number" && Number.isSafeInteger(value))
  );
}

function isNullableString(value: unknown): value is null | string {
  return value === null || typeof value === "string";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSearchOptions(value: unknown): value is SearchOptions {
  if (!isRecord(value)) return false;

  return (
    isStringArray(value.speakers) &&
    isStringArray(value.roles) &&
    isStringArray(value.authors) &&
    isStringArray(value.scriptAuthors) &&
    Array.isArray(value.collections) &&
    value.collections.every(
      (collection) => collection === "serie" || collection === "specials",
    )
  );
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item: unknown) => typeof item === "string")
  );
}
