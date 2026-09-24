import { createBrowserClient } from "@supabase/ssr";

/** True quando o Supabase está configurado (variáveis públicas presentes). */
export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/**
 * Cliente Supabase para uso no browser (Client Components).
 * Retorna `null` quando o Supabase não está configurado (Etapa 2 — site em modo
 * demonstração, sem backend). Os callers tratam o modo demo.
 */
export function createClient() {
  if (!isSupabaseConfigured()) return null;
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
