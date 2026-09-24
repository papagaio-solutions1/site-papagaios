"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CalendarDays, RotateCcw, Send, X } from "lucide-react";

import { GutoAvatar } from "./GutoAvatar";
import { AI_SUGGESTIONS, useGutoChat } from "./useGutoChat";
import { cn } from "@/lib/utils";

/** Renderiza **negrito** e quebras de linha do texto. */
function renderRich(text: string) {
  return text.split("\n").map((line, li) => (
    <span key={li} className="block">
      {line.split("**").map((seg, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold">
            {seg}
          </strong>
        ) : (
          <span key={i}>{seg}</span>
        ),
      )}
    </span>
  ));
}

function TypingDots() {
  return (
    <div className="flex gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

export function ChatWidget() {
  const reduce = useReducedMotion() ?? false;
  const [open, setOpen] = useState(false);
  const [greeting, setGreeting] = useState(false);
  const [dismissedGreeting, setDismissedGreeting] = useState(false);
  const [input, setInput] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
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
  } = useGutoChat(reduce);

  useEffect(() => {
    if (dismissedGreeting || open) return;
    const t = setTimeout(() => setGreeting(true), 2800);
    return () => clearTimeout(t);
  }, [dismissedGreeting, open]);

  useEffect(() => {
    if (open && bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, typing, streaming, options, ask, open]);

  useEffect(() => {
    if (open && ask) inputRef.current?.focus();
  }, [open, ask]);

  function openChat() {
    setOpen(true);
    setGreeting(false);
    setDismissedGreeting(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inputEnabled || !input.trim()) return;
    submit(input);
    setInput("");
  }

  const chip =
    "rounded-full border border-primary/40 bg-card px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10";

  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6">
      {/* ---------- Painel ---------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{ transformOrigin: "bottom right" }}
            className="absolute bottom-[calc(100%+0.85rem)] right-0 flex h-[min(72vh,33rem)] w-[min(23rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            {/* header */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-primary to-highlight px-4 py-3 text-primary-foreground">
              <span className="rounded-full ring-2 ring-white/70">
                <GutoAvatar size={42} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-tight">Guto</p>
                <p className="flex items-center gap-1.5 text-xs text-white/85">
                  <span className="size-2 rounded-full bg-green-400 ring-2 ring-green-400/30" />
                  Assistente da Papagaios Solutions • online
                </p>
              </div>
              <button
                onClick={restart}
                aria-label="Reiniciar conversa"
                title="Reiniciar conversa"
                className="rounded-md p-1.5 text-white/90 transition-colors hover:bg-white/15"
              >
                <RotateCcw className="size-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar chat"
                className="rounded-md p-1.5 text-white/90 transition-colors hover:bg-white/15"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* corpo */}
            <div
              ref={bodyRef}
              className="flex-1 space-y-3 overflow-y-auto bg-secondary/30 px-4 py-4"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex items-end gap-2",
                    m.role === "user" && "flex-row-reverse",
                  )}
                >
                  {m.role === "bot" && <GutoAvatar size={28} />}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm",
                      m.role === "bot"
                        ? "rounded-bl-sm bg-card text-foreground"
                        : "rounded-br-sm bg-primary text-primary-foreground",
                    )}
                  >
                    {m.streaming && !m.text.trim() ? (
                      <TypingDots />
                    ) : (
                      <>
                        {renderRich(m.text)}
                        {m.streaming && (
                          <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse rounded-sm bg-muted-foreground/50 align-middle" />
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}

              {/* indicador de digitação (fluxo determinístico) */}
              {typing && (
                <div className="flex items-end gap-2">
                  <GutoAvatar size={28} />
                  <div className="rounded-2xl rounded-bl-sm bg-card px-3.5 py-2 shadow-sm">
                    <TypingDots />
                  </div>
                </div>
              )}

              {/* opções do fluxo determinístico */}
              {options && options.length > 0 && (
                <div className="flex flex-wrap gap-2 pl-9 pt-1">
                  {options.map((o) =>
                    o.href ? (
                      o.external ? (
                        <a
                          key={o.label}
                          href={o.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={chip}
                        >
                          {o.label}
                        </a>
                      ) : (
                        <Link key={o.label} href={o.href} className={chip}>
                          {o.label}
                        </Link>
                      )
                    ) : (
                      <button
                        key={o.label}
                        onClick={() => choose(o.option)}
                        className={chip}
                      >
                        {o.label}
                      </button>
                    ),
                  )}
                  {nodeId === "save" && (
                    <button onClick={backToChat} className={chip}>
                      Voltar a conversar
                    </button>
                  )}
                </div>
              )}

              {/* ações do modo IA: agendar (sempre) + sugestões (no início) */}
              {mode === "ai" && !streaming && (
                <div className="flex flex-wrap gap-2 pl-9 pt-1">
                  <button
                    onClick={startCapture}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    <CalendarDays className="size-3.5" />
                    Agendar reunião
                  </button>
                  {fresh &&
                    AI_SUGGESTIONS.map((s) => (
                      <button key={s} onClick={() => submit(s)} className={chip}>
                        {s}
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-border bg-card px-3 py-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={!inputEnabled}
                placeholder={
                  ask
                    ? ask.placeholder
                    : streaming
                      ? "Guto está respondendo…"
                      : "Pergunte sobre IA, automação, serviços…"
                }
                className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!inputEnabled || !input.trim()}
                aria-label="Enviar"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                <Send className="size-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- Balão de saudação ---------- */}
      <AnimatePresence>
        {greeting && !open && (
          <motion.button
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={openChat}
            className="absolute bottom-[calc(100%+0.85rem)] right-0 flex w-[15rem] items-center gap-2 rounded-2xl rounded-br-sm border border-border bg-card px-3.5 py-2.5 text-left shadow-xl"
          >
            <span className="text-sm leading-snug text-foreground">
              Oi! Eu sou o <strong className="text-primary">Guto</strong> 👋 Posso te
              ajudar?
            </span>
            <span
              role="button"
              aria-label="Dispensar"
              onClick={(e) => {
                e.stopPropagation();
                setGreeting(false);
                setDismissedGreeting(true);
              }}
              className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-foreground/80 text-background"
            >
              <X className="size-3" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ---------- Botão flutuante (FAB) ---------- */}
      <div className="relative flex justify-end">
        <motion.button
          onClick={() => (open ? setOpen(false) : openChat())}
          aria-label={open ? "Fechar chat do Guto" : "Abrir chat do Guto"}
          whileHover={reduce ? undefined : { scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          animate={reduce || open ? undefined : { y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex size-16 items-center justify-center overflow-hidden rounded-full bg-card shadow-xl ring-1 ring-black/5"
        >
          {open ? (
            <X className="size-7 text-foreground" />
          ) : (
            <GutoAvatar size={64} priority />
          )}
        </motion.button>
      </div>
    </div>
  );
}
