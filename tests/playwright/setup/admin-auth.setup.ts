import { mkdirSync } from 'fs';
import path from 'path';

import { expect, test } from '@playwright/test';

import { ADMIN_AUTH_STATE } from '../support/paths';

test('authenticate WordPress administrator', async ({ page }) => {
  test.setTimeout(120_000);
  mkdirSync(path.dirname(ADMIN_AUTH_STATE), { recursive: true });

  const user = process.env.WP_TESTS_ADMIN_USER || 'admin';
  const password = process.env.WP_TESTS_ADMIN_PASSWORD || 'admin';

  await page.goto('/wp-login.php', { waitUntil: 'domcontentloaded' });
  await page.locator('#user_login').fill(user);
  await page.locator('#user_pass').fill(password);
  await page.locator('#wp-submit').click();
  await page.waitForLoadState('domcontentloaded');

  if (/\/wp-login\.php(?:[?#]|$)/.test(page.url())) {
    const loginError = await page.locator('#login_error, .message').first().textContent().catch(() => null);

    throw new Error(loginError?.trim() || 'WordPress admin login did not complete.');
  }

  await expect(page.locator('#wpadminbar')).toBeVisible();
  await page.context().storageState({ path: ADMIN_AUTH_STATE });
});
