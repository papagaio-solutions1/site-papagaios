import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** True quando o Supabase está configurado (variáveis públicas presentes). */
export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/**
 * Cliente Supabase para uso no servidor (Server Components, Route Handlers, Server Actions).
 * Retorna `null` quando o Supabase não está configurado (Etapa 2 — modo demonstração).
 */
export async function createClient() {
  if (!isSupabaseConfigured()) return null;
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Chamado de um Server Component — pode ser ignorado se houver middleware
            // de refresh de sessão.
          }
        },
      },
    },
  );
}
