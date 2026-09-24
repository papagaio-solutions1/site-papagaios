import { ChevronDown } from "lucide-react";

import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";

const faqs = [
  {
    question: "Quanto tempo leva para colocar a automação no ar?",
    answer:
      "Na maioria dos casos, entre alguns dias e duas semanas, dependendo da complexidade dos fluxos e das integrações necessárias.",
  },
  {
    question: "A IA substitui minha equipe?",
    answer:
      "Não. Ela assume o volume repetitivo e o primeiro atendimento, e encaminha para um humano sempre que necessário — liberando seu time para o que realmente exige decisão humana.",
  },
  {
    question: "Funciona com o WhatsApp que já uso?",
    answer:
      "Sim. Integramos com o WhatsApp e com as ferramentas que você já utiliza, como CRM e sistemas internos.",
  },
  {
    question: "Preciso de conhecimento técnico?",
    answer:
      "Não. Cuidamos de toda a implementação e configuração, e deixamos o painel pronto para você acompanhar os resultados.",
  },
  {
    question: "Como funciona a cobrança?",
    answer:
      "Montamos uma proposta sob medida conforme o escopo da automação. Fale com um especialista para receber um orçamento personalizado.",
  },
];

export function FAQ() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Perguntas frequentes"
          description="Ainda com dúvidas? Fale com um especialista — respondemos rápido."
        />

        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <Reveal key={faq.question} delay={(i % 5) * 0.05}>
              <details className="group rounded-xl border border-border bg-card px-5 shadow-sm open:border-primary/40">
                <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-left font-medium [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <p className="pb-4 text-sm leading-6 text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
