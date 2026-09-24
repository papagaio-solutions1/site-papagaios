import { Reveal } from "@/components/animations/Reveal";

// Fatos reais (sem métricas inventadas).
const stats = [
  { value: "2012", label: "No mercado desde" },
  { value: "24/7", label: "Automação que não para" },
  { value: "Soluções", label: "Sob medida" },
  { value: "Python", label: "Engenharia própria" },
];

// Segmentos reais atendidos (derivados dos cases em produção).
const segments = [
  "Clínicas e consultórios",
  "Delivery",
  "Vending fitness",
  "Vendas e prospecção B2B",
];

export function SocialProof() {
  return (
    <section className="border-y border-border bg-secondary/50 py-14">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-center text-sm uppercase tracking-wider text-muted-foreground">
            Sistemas em produção em diferentes segmentos
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {segments.map((name) => (
              <span key={name} className="text-base font-semibold text-foreground/70">
                {name}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <dl className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <dt className="bg-gradient-to-r from-primary to-highlight bg-clip-text text-4xl font-semibold text-transparent">
                  {stat.value}
                </dt>
                <dd className="mt-2 text-sm text-muted-foreground">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
