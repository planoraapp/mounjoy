/**
 * Popula o projeto Supabase de TESTE com a conta fixa usada por
 * login-e-dashboard.spec.js. Idempotente: pode rodar quantas vezes quiser.
 *
 * Uso:
 *   npm run test:e2e:seed
 *
 * Exige no .env.test.local (do projeto Supabase de TESTE, nunca produção):
 *   EXPO_PUBLIC_SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...   (Settings -> API -> service_role, secreta)
 *
 * A service_role key ignora RLS por design (é como o admin SDK do Firebase)
 * — por isso só existe aqui, nunca no bundle do app (que usa a anon key).
 */
import { createClient } from '@supabase/supabase-js';
import { SEEDED_USER } from './fixtures.js';
import { loadTestEnv } from './loadTestEnv.mjs';

loadTestEnv();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error(
        'Faltam EXPO_PUBLIC_SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY. ' +
        'Rode com: node --env-file=.env.test.local tests/e2e/seed.mjs'
    );
    process.exit(1);
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(email) {
    // supabase-js v2 não tem getUserByEmail no client; paginamos listUsers.
    let page = 1;
    const perPage = 200;
    for (;;) {
        const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
        if (error) throw error;
        const found = data.users.find((u) => u.email === email);
        if (found) return found;
        if (data.users.length < perPage) return null;
        page += 1;
    }
}

async function getOrCreateUser() {
    const existing = await findUserByEmail(SEEDED_USER.email);
    if (existing) {
        console.log(`Usuário já existe: ${SEEDED_USER.email} (${existing.id})`);
        return existing;
    }

    const { data, error } = await admin.auth.admin.createUser({
        email: SEEDED_USER.email,
        password: SEEDED_USER.password,
        email_confirm: true, // pula confirmação por e-mail no projeto de teste
    });
    if (error) throw error;
    console.log(`Usuário criado: ${SEEDED_USER.email} (${data.user.id})`);
    return data.user;
}

async function seedProfileData(uid) {
    const now = new Date().toISOString();
    const today = now.split('T')[0];

    const { error: profileError } = await admin.from('profiles').upsert({
        id: uid,
        name: SEEDED_USER.name,
        email: SEEDED_USER.email,
        start_date: now,
        medication_id: SEEDED_USER.medicationId,
        current_dose: SEEDED_USER.currentDose,
        is_maintenance: false,
        protein_goal: 100,
        water_goal: 2.5,
        fiber_goal: 25,
        updated_at: now,
    });
    if (profileError) throw profileError;

    const { error: measurementError } = await admin.from('measurements').upsert(
        { user_id: uid, date: now, weight: SEEDED_USER.currentWeight, waist: 0, hip: 0 },
        { onConflict: 'user_id,date' }
    );
    if (measurementError) throw measurementError;

    const { error: intakeError } = await admin.from('daily_intake').upsert(
        { user_id: uid, date: today, water: 0, protein: 0, fiber: 0 },
        { onConflict: 'user_id,date' }
    );
    if (intakeError) throw intakeError;

    console.log(`Perfil seedado para ${SEEDED_USER.email}.`);
}

const user = await getOrCreateUser();
await seedProfileData(user.id);
console.log('Seed concluído.');
