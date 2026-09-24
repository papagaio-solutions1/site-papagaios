// Server-only: usa TELEGRAM_BOT_TOKEN (segredo). Nunca importar em componente client.
// Importado apenas por Server Actions / Route Handlers.

const API = "https://api.telegram.org";

/** Escapa caracteres especiais do HTML do Telegram (parse_mode=HTML). */
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

type SendOpts = { messageThreadId?: number };

/**
 * Envia uma mensagem ao Telegram. Best-effort: se não estiver configurado
 * (sem token/chat_id) ou falhar, retorna false sem lançar — nada quebra.
 */
export async function sendTelegramMessage(
  text: string,
  opts?: SendOpts,
): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false; // ainda não configurado → ignora

  try {
    const res = await fetch(`${API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        ...(opts?.messageThreadId
          ? { message_thread_id: opts.messageThreadId }
          : {}),
      }),
    });
    if (!res.ok) {
      console.error(
        "[telegram] sendMessage falhou",
        res.status,
        (await res.text().catch(() => "")).slice(0, 200),
      );
      return false;
    }
    return true;
  } catch (err) {
    console.error("[telegram] erro de rede:", err);
    return false;
  }
}

export type LeadNotice = {
  name: string;
  phone: string;
  email?: string;
  interesse?: string;
  dor?: string;
  porte?: string;
};

/** Notifica o time no Telegram sobre um novo lead capturado pelo chat do Guto. */
export async function notifyNewLead(lead: LeadNotice): Promise<boolean> {
  const lines = [
    "🔔 <b>Novo lead pelo chat do Guto</b>",
    `👤 ${esc(lead.name)}`,
    `📱 ${esc(lead.phone)}`,
    lead.email ? `✉️ ${esc(lead.email)}` : null,
    lead.interesse ? `🎯 Interesse: ${esc(lead.interesse)}` : null,
    lead.dor ? `⚠️ Dor: ${esc(lead.dor)}` : null,
    lead.porte ? `🏢 Porte: ${esc(lead.porte)}` : null,
  ].filter(Boolean);
  return sendTelegramMessage(lines.join("\n"));
}
