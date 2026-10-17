import { expect, test } from "@playwright/test";

test.describe("GET /api/folgen", () => {
  test("returns a non-empty page of legacy episodes", async ({ request }) => {
    const response = await request.get("/api/folgen");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");

    const body: unknown = await response.json();

    expect(body).toMatchObject({
      items: expect.arrayContaining([
        expect.objectContaining({
          _id: expect.any(String),
          name: expect.any(String),
          spotify_id: expect.any(String),
        }),
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
});
