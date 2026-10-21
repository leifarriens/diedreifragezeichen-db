import { type APIRequestContext, expect, test } from "@playwright/test";

const expectIsoString = expect.stringMatching(
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
);

test.describe("GET /api/folgen", () => {
  test("returns a non-empty page of legacy episodes", async ({ request }) => {
    const response = await request.get("/api/folgen");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");

    const body: unknown = await response.json();

    expect(body).toMatchObject({
      items: expect.arrayContaining([
        expect.objectContaining(legacyApiFolgenSchema),
      ]),
      limit: 50,
      offset: 0,
      total: expect.any(Number),
    });
  });

  test("returns the search result for a query", async ({ request }) => {
    const response = await request.get("/api/folgen", {
      params: { query: "feuermond" },
    });

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");

    const body: unknown = await response.json();

    expect(body).toMatchObject({
      items: expect.arrayContaining([
        expect.objectContaining({
          name: expect.stringContaining("Feuermond"),
        }),
      ]),
    });
  });

  test("newly released folgen should return release_date in ISO format", async ({
    request,
  }) => {
    const response = await request.get("/api/folgen", {
      params: { query: "Meister des Lichts" },
    });

    expect(response.status()).toBe(200);

    const body: unknown = await response.json();

    expect(body).toMatchObject({
      items: expect.arrayContaining([
        expect.objectContaining({
          release_date: expectIsoString,
        }),
      ]),
    });
  });

  test("returns 400 higher limit parameter", async ({ request }) => {
    const response = await request.get("/api/folgen", {
      params: { limit: 200 },
    });

    expect(response.status()).toBe(400);
  });

  test("return 400 for negative offset", async ({ request }) => {
    const response = await request.get("/api/folgen", {
      params: { offset: -1 },
    });

    expect(response.status()).toBe(400);
  });

  test("returns 200 even when deprecated apikey is provided", async ({
    request,
  }) => {
    const response = await request.get("/api/folgen?limit=1", {
      params: { apikey: "test-api-key" },
    });

    expect(response.status()).toBe(200);
  });
});

test.describe("GET /api/folgen/{legacyId}", () => {
  test("returns a folge by its legacy id", async ({ request }) => {
    const legacyId = await findFolgenLegacyIdBySearchQuery(
      request,
      "feuermond",
    );

    const response = await request.get(`/api/folgen/${legacyId}`);

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");

    const body = (await response.json()) as { _id: string };

    expect(body._id).toBe(legacyId);
    expect(body).toMatchObject(legacyApiFolgenSchema);
  });
});

test.describe("GET /api/sync/folgen with apikey", () => {
  test("returns 401 when no authorization is provided", async ({ request }) => {
    const response = await request.get("/api/sync/folgen");

    expect(response.status()).toBe(401);
  });

  test("returns 401 when invalid authorization is provided", async ({
    request,
  }) => {
    const response = await request.get("/api/sync/folgen", {
      headers: { Authorization: "InvalidToken" },
    });

    expect(response.status()).toBe(401);
  });
});

async function findFolgenLegacyIdBySearchQuery(
  request: APIRequestContext,
  query: string,
): Promise<string> {
  const response = await request.get("/api/folgen", {
    params: { query },
  });

  const body: unknown = await response.json();

  const legacyId = (body as { items: { _id: string }[] }).items[0]?._id;

  if (!legacyId) {
    throw new Error(`No folge found for query: ${query}`);
  }

  return legacyId;
}

const legacyApiFolgenSchema = {
  _id: expect.any(String),
  created_at: expect.any(String),
  images: expect.arrayContaining([
    expect.objectContaining({
      height: expect.any(Number),
      url: expect.any(String),
      width: expect.any(Number),
    }),
  ]),
  inhalt: expect.any(String),
  name: expect.any(String),
  number: expect.any(String),
  number_of_ratings: expect.any(Number),
  popularity: expect.any(Number),
  rating: expect.any(Number),
  release_date: expectIsoString,
  spotify_id: expect.any(String),
  sprecher: expect.any(String),
  type: expect.any(String),
  updated_at: expect.any(String),
  weblink: expect.any(String),
};
