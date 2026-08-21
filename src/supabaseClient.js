import { createClient } from '@supabase/supabase-js';

const getEnv = (key) => {
    // Rely on process.env which is injected by Vite's define plugin on web and by Metro/Expo on mobile
    if (typeof process !== 'undefined' && process.env) {
        return process.env[`EXPO_PUBLIC_${key}`] || 
               process.env[`VITE_${key}`] || 
               process.env[key] || 
               '';
    }
    return '';
};

const supabaseUrl = getEnv('SUPABASE_URL') || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY') || 'placeholder-anon-key';

if (supabaseUrl.includes('placeholder-project')) {
    console.warn("Supabase credentials missing. Check EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY. App running in offline/placeholder mode.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


