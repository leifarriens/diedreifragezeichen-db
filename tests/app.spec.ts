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

  const folge = page.getByRole('article').first();

  await folge.getByRole('link').click();

  await expect(page).toHaveTitle('Drei Fragezeichen DB | Folge 125 Feuermond');
});
