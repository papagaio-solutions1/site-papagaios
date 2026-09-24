import { Bot, Check } from "lucide-react";

import { Reveal } from "@/components/animations/Reveal";

const conversation = [
  { from: "cliente" as const, text: "Oi, vocês têm horário disponível essa semana?" },
  {
    from: "agente" as const,
    text: "Olá! 👋 Temos sim. Quer agendar para quinta às 15h ou sexta às 10h?",
  },
  { from: "cliente" as const, text: "Quinta às 15h fica ótimo." },
  {
    from: "agente" as const,
    text: "Perfeito! Agendado ✅ Vou te enviar a confirmação e o lembrete por aqui.",
  },
];

const points = [
  "Qualifica e responde leads em segundos",
  "Agenda reuniões e envia lembretes automáticos",
  "Encaminha para um humano quando necessário",
];

export function Demo() {
  return (
    <section className="bg-gradient-to-br from-[#ff8a4d] via-primary to-highlight py-20 text-white sm:py-28">
      <div className="mx-auto grid max-w-[90rem] items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <Reveal>
          <span className="text-sm font-semibold uppercase tracking-wider text-white/80">
            Demonstração
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Veja um agente de IA atendendo no WhatsApp
          </h2>
          <p className="mt-4 text-lg leading-8 text-white/85">
            Conversas naturais que entendem o cliente, resolvem dúvidas e
            conduzem até a venda — exatamente como seu melhor vendedor faria.
          </p>
          <ul className="mt-8 space-y-3">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
                  <Check className="size-3.5" />
                </span>
                <span className="text-white/90">{point}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mx-auto w-full max-w-sm">
            {/* Cantos vermelhos — homenagem ao background da marca */}
            <span className="absolute -left-2.5 -top-2.5 size-5 rounded-md bg-highlight shadow-md" />
            <span className="absolute -right-2.5 -top-2.5 size-5 rounded-md bg-highlight shadow-md" />
            <span className="absolute -bottom-2.5 -left-2.5 size-5 rounded-md bg-highlight shadow-md" />
            <span className="absolute -bottom-2.5 -right-2.5 size-5 rounded-md bg-highlight shadow-md" />

            {/* "Tela" branca */}
            <div className="relative rounded-2xl bg-white p-4 text-foreground shadow-2xl shadow-black/20">
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Agente Papagaios Solutions</p>
                  <p className="text-xs text-primary">online agora</p>
                </div>
              </div>

              <div className="space-y-3 py-4">
                {conversation.map((msg, i) => (
                  <div
                    key={i}
                    className={
                      msg.from === "agente" ? "flex justify-end" : "flex justify-start"
                    }
                  >
                    <p
                      className={
                        msg.from === "agente"
                          ? "max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground"
                          : "max-w-[80%] rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2 text-sm text-foreground"
                      }
                    >
                      {msg.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
