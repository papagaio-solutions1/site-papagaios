import { redirect } from "next/navigation";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { siteConfig, whatsappLink } from "@/lib/site";

// Rota protegida: só clientes logados agendam. Caso contrário, vai para o login.
// Etapa 2 (sem backend): sem gate de login — encaminha direto ao WhatsApp (demo).
export default async function AgendarPage() {
  if (isSupabaseConfigured()) {
    const supabase = (await createClient())!;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      redirect("/entrar");
    }
  }

  redirect(whatsappLink(siteConfig.scheduleCta.message));
}
