import { test, expect } from '@playwright/test';
import { completeGuestOnboarding } from './helpers.js';

test('registrar água, proteína e fibra atualiza o histórico do dia', async ({ page }) => {
    await completeGuestOnboarding(page);

    await page.getByTestId('water-increment-button').click();
    await page.getByTestId('protein-increment-button').click();
    await page.getByTestId('fiber-increment-button').click();

    const guestData = await page.evaluate(() => JSON.parse(localStorage.getItem('mounjoy_guest_user')));
    const today = new Date().toISOString().split('T')[0];
    const intake = guestData.dailyIntakeHistory[today];

    expect(intake).toBeDefined();
    expect(intake.water).toBeCloseTo(0.2, 5);
    expect(intake.protein).toBe(5);
    expect(intake.fiber).toBe(5);
});
