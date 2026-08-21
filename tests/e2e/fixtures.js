/**
 * Dados de contas fixas do E2E, compartilhados entre tests/e2e/seed.mjs (que
 * grava no projeto Supabase de teste) e as specs que logam com essas
 * credenciais. Espelha o papel de tests/browser/fixtures.mjs no toursinop.
 *
 * SEEDED_USER exige rodar `npm run test:e2e:seed` primeiro, contra um
 * projeto Supabase de TESTE (nunca produção) — ver supabase/schema.sql e
 * tests/e2e/seed.mjs.
 */
export const SEEDED_USER = {
    email: 'cliente.e2e@mounjoy.test',
    password: 'SenhaE2e123!',
    name: 'Cliente E2E',
    medicationId: 'ozempic',
    currentDose: '0.5 mg',
    startWeight: 90,
    currentWeight: 88,
};

export const SIGNUP_PASSWORD = 'SenhaE2e123!';

// E-mail único por execução — usado no teste de cadastro para não colidir
// com contas de execuções anteriores no projeto de teste.
export const newSignupEmail = () => `novo.e2e.${Date.now()}@mounjoy.test`;
