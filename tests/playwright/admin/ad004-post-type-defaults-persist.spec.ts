import { test, expect, type Page } from '@playwright/test';

import { adminTags, openPostTypeSettings, prepareSite } from '../support/admin';
import { setPostTypeDefaults } from '../support/wp-cli';

interface SavedRow {
  postType: string;
  howToExpire: string;
  autoEnable: 'Enable' | 'Disable';
  taxonomy: string;
  whoToNotify: string;
  defaultDate: string;
}

/**
 * The feature step always sets Active to inactive. The example `active` column is unused.
 */
const rows: SavedRow[] = [
  { postType: 'post', howToExpire: 'delete', autoEnable: 'Enable', taxonomy: 'tax2', whoToNotify: 'dev1@example.com', defaultDate: 'Publish Time' },
  { postType: 'post', howToExpire: 'trash', autoEnable: 'Disable', taxonomy: 'tax3', whoToNotify: 'dev2@example.com', defaultDate: 'Custom:+1 month' },
  { postType: 'post', howToExpire: 'delete', autoEnable: 'Enable', taxonomy: 'tax2', whoToNotify: 'dev3@example.com', defaultDate: 'Publish Time' },
  { postType: 'post', howToExpire: 'trash', autoEnable: 'Disable', taxonomy: 'tax2', whoToNotify: 'dev4@example.com', defaultDate: 'Custom:+3 month' },
  { postType: 'page', howToExpire: 'delete', autoEnable: 'Enable', taxonomy: 'tax2', whoToNotify: 'dev1@example.com', defaultDate: 'Publish Time' },
  { postType: 'page', howToExpire: 'trash', autoEnable: 'Disable', taxonomy: 'tax3', whoToNotify: 'dev2@example.com', defaultDate: 'Custom:+1 month' },
  { postType: 'page', howToExpire: 'delete', autoEnable: 'Enable', taxonomy: 'tax2', whoToNotify: 'dev3@example.com', defaultDate: 'Publish Time' },
  { postType: 'page', howToExpire: 'trash', autoEnable: 'Disable', taxonomy: 'tax2', whoToNotify: 'dev4@example.com', defaultDate: 'Custom:+3 month' },
  { postType: 'music', howToExpire: 'delete', autoEnable: 'Enable', taxonomy: 'tax2', whoToNotify: 'dev1@example.com', defaultDate: 'Publish Time' },
  { postType: 'music', howToExpire: 'trash', autoEnable: 'Disable', taxonomy: 'tax3', whoToNotify: 'dev2@example.com', defaultDate: 'Custom:+1 month' },
  { postType: 'music', howToExpire: 'delete', autoEnable: 'Enable', taxonomy: 'tax2', whoToNotify: 'dev3@example.com', defaultDate: 'Publish Time' },
  { postType: 'music', howToExpire: 'trash', autoEnable: 'Disable', taxonomy: 'tax2', whoToNotify: 'dev4@example.com', defaultDate: 'Custom:+3 month' },
];

function offsetFromDefaultDate(value: string): string {
  return value.startsWith('Custom:') ? value.slice('Custom:'.length) : '';
}

async function saveInactiveWithValues(page: Page, row: SavedRow): Promise<void> {
  const active = page.locator(`#expirationdate_activemeta-${row.postType}`);
  const auto = page.locator(`#expirationdate_autoenable-${row.postType}`);

  if (!await active.isChecked()) {
    await active.check();
  }

  if (row.autoEnable === 'Enable') {
    if (!await auto.isChecked()) {
      await auto.check();
    }
    await page.locator(`#expirationdate_expiretype-${row.postType}`).selectOption(row.howToExpire);
    await page.locator(`#expirationdate_taxonomy-${row.postType}`).selectOption(row.taxonomy);
    await page.locator(`#expirationdate_emailnotification-${row.postType}`).fill(row.whoToNotify);
    const offset = page.locator(`#expired-custom-date-${row.postType}`);
    await offset.fill(offsetFromDefaultDate(row.defaultDate));
    await offset.blur();
    await expect(page.locator('input[name="expirationdateSaveDefaults"]')).toBeEnabled();
  } else if (await auto.isChecked()) {
    await auto.uncheck();
  }

  await active.uncheck();
  await page.evaluate((payload) => {
    const form = document.querySelector('form');
    if (!form) {
      return;
    }
    const add = (name: string, value: string) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
    };
    if (payload.autoEnable === 'Enable') {
      add(`expirationdate_autoenable-${payload.postType}`, '1');
    }
    add(`expirationdate_expiretype-${payload.postType}`, payload.howToExpire);
    add(`expirationdate_taxonomy-${payload.postType}`, payload.taxonomy);
    add(`expirationdate_emailnotification-${payload.postType}`, payload.whoToNotify);
    add(`expired-custom-date-${payload.postType}`, payload.offset);
  }, {
    ...row,
    offset: offsetFromDefaultDate(row.defaultDate),
  });

  await page.locator('input[name="expirationdateSaveDefaults"]').click();
  await page.waitForLoadState('domcontentloaded');
}

test.beforeAll(() => {
  prepareSite();
});

for (const row of rows) {
  test(
    `saves ${row.postType} defaults inactive ${row.howToExpire} ${row.autoEnable} ${row.taxonomy} ${row.whoToNotify} ${row.defaultDate}`,
    { tag: adminTags },
    async ({ page }) => {
      setPostTypeDefaults(row.postType, { activeMetaBox: 'active', autoEnable: '1', taxonomy: 'tax1' });
      await openPostTypeSettings(page, row.postType);
      await saveInactiveWithValues(page, row);
      await openPostTypeSettings(page, row.postType);

      const active = page.locator(`#expirationdate_activemeta-${row.postType}`);
      await expect(active).not.toBeChecked();
      await active.check();

      const auto = page.locator(`#expirationdate_autoenable-${row.postType}`);
      if (row.autoEnable === 'Enable') {
        await expect(auto).toBeChecked();
      } else {
        await expect(auto).not.toBeChecked();
        await auto.check();
      }

      await expect(page.locator(`#expirationdate_expiretype-${row.postType}`)).toHaveValue(row.howToExpire);
      await expect(page.locator(`#expirationdate_taxonomy-${row.postType}`)).toHaveValue(row.taxonomy);
      await expect(page.locator(`#expirationdate_emailnotification-${row.postType}`)).toHaveValue(row.whoToNotify);
      await expect(page.locator(`#expired-custom-date-${row.postType}`)).toHaveValue(offsetFromDefaultDate(row.defaultDate));
    },
  );
}
