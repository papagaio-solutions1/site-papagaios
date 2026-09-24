"use server";

import { createClient } from "@/lib/supabase/server";
import { notifyNewLead } from "@/lib/telegram";
import { isValidEmail } from "@/lib/utils";

export type ChatLead = {
  name: string;
  phone: string;
  email?: string;
  interesse?: string;
  dor?: string;
  porte?: string;
};

export type SaveChatLeadResult = { ok: boolean; error?: string };

/**
 * Grava um lead capturado pelo chat do Guto na tabela ISOLADA `leads_chat`.
 * Nunca toca no banco do bot de WhatsApp. Best-effort: se falhar, o widget
 * ainda encaminha o contato pelo WhatsApp (nada se perde).
 */
export async function saveChatLead(lead: ChatLead): Promise<SaveChatLeadResult> {
  const name = lead.name?.trim() ?? "";
  const phone = lead.phone?.trim() ?? "";
  const email = lead.email?.trim() ?? "";

  if (name.length < 2) return { ok: false, error: "Nome inválido." };
  if (phone.replace(/\D/g, "").length < 8)
    return { ok: false, error: "Telefone inválido." };
  if (email && !isValidEmail(email))
    return { ok: false, error: "E-mail inválido." };

  // Camada 1: avisa o time no Telegram na hora (best-effort, independe do banco —
  // se o Telegram não estiver configurado ou falhar, segue sem quebrar).
  await notifyNewLead({
    name,
    phone,
    email: email || undefined,
    interesse: lead.interesse,
    dor: lead.dor,
    porte: lead.porte,
  });

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return { ok: false, error: "Banco não configurado." };
  }

  const resumo = [
    lead.interesse && `Interesse: ${lead.interesse}`,
    lead.dor && `Dor: ${lead.dor}`,
    lead.porte && `Porte: ${lead.porte}`,
  ]
    .filter(Boolean)
    .join(" | ");

  try {
    const supabase = await createClient();
    if (!supabase) return { ok: false, error: "Banco não configurado." };
    const { error } = await supabase.from("leads_chat").insert({
      name,
      phone,
      email: email || null,
      interesse: lead.interesse || null,
      dor: lead.dor || null,
      porte: lead.porte || null,
      message: resumo || null,
      source: "site-chat-guto",
    });
    if (error) {
      console.error("[leads_chat] insert error:", error.message);
      return { ok: false, error: error.message };
    }
  } catch (err) {
    console.error("[leads_chat] unexpected error:", err);
    return { ok: false, error: "Falha inesperada." };
  }

  return { ok: true };
}
