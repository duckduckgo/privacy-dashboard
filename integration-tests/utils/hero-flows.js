import { test, expect } from '@playwright/test';
import { testDataStates } from './states-with-fixtures';

/**
 * Blocked-trackers hero tests, shared by every platform spec.
 *
 * @param {(page: import('@playwright/test').Page, state: any) => Promise<import('../DashboardPage').DashboardPage>} open
 *   loads the dashboard for the platform and delivers `state`
 */
export function heroBlockedFlows(open) {
    test.describe('blocked trackers hero', () => {
        const cases = [
            { state: 'hero-blocked-1-light', variant: '1', logos: 1, more: null },
            { state: 'hero-blocked-2-light', variant: '2', logos: 2, more: null },
            { state: 'hero-blocked-3-light', variant: '3', logos: 3, more: null },
            { state: 'hero-blocked-4-light', variant: '4', logos: 4, more: null },
            { state: 'hero-blocked-4plus-light', variant: '4plus', logos: 4, more: '+ 4 more' },
        ];
        for (const { state, variant, logos, more } of cases) {
            test(`shows the ${variant} variant with ${logos} live logos`, async ({ page }) => {
                const dash = await open(page, testDataStates[state]);
                await dash.showsPrimaryScreen();
                const hero = page.getByLabel('List of Blocked Company Icons');
                await expect(hero).toHaveAttribute('data-hero-variant', variant);
                await expect(hero.locator('[data-company-icon-position]')).toHaveCount(logos);
                if (more) {
                    await expect(hero).toContainText(more);
                } else {
                    await expect(hero.locator('.hero-blocked__more')).toHaveCount(0);
                }
            });
        }
        test('still shows the hero when a company name has no latin letters', async ({ page }) => {
            const dash = await open(page, testDataStates['hero-blocked-non-latin']);
            await dash.showsPrimaryScreen();
            const hero = page.getByLabel('List of Blocked Company Icons');
            await expect(hero.locator('[data-company-icon-position]')).toHaveCount(2);
            await expect(page.getByText('Яндекс')).toBeVisible();
            await expect(page.getByTestId('protectionHeader')).toBeVisible();
        });
        test('shows the domain above the hero and the toggle under the list', async ({ page }) => {
            const dash = await open(page, testDataStates['hero-blocked-4plus-light']);
            await dash.showsPrimaryScreen();
            const y = async (locator) => (await locator.boundingBox())?.y ?? -1;
            const order = async () => {
                const domain = await y(page.getByRole('heading', { name: 'example.com' }));
                const hero = await y(page.getByLabel('List of Blocked Company Icons'));
                const list = await y(page.locator('#main-nav'));
                const toggle = await y(page.getByTestId('protectionHeader'));
                return domain >= 0 && domain < hero && hero < list && list < toggle;
            };
            // retry until the layout settles: the boxes can still move right after the first render
            await expect.poll(order, { message: 'domain → hero → list → toggle, top to bottom' }).toBe(true);
        });
    });

    test.describe('blocked trackers hero screenshots', { tag: '@screenshots' }, () => {
        for (const variant of ['1', '2', '3', '4', '4plus']) {
            for (const theme of /** @type {const} */ (['light', 'dark'])) {
                const name = `hero-blocked-${variant}-${theme}`;
                test(name, async ({ page }) => {
                    // some platforms take the theme from the data, others from the system setting
                    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: theme });
                    const dash = await open(page, testDataStates[name]);
                    await dash.showsPrimaryScreen();
                    await dash.screenshot(name + '.png');
                });
            }
        }
    });
}
