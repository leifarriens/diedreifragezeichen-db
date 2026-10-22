import type { Folge, SearchOptions } from "@ddfdb/archiv/contracts";

import { afterEach, describe, expect, it, vi } from "vitest";

import { ArchivApi, ArchivApiError } from "./index";

const searchOptions: SearchOptions = {
  authors: ["Robert Arthur"],
  collections: ["serie", "specials"],
  roles: ["Justus Jonas"],
  script_authors: ["H. G. Francis"],
  speakers: ["Oliver Rohrbeck"],
};

const folge: Folge = {
  artwork: null,
  authors: ["Robert Arthur"],
  collection: "serie",
  cover: null,
  description: null,
  id: 1,
  number: 1,
  release_date: "1979-01-01",
  script_authors: ["H. G. Francis"],
  streaming: {
    spotify: { id: "example", link: "https://example.com/album/example" },
  },
  title: "Der Super-Papagei",
  total_duration: 3000,
  voice_roles: [{ role: "Justus Jonas", speaker: "Oliver Rohrbeck" }],
  weblink: null,
};

function setup(payload: unknown = folge) {
  const fetch = vi
    .fn()
    .mockResolvedValue(new Response(JSON.stringify(payload)));
  return {
    api: new ArchivApi({ baseUrl: "https://archive.example/api///", fetch }),
    fetch,
  };
}

afterEach(() => vi.unstubAllGlobals());

describe("ArchivApi", () => {
  it("fetches and validates an episode list with a normalized base URL", async () => {
    const { api, fetch } = setup([folge]);
    await expect(api.getFolgen()).resolves.toEqual([folge]);
    expect(fetch).toHaveBeenCalledWith("https://archive.example/api/folgen", {
      headers: { Accept: "application/json" },
      method: "GET",
    });
  });

  it("accepts empty lists", async () => {
    await expect(setup([]).api.getFolgen()).resolves.toEqual([]);
  });

  it("fetches and validates search options", async () => {
    const { api, fetch } = setup(searchOptions);
    await expect(api.getSearchOptions()).resolves.toEqual(searchOptions);
    expect(fetch).toHaveBeenCalledWith(
      "https://archive.example/api/search-options",
      {
        headers: { Accept: "application/json" },
        method: "GET",
      },
    );
  });

  it("accepts empty search option lists", async () => {
    const emptyOptions: SearchOptions = {
      authors: [],
      collections: [],
      roles: [],
      script_authors: [],
      speakers: [],
    };
    await expect(setup(emptyOptions).api.getSearchOptions()).resolves.toEqual(
      emptyOptions,
    );
  });

  it.each([
    null,
    {},
    { ...searchOptions, speakers: [1] },
    { ...searchOptions, script_authors: "author" },
    { ...searchOptions, collections: ["kids"] },
  ])("rejects malformed search options %j", async (payload) => {
    await expect(setup(payload).api.getSearchOptions()).rejects.toMatchObject({
      code: "invalid-response",
      message: "Archiv API returned an invalid search options response",
    });
  });

  it.each([1, "1", "id/with ?#&%"])("encodes episode ID %s", async (id) => {
    const { api, fetch } = setup();
    await expect(api.getFolgeById(id)).resolves.toEqual(folge);
    expect(fetch).toHaveBeenCalledWith(
      `https://archive.example/api/folgen/${encodeURIComponent(id)}`,
      expect.any(Object),
    );
  });

  it("accepts nullable metadata and empty streaming/credit collections", async () => {
    const payload: Folge = {
      ...folge,
      authors: [],
      collection: "specials",
      number: null,
      release_date: null,
      script_authors: [],
      streaming: {},
      total_duration: null,
      voice_roles: [],
    };
    await expect(setup(payload).api.getFolgeById(1)).resolves.toEqual(payload);
  });

  it("preserves additional response fields for forward compatibility", async () => {
    const payload = { ...folge, future_field: true };
    await expect(setup(payload).api.getFolgeById(1)).resolves.toEqual(payload);
  });

  it("uses global fetch when no adapter is supplied", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify([folge])));
    vi.stubGlobal("fetch", fetch);
    const api = new ArchivApi({ baseUrl: "https://archive.example" });
    await expect(api.getFolgen()).resolves.toEqual([folge]);
    expect(fetch).toHaveBeenCalledWith(
      "https://archive.example/folgen",
      expect.any(Object),
    );
  });

  it("passes each request's cancellation signal to the adapter", async () => {
    const { api, fetch } = setup();
    const signal = new AbortController().signal;
    await api.getFolgeById(1, { signal });
    expect(fetch).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({ signal }),
    );
    fetch.mockResolvedValueOnce(new Response("[]"));
    await api.getFolgen({ signal });
    expect(fetch).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({ signal }),
    );
    fetch.mockResolvedValueOnce(new Response(JSON.stringify(searchOptions)));
    await api.getSearchOptions({ signal });
    expect(fetch).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({ signal }),
    );
  });

  it.each([
    "",
    "not-a-url",
    "/relative",
    "ftp://archive.example",
    "https://user:password@archive.example",
    "https://archive.example?key=value",
    "https://archive.example#fragment",
  ])("rejects invalid base URL %s", (baseUrl) => {
    expect(() => new ArchivApi({ baseUrl })).toThrow(TypeError);
  });

  it.each([404, 429, 503])(
    "preserves HTTP status %i without parsing the body",
    async (status) => {
      const { api, fetch } = setup();
      fetch.mockResolvedValueOnce(new Response("not JSON", { status }));
      await expect(api.getFolgeById(1)).rejects.toMatchObject({
        code: "http",
        message: `Archiv API responded with HTTP ${status.toString()}`,
        name: "ArchivApiError",
        status,
      });
    },
  );

  it("wraps network failures and preserves their cause", async () => {
    const { api, fetch } = setup();
    const cause = new TypeError("Failed to fetch");
    fetch.mockRejectedValueOnce(cause);
    await expect(api.getFolgen()).rejects.toMatchObject({
      cause,
      code: "network",
      name: "ArchivApiError",
    });
  });

  it.each(["AbortError", "TimeoutError"])(
    "preserves transport %s",
    async (name) => {
      const { api, fetch } = setup();
      const cause = new DOMException("Request stopped", name);
      fetch.mockRejectedValueOnce(cause);
      await expect(api.getFolgen()).rejects.toBe(cause);
    },
  );

  it("preserves custom signal abort reasons", async () => {
    const { api, fetch } = setup();
    const controller = new AbortController();
    const cause = new Error("Cancelled");
    controller.abort(cause);
    fetch.mockRejectedValueOnce(cause);
    await expect(api.getFolgen({ signal: controller.signal })).rejects.toBe(
      cause,
    );
  });

  it.each(["invalid JSON", ""])("rejects invalid JSON: %s", async (body) => {
    const { api, fetch } = setup();
    fetch.mockResolvedValueOnce(new Response(body));
    await expect(api.getFolgen()).rejects.toMatchObject({
      cause: expect.any(SyntaxError) as unknown,
      code: "invalid-response",
      name: "ArchivApiError",
      status: 200,
    });
  });

  it("rejects successful responses without a body", async () => {
    const { api, fetch } = setup();
    fetch.mockResolvedValueOnce(new Response(null, { status: 204 }));
    await expect(api.getFolgen()).rejects.toBeInstanceOf(ArchivApiError);
  });

  it.each(["AbortError", "TimeoutError"])(
    "preserves %s while reading the response body",
    async (name) => {
      const { api, fetch } = setup();
      const response = new Response();
      const cause = new DOMException("Request stopped", name);
      vi.spyOn(response, "json").mockRejectedValueOnce(cause);
      fetch.mockResolvedValueOnce(response);
      await expect(api.getFolgen()).rejects.toBe(cause);
    },
  );

  it.each([null, {}, "invalid", 1])(
    "rejects non-array list payload %j",
    async (payload) => {
      await expect(setup(payload).api.getFolgen()).rejects.toMatchObject({
        code: "invalid-response",
        message: "Archiv API returned an invalid Folgen response",
      });
    },
  );

  it.each([
    ["id", "1"],
    ["id", 1.5],
    ["id", Number.MAX_SAFE_INTEGER + 1],
    ["title", null],
    ["number", "1"],
    ["number", 1.5],
    ["collection", "kids"],
    ["description", 1],
    ["release_date", false],
    ["total_duration", "3000"],
    ["total_duration", 0.5],
    ["streaming", null],
    ["streaming", []],
    ["streaming", { spotify: { id: "example" } }],
    ["streaming", { spotify: { id: 1, link: "https://example.com" } }],
    ["cover", {}],
    ["weblink", 1],
    ["artwork", []],
    ["authors", null],
    ["authors", [1]],
    ["script_authors", "author"],
    ["script_authors", [null]],
    ["voice_roles", null],
    ["voice_roles", [{ role: "Justus" }]],
    ["voice_roles", [{ role: 1, speaker: "Oliver" }]],
  ])(
    "rejects malformed field %s = %j in details and lists",
    async (field, value) => {
      const payload = { ...folge, [field]: value };
      await expect(setup(payload).api.getFolgeById(1)).rejects.toMatchObject({
        code: "invalid-response",
        message: "Archiv API returned an invalid Folge response",
      });
      await expect(
        setup([folge, payload]).api.getFolgen(),
      ).rejects.toMatchObject({
        code: "invalid-response",
        message: "Archiv API returned an invalid Folgen response",
      });
    },
  );

  it.each(Object.keys(folge))(
    "rejects missing contract field %s",
    async (field) => {
      const payload = Object.fromEntries(
        Object.entries(folge).filter(([key]) => key !== field),
      );
      await expect(setup(payload).api.getFolgeById(1)).rejects.toMatchObject({
        code: "invalid-response",
      });
    },
  );

  it.each([null, [], "invalid", 1])(
    "rejects non-object detail payload %j",
    async (payload) => {
      await expect(setup(payload).api.getFolgeById(1)).rejects.toMatchObject({
        code: "invalid-response",
      });
    },
  );
});
