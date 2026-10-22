import { expect, test } from "@playwright/test";

test.describe("GET /api/v0/search", () => {
  test("returns the search result for a query", async ({ request }) => {
    const response = await request.get("/api/v0/search", {
      params: { q: "feuermond" },
    });

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");

    const body: unknown = await response.json();

    expect(body).toMatchObject({
      results: expect.arrayContaining([
        expect.objectContaining({
          title: expect.stringContaining("Feuermond"),
        }),
      ]),
    });
  });

  test("returns 400 for too short query", async ({ request }) => {
    const response = await request.get("/api/v0/search", {
      params: { q: "x" },
    });

    expect(response.status()).toBe(400);
  });
});
