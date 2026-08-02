import { expect, test } from '@playwright/test';

test('homepage has title and links to datenschutz page', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Drei Fragezeichen DB/);

  const dsgLink = page.getByRole('link', { name: 'Datenschutz' });

  await expect(dsgLink).toHaveAttribute('href', '/datenschutz');

  await dsgLink.click();

  await expect(page).toHaveURL(/.*datenschutz/);
});

// DISCUSS: this could fail test on first deploy before an initial sync
test('folgen can be filtered and links to folge', async ({ page }) => {
  await page.goto('/');

  const searchInput = page.getByPlaceholder(
    'Name, Nummer oder Erscheinungsjahr',
  );

  await searchInput.fill('feuermond');

  await expect(page).toHaveURL(/search=feuermond/);

  // tests started to fail without await reorder of the grid
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const folge = page.getByRole('article').first();

  await folge.getByRole('link').click();

  await expect(page).toHaveTitle('Folge 125 Feuermond | Drei Fragezeichen DB');

  await searchInput.fill('en');

  const suggestions = page.locator('ul').getByRole('link');
  await expect(suggestions.nth(1)).toBeVisible();

  const firstDetailUrl = page.url();
  await suggestions.nth(1).click();

  await expect(page).not.toHaveURL(firstDetailUrl);
  await expect(suggestions.first()).toBeHidden();

  await page.goBack();
  await page.goBack();

  await expect(page).toHaveURL(/search=feuermond/);
  await expect(searchInput).toHaveValue('feuermond');

  await searchInput.fill('');

  await expect(page).toHaveURL(/\/$/);
});

test('search query in the URL initializes the search filter', async ({
  page,
}) => {
  await page.goto('/?search=feuermond');

  const searchInput = page.getByPlaceholder(
    'Name, Nummer oder Erscheinungsjahr',
  );

  await expect(searchInput).toHaveValue('feuermond');
  await expect(page.getByRole('article').first()).toBeVisible();
});
