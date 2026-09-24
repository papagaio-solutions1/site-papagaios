import { getGuardrailReminder, getSystemPrompt } from "@/lib/guto/knowledge";

export const runtime = "nodejs";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";
const MAX_TURNS = 10; // últimas N mensagens enviadas ao modelo
const MAX_CHARS = 2000; // limite por mensagem (anti-abuso)

// Limite por visitante (IP): protege a cota compartilhada da Groq de um único
// usuário/abuso. In-memory (por instância) — suficiente nesta fase.
const RL_WINDOW_MS = 60_000;
const RL_MAX = 8; // mensagens por minuto por IP
const rlHits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (rlHits.get(ip) ?? []).filter((t) => now - t < RL_WINDOW_MS);
  const limited = arr.length >= RL_MAX;
  if (!limited) arr.push(now);
  if (arr.length) rlHits.set(ip, arr);
  else rlHits.delete(ip);
  if (rlHits.size > 5000) rlHits.clear(); // poda de segurança contra crescimento
  return limited;
}

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  return xff?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

type InMsg = { role?: string; content?: string };

function sanitize(messages: unknown): { role: "user" | "assistant"; content: string }[] {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((m): m is InMsg => !!m && typeof m === "object")
    .map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: typeof m.content === "string" ? m.content.slice(0, MAX_CHARS) : "",
    }))
    .filter((m) => m.content.trim().length > 0)
    .slice(-MAX_TURNS) as { role: "user" | "assistant"; content: string }[];
}

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  // 503 → o client cai no fluxo guiado (fallback).
  if (!apiKey) return new Response("no_api_key", { status: 503 });

  // 429 → o client mostra "muitas mensagens agora, tenta em instantes".
  if (rateLimited(clientIp(req))) return new Response("rate_limited", { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("bad_request", { status: 400 });
  }

  const messages = sanitize((body as { messages?: unknown })?.messages);
  if (messages.length === 0) return new Response("empty", { status: 400 });

  let groqRes: Response;
  try {
    groqRes = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || DEFAULT_MODEL,
        // Sandwich: regras completas antes + lembrete forte depois da conversa.
        messages: [
          { role: "system", content: getSystemPrompt() },
          ...messages,
          { role: "system", content: getGuardrailReminder() },
        ],
        temperature: 0.3,
        max_tokens: 320, // respostas curtas + economiza o limite de tokens/min
        frequency_penalty: 0.5, // reduz repetições ("redesafio...")
        presence_penalty: 0.3,
        stream: true,
      }),
    });
  } catch (err) {
    console.error("[guto] erro ao chamar a Groq:", err);
    return new Response("upstream_error", { status: 502 });
  }

  if (!groqRes.ok || !groqRes.body) {
    const detail = await groqRes.text().catch(() => "");
    console.error("[guto] Groq respondeu", groqRes.status, detail.slice(0, 300));
    // 429 (limite de tokens/min) → status próprio p/ o client mostrar aviso gentil.
    if (groqRes.status === 429) return new Response("rate_limited", { status: 429 });
    return new Response("upstream_error", { status: 502 });
  }

  // Converte o SSE da Groq (OpenAI-compatible) em texto puro (apenas os deltas).
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = groqRes.body!.getReader();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(data);
              const delta = json.choices?.[0]?.delta?.content;
              if (typeof delta === "string" && delta.length > 0) {
                controller.enqueue(encoder.encode(delta));
              }
            } catch {
              // ignora linhas que não são JSON completo
            }
          }
        }
      } catch (err) {
        console.error("[guto] erro no streaming:", err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
