import { expect } from '@playwright/test';

/**
 * Completa o wizard de onboarding como convidado (sem login), do zero até o
 * Dashboard. Reaproveitado por toda spec que só precisa de um usuário
 * pronto — evita repetir os 6 passos em cada teste.
 */
export async function completeGuestOnboarding(page, { name = 'Visitante Teste' } = {}) {
    await page.goto('/');
    await page.getByTestId('landing-start-button').click();
    await expect(page.getByTestId('onboarding-screen')).toBeVisible();

    await page.getByTestId('onboarding-next-button').click(); // step 0 (boas-vindas) -> 1

    await page.getByTestId('onboarding-name-input').fill(name);
    await page.getByTestId('onboarding-next-button').click(); // 1 -> 2

    await page.getByTestId('onboarding-weight-input').fill('85');
    await page.getByTestId('onboarding-height-input').fill('1.75');
    await page.getByTestId('onboarding-next-button').click(); // 2 -> 3

    await page.getByTestId('onboarding-goal-weight-input').fill('75');
    await page.getByTestId('onboarding-next-button').click(); // 3 -> 4

    await page.getByTestId('onboarding-substance-Semaglutida').click();
    await page.getByTestId('onboarding-medication-ozempic').click();
    await page.getByTestId('onboarding-next-button').click(); // 4 -> 5

    await page.getByTestId('onboarding-dose-0.5 mg').click();
    await page.getByTestId('onboarding-next-button').click(); // 5 -> finaliza

    await expect(page.getByTestId('main-app-screen')).toBeVisible();
}
