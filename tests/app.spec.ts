import { expect, test } from '@playwright/test';

test('homepage has title and links to datenschutz page', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Drei Fragezeichen DB/);

  const dsgLink = page.getByRole('link', { name: 'Datenschutz' });

  await expect(dsgLink).toHaveAttribute('href', '/datenschutz');

  await dsgLink.click();

  await expect(page).toHaveURL(/.*datenschutz/);
});
