import test, { expect } from '@playwright/test';

test('/api/folgen requires auth', async ({ page, request }) => {
  const res = await request.get('/api/folgen');

  expect(res.status()).toBe(401);
});

test('/api/folgen/someid requires auth', async ({ page, request }) => {
  const res = await request.get('/api/folgen/someid');

  expect(res.status()).toBe(401);
});

test('/api/sync requires auth', async ({ page, request }) => {
  const res = await request.get('/api/sync/folgen');

  expect(res.status()).toBe(401);
});
