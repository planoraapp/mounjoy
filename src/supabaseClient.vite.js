import { createClient } from '@supabase/supabase-js';

// Vite-only variant of supabaseClient.js. Vite's dev-server `define`
// substitution does not reliably replace `process.env.*` reads at dev-serve
// time (only in production builds), so the web/Vite bundle uses
// import.meta.env instead — Vite's native, always-reliable env mechanism.
// This file must stay Vite-exclusive: Metro/Hermes cannot parse
// `import.meta` at all (see src/supabaseClient.js for the Metro-safe
// version). vite.config.js aliases `./supabaseClient` to this file.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

if (supabaseUrl.includes('placeholder-project')) {
    console.warn("Supabase credentials missing. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local. App running in offline/placeholder mode.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
