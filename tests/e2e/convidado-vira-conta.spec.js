import { test, expect } from '@playwright/test';
import { completeGuestOnboarding } from './helpers.js';
import { newSignupEmail, SIGNUP_PASSWORD } from './fixtures.js';

/**
 * Caminho real de cadastro no app hoje: o wizard de onboarding sempre roda
 * como convidado primeiro (dado só em localStorage); a conta é criada depois,
 * pelo banner "Criar Conta e Salvar" dentro do Dashboard, que dispara a ponte
 * de migração em src/App.jsx (MainApp, "Migration Bridge: LocalStorage ->
 * Supabase"). Criar conta direto pela tela de Login/Cadastro sem passar pelo
 * onboarding como convidado primeiro NÃO tem esse teste — ver observação
 * sobre isso na conversa (tela de Login pode ficar presa sem `userData` para
 * um usuário novo sem dado de convidado migrável).
 *
 * Exige o projeto Supabase de TESTE configurado (cria uma conta nova a cada
 * execução, e-mail gerado com timestamp — não precisa de seed).
 */
test('convidado completa onboarding e migra os dados ao criar conta', async ({ page }) => {
    const name = 'Migração E2E';
    await completeGuestOnboarding(page, { name });

    await expect(page.getByTestId('guest-create-account-button')).toBeVisible();
    await page.getByTestId('guest-create-account-button').click();

    // O modal de login abre em modo "Entrar" por padrão; alterna para cadastro.
    await page.getByTestId('login-toggle-mode').click();

    const email = newSignupEmail();
    await page.getByTestId('login-email-input').fill(email);
    await page.getByTestId('login-password-input').fill(SIGNUP_PASSWORD);
    await page.getByTestId('login-submit-button').click();

    // A migração roda assim que currentUser aparece (useEffect em MainApp);
    // o nome deve continuar visível vindo agora do Supabase, não do localStorage.
    await expect(page.getByText(`Oi, ${name}!`, { exact: false })).toBeVisible({ timeout: 15_000 });

    const guestDataAfter = await page.evaluate(() => localStorage.getItem('mounjoy_guest_user'));
    expect(guestDataAfter).toBeNull();

    // Reload comprova que o dado persistiu no backend, não só em memória.
    await page.reload();
    await expect(page.getByText(`Oi, ${name}!`, { exact: false })).toBeVisible({ timeout: 15_000 });
});
