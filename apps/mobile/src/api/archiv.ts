import type { Folge } from "@ddfdb/archiv/contracts";

import { filterReleasedFolgen } from "./filter-released-folgen";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

class ArchivApi {
  private baseUrl: string;

  constructor(baseUrl: string | undefined) {
    if (!baseUrl) {
      throw new Error("Invalid API URL");
    }

    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  public async getFolgeById(id: string) {
    return this.request<Folge>(`/folgen/${id}`);
  }

  public async getFolgen() {
    const folgen = await this.request<Folge[]>("/folgen");

    return filterReleasedFolgen(folgen);
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const { body, headers, method = "GET", ...customConfig } = options;

    const requestHeaders = new Headers(headers);
    if (!requestHeaders.has("Content-Type")) {
      requestHeaders.set("Content-Type", "application/json");
    }

    const config: RequestInit = {
      headers: requestHeaders,
      method,
      ...customConfig,
    };

    if (body !== undefined) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);

    if (!response.ok) {
      const errorData: unknown = await response
        .json()
        .catch((): unknown => ({}));
      const errorMessage =
        typeof errorData === "object" &&
        errorData !== null &&
        "message" in errorData &&
        typeof errorData.message === "string"
          ? errorData.message
          : undefined;
      throw new Error(
        errorMessage ?? `HTTP error! Status: ${String(response.status)}`,
      );
    }

    if (response.status === 204) {
      return null as T;
    }

    return response.json() as Promise<T>;
  }
}

export const archivApi = new ArchivApi(
  process.env.EXPO_PUBLIC_DDFDB_ARCHIV_API_URL,
);
