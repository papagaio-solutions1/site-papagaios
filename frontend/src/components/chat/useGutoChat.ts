"use client";

import { useRef, useState } from "react";

import { FLOW, type FlowNode, type FlowOption, type GutoCtx } from "@/lib/guto/flow";
import { isValidEmail } from "@/lib/utils";
import { saveChatLead } from "./actions";

export type ChatMsg = {
  id: number;
  role: "bot" | "user";
  text: string;
  /** "ai" entra no histórico do modelo; "flow" é determinístico (captura) e é ignorado pela IA. */
  track: "ai" | "flow";
  streaming?: boolean;
};

export type ResolvedOption = {
  label: string;
  href?: string;
  external?: boolean;
  option: FlowOption;
};

export type Mode = "ai" | "flow";

const WELCOME =
  "Oi! Eu sou o Guto, assistente da Papagaios Solutions 🤖 Pode me perguntar o que quiser sobre IA, automação e como a gente pode ajudar o seu negócio. Como posso ajudar?";

export const AI_SUGGESTIONS = [
  "O que a Papagaios Solutions faz?",
  "Quero automatizar meu atendimento",
  "Como funciona o processo?",
];

const SKIP_WORDS = ["pular", "skip", "nao", "não", "-", "x"];

function botText(node: FlowNode, ctx: GutoCtx): string {
  return typeof node.bot === "function" ? node.bot(ctx) : node.bot;
}

// Etapa 2 (sem backend de IA): Guto inicia no modo FLUXO determinístico (menu
// guiado, 100% offline). Com NEXT_PUBLIC_GUTO_AI="on" (Etapa 3, Groq), inicia no modo IA.
const AI_ENABLED = process.env.NEXT_PUBLIC_GUTO_AI === "on";

export function useGutoChat(reduceMotion: boolean) {
  const [mode, setMode] = useState<Mode>(AI_ENABLED ? "ai" : "flow");
  const [nodeId, setNodeId] = useState<string>("root");
  const [messages, setMessages] = useState<ChatMsg[]>(() =>
    AI_ENABLED
      ? [{ id: 0, role: "bot", text: WELCOME, track: "ai" }]
      : [{ id: 0, role: "bot", text: botText(FLOW.root, {}), track: "flow" }],
  );
  const [typing, setTyping] = useState(false); // delay do fluxo determinístico
  const [streaming, setStreaming] = useState(false); // IA gerando resposta

  const ctxRef = useRef<GutoCtx>({});
  const [ctx, setCtxState] = useState<GutoCtx>({});
  const idRef = useRef(1);
  const nextId = () => idRef.current++;

  function patchCtx(patch: Partial<GutoCtx>) {
    const merged = { ...ctxRef.current, ...patch };
    ctxRef.current = merged;
    setCtxState(merged);
  }
  function push(msg: Omit<ChatMsg, "id">) {
    setMessages((m) => [...m, { id: nextId(), ...msg }]);
  }

  // ---------------------------------------------------------------- IA (Groq)
  async function sendAI(raw: string) {
    const text = raw.trim();
    if (!text || streaming || typing) return;

    const userMsg: ChatMsg = { id: nextId(), role: "user", text, track: "ai" };
    const history = [...messages, userMsg]
      .filter((m) => m.track === "ai" && m.text.trim().length > 0)
      .map((m) => ({
        role: (m.role === "bot" ? "assistant" : "user") as "assistant" | "user",
        content: m.text,
      }));
    // O histórico enviado ao modelo deve começar por uma mensagem do usuário
    // (descarta a saudação inicial do Guto, economizando tokens).
    while (history.length > 0 && history[0].role === "assistant") history.shift();

    const botId = nextId();
    setMessages((m) => [
      ...m,
      userMsg,
      { id: botId, role: "bot", text: "", track: "ai", streaming: true },
    ]);
    setStreaming(true);

    // Pausa "pensando" (uns segundinhos) em paralelo ao fetch, pra a resposta não
    // vir instantânea — os três pontinhos aparecem nesse intervalo.
    const thinkMs = reduceMotion ? 300 : 1100 + Math.floor(Math.random() * 800);

    try {
      const fetchPromise = fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      await new Promise((r) => setTimeout(r, thinkMs));
      const res = await fetchPromise;
      // 429: limite de tokens/min da Groq — avisa gentilmente e deixa tentar de novo.
      if (res.status === 429) {
        setMessages((m) =>
          m.map((x) =>
            x.id === botId
              ? {
                  ...x,
                  text: "Estou recebendo muitas mensagens agora 🙂 Tenta de novo daqui a alguns segundos.",
                  track: "flow",
                  streaming: false,
                }
              : x,
          ),
        );
        return; // continua no modo IA; o finally desliga o streaming
      }
      if (!res.ok || !res.body) throw new Error(`status ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => m.map((x) => (x.id === botId ? { ...x, text: acc } : x)));
      }
      if (!acc.trim()) throw new Error("empty");
      setMessages((m) =>
        m.map((x) => (x.id === botId ? { ...x, streaming: false } : x)),
      );
    } catch (err) {
      console.warn("[guto] falha na IA:", err);
      setMessages((m) =>
        m.map((x) =>
          x.id === botId
            ? {
                ...x,
                text: 'Ops, não consegui responder agora 😅 Pode tentar de novo em instantes? Se preferir, toque em "Agendar reunião".',
                track: "flow",
                streaming: false,
              }
            : x,
        ),
      );
      // Permanece no modo IA → o campo de digitar continua liberado p/ nova tentativa.
    } finally {
      setStreaming(false);
    }
  }

  // ----------------------------------------------- Fluxo determinístico (flow)
  function goTo(id: string) {
    const node = FLOW[id];
    if (!node) return;
    setTyping(true);
    const delay = reduceMotion ? 120 : 480;
    window.setTimeout(() => {
      setNodeId(id);
      push({ role: "bot", text: botText(node, ctxRef.current), track: "flow" });
      setTyping(false);
      if (node.save) void persistLead();
    }, delay);
  }

  async function persistLead() {
    const c = ctxRef.current;
    if (!c.name || !c.phone) return;
    try {
      const res = await saveChatLead({
        name: c.name,
        phone: c.phone,
        email: c.email,
        interesse: c.interesse,
        dor: c.dor,
        porte: c.porte,
      });
      if (!res.ok) console.warn("[guto] lead não salvo no banco:", res.error);
    } catch (e) {
      console.warn("[guto] erro ao salvar lead:", e);
    }
  }

  function choose(option: FlowOption) {
    if (typing || !option.next) return;
    push({ role: "user", text: option.label, track: "flow" });
    if (option.set) patchCtx(option.set);
    goTo(option.next);
  }

  function flowSubmit(text: string) {
    const node = FLOW[nodeId];
    if (!node.ask) return;
    push({ role: "user", text, track: "flow" });
    const { field, validate, next } = node.ask;

    if (validate === "name" && text.length < 2) {
      flowError("Pode me dizer seu nome? 🙂");
      return;
    }
    if (validate === "phone" && text.replace(/\D/g, "").length < 8) {
      flowError("Hmm, esse número não parece válido. Manda com DDD? Ex.: (21) 90000-0000");
      return;
    }
    let value: string | undefined = text;
    if (validate === "email-optional") {
      if (SKIP_WORDS.includes(text.toLowerCase())) {
        value = undefined;
      } else if (!isValidEmail(text)) {
        flowError('Esse e-mail não parece válido. Tenta de novo ou digite "pular".');
        return;
      }
    }
    if (value !== undefined) patchCtx({ [field]: value } as Partial<GutoCtx>);
    goTo(next);
  }

  function flowError(text: string) {
    setTyping(true);
    const delay = reduceMotion ? 120 : 420;
    window.setTimeout(() => {
      push({ role: "bot", text, track: "flow" });
      setTyping(false);
    }, delay);
  }

  // -------------------------------------------------------------- transições
  /** Roteia o texto digitado: pergunta do fluxo → determinístico; senão → IA. */
  function submit(raw: string) {
    const text = raw.trim();
    if (!text) return;
    if (mode === "flow" && FLOW[nodeId].ask && !typing) {
      flowSubmit(text);
    } else if (AI_ENABLED) {
      sendAI(text);
    } else {
      // Demo sem IA: orienta pelo menu guiado.
      push({ role: "user", text, track: "flow" });
      flowError(
        'No momento respondo pelo menu guiado 🙂 Escolha uma opção ou toque em "Agendar reunião".',
      );
    }
  }

  /** Inicia a captura de lead (botão "Agendar reunião"). */
  function startCapture() {
    if (streaming || typing) return;
    setMode("flow");
    goTo("agendar_intro");
  }

  /** Volta da captura para a conversa (IA se habilitada; senão, menu guiado). */
  function backToChat() {
    if (AI_ENABLED) {
      setMode("ai");
      setNodeId("root");
      push({ role: "bot", text: "Voltei! 😊 Pode perguntar mais alguma coisa.", track: "ai" });
    } else {
      setMode("flow");
      goTo("root");
    }
  }

  function restart() {
    ctxRef.current = {};
    setCtxState({});
    idRef.current = 1;
    setTyping(false);
    setStreaming(false);
    if (AI_ENABLED) {
      setMode("ai");
      setNodeId("root");
      setMessages([{ id: 0, role: "bot", text: WELCOME, track: "ai" }]);
    } else {
      setMode("flow");
      setNodeId("root");
      setMessages([{ id: 0, role: "bot", text: botText(FLOW.root, {}), track: "flow" }]);
    }
  }

  // ---------------------------------------------------------------- derivados
  const node = FLOW[nodeId];
  const options: ResolvedOption[] | null =
    mode === "flow" && !typing && node.options
      ? node.options.map((o) => ({
          label: o.label,
          href: typeof o.href === "function" ? o.href(ctx) : o.href,
          external: o.external,
          option: o,
        }))
      : null;
  const ask = mode === "flow" && !typing && node.ask ? node.ask : null;
  const fresh = mode === "ai" && messages.length <= 1 && !streaming;
  const inputEnabled = (mode === "ai" && !streaming) || !!ask;

  return {
    mode,
    nodeId,
    messages,
    options,
    ask,
    typing,
    streaming,
    fresh,
    inputEnabled,
    submit,
    choose,
    startCapture,
    backToChat,
    restart,
  };
}
