import { createClient } from '@supabase/supabase-js';

const getEnv = (key) => {
    // Vite/web: import.meta.env is Vite's native env injection mechanism.
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        const value = import.meta.env[`VITE_${key}`];
        if (value) return value;
    }
    // Expo/native: process.env is injected by Metro at build time.
    if (typeof process !== 'undefined' && process.env) {
        return process.env[`EXPO_PUBLIC_${key}`] || '';
    }
    return '';
};

const supabaseUrl = getEnv('SUPABASE_URL') || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY') || 'placeholder-anon-key';

if (supabaseUrl.includes('placeholder-project')) {
    console.warn("Supabase credentials missing. Check EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY. App running in offline/placeholder mode.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


