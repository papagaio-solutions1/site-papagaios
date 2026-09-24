import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  Cpu,
  Database,
  GitBranch,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

import { Reveal } from "@/components/animations/Reveal";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "A Papagaios Solutions IA desenvolve sistemas sob medida, plataformas SaaS, chatbots com IA e automação de processos — unindo inteligência artificial, dados e segurança da informação para acelerar negócios.",
};

const stats = [
  { value: "Sob medida", label: "Soluções 100% próprias" },
  { value: "IA · Dados", label: "Automação ponta a ponta" },
  { value: "24/7", label: "Agentes sempre ativos" },
  { value: "LGPD", label: "Segurança da informação" },
];

// Abordagem em 3 passos (substitui a antiga "trajetória" com datas da Mídia 5D).
const abordagem = [
  {
    step: "01",
    title: "Diagnóstico",
    text: "Entendemos o seu processo e mapeamos onde a IA e a automação geram mais valor.",
  },
  {
    step: "02",
    title: "Solução sob medida",
    text: "Projetamos e construímos agentes de IA, automações e dashboards para o seu negócio — nada de template genérico.",
  },
  {
    step: "03",
    title: "Operação & evolução",
    text: "Colocamos em produção, medimos resultados e evoluímos a solução continuamente.",
  },
];

const values = [
  {
    icon: Bot,
    title: "IA aplicada ao negócio",
    text: "Agentes e chatbots que assumem tarefas repetitivas e atendem 24/7 — sempre desenhados para o seu processo, não em templates genéricos.",
  },
  {
    icon: Database,
    title: "Dados de ponta a ponta",
    text: "Da ingestão à geração de valor: pipelines confiáveis, modelagem e dashboards que transformam dados em decisão.",
  },
  {
    icon: ShieldCheck,
    title: "Segurança por princípio",
    text: "Proteção da informação no centro da arquitetura, com governança técnica e infraestrutura robusta.",
  },
  {
    icon: Workflow,
    title: "Automação e escala",
    text: "Mentalidade orientada a reduzir trabalho manual e elevar o nível das entregas — pensadas para crescer com você.",
  },
];

const especialidades = [
  { icon: Database, label: "Engenharia de Dados" },
  { icon: Workflow, label: "Python · Airflow · Pentaho" },
  { icon: BarChart3, label: "SQL · ETL · Power BI" },
  { icon: Bot, label: "Agentes de IA & n8n" },
  { icon: Cpu, label: "Big Data & escala" },
];

/** Decoração de fundo: malha pontilhada (rede neural) + brilho dourado. */
function ConstellationBackdrop() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem]"
        style={{
          background:
            "radial-gradient(48rem 32rem at 50% -10%, rgba(199,137,10,0.16), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(199,137,10,0.12) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          maskImage:
            "radial-gradient(ellipse 75% 55% at 50% 0%, black 25%, transparent 100%)",
        }}
      />
    </>
  );
}

export default function SobrePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-secondary to-background">
          <ConstellationBackdrop />
          <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-28 lg:px-8">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
                <Sparkles className="size-3.5 text-primary" />
                Quem é a Papagaios Solutions
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
                Tecnologia que{" "}
                <span className="bg-gradient-to-r from-primary to-highlight bg-clip-text text-transparent">
                  acelera o seu negócio
                </span>{" "}
                com IA
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                A{" "}
                <strong className="font-semibold text-foreground">
                  Papagaios Solutions IA
                </strong>{" "}
                desenvolve sistemas sob medida, plataformas SaaS, chatbots com IA
                e automação de processos. Unimos inteligência artificial,
                engenharia de dados e segurança da informação para tirar o
                trabalho repetitivo das pessoas e entregar resultados que escalam.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-border bg-card">
          <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
            <dl className="grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4 sm:divide-y-0">
              {stats.map((s) => (
                <div key={s.label} className="px-6 py-8 text-center sm:py-10">
                  <dt className="bg-gradient-to-r from-primary to-highlight bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl">
                    {s.value}
                  </dt>
                  <dd className="mt-1.5 text-sm text-muted-foreground">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Manifesto */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <Reveal>
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                Nosso propósito
              </span>
              <p className="mt-5 text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
                Unimos{" "}
                <span className="text-primary">dados, inteligência artificial</span>{" "}
                e automação para tirar o trabalho repetitivo das pessoas — e
                devolver tempo, escala e decisões melhores para o negócio.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Diferenciais (bento) */}
        <section className="bg-secondary/40 py-20 sm:py-24">
          <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                O que nos move
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Princípios que guiam cada solução que entregamos.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {values.map(({ icon: Icon, title, text }, i) => (
                <Reveal key={title} delay={i * 0.06}>
                  <div className="group h-full rounded-3xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-highlight text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                      <Icon className="size-6" />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold tracking-tight">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Como trabalhamos (abordagem) */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Nossa abordagem
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Um processo simples e eficiente, do desafio ao resultado.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {abordagem.map((item, i) => (
                <Reveal key={item.step} delay={i * 0.08}>
                  <div className="relative h-full overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-sm">
                    <span
                      aria-hidden
                      className="absolute right-0 top-0 h-1.5 w-full bg-gradient-to-r from-primary to-highlight"
                    />
                    <span className="bg-gradient-to-r from-primary to-highlight bg-clip-text text-4xl font-semibold tracking-tight text-transparent">
                      {item.step}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Equipe */}
        <section className="border-t border-border bg-secondary/40 py-20 sm:py-28">
          <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
            <Reveal>
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                Equipe
              </span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Quem faz a Papagaios Solutions
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Governança técnica e engenharia de dados orientadas a resultados.
              </p>
            </Reveal>

            {/* [DEMO Etapa 2] Perfil do time — confirmar nome, foto e bio oficiais
                da Papagaios Solutions antes de publicar. */}
            <Reveal>
              <article className="group relative mt-8 overflow-hidden rounded-3xl border border-border bg-card shadow-sm ring-1 ring-black/[0.02] transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/10">
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-primary to-highlight"
                />
                <div className="grid gap-0 lg:grid-cols-[22rem_1fr]">
                  {/* Foto */}
                  <div className="relative p-5 sm:p-6">
                    <div className="relative">
                      {/* Cantos dourados — motivo do background da marca */}
                      <span className="absolute -left-1.5 -top-1.5 z-10 size-4 rounded-md bg-highlight shadow" />
                      <span className="absolute -right-1.5 -top-1.5 z-10 size-4 rounded-md bg-highlight shadow" />
                      <span className="absolute -bottom-1.5 -left-1.5 z-10 size-4 rounded-md bg-highlight shadow" />
                      <span className="absolute -bottom-1.5 -right-1.5 z-10 size-4 rounded-md bg-highlight shadow" />
                      <Image
                        src="/team/jose-augusto.webp"
                        alt="José Augusto Palermo"
                        width={720}
                        height={720}
                        sizes="(min-width: 1024px) 22rem, 100vw"
                        className="aspect-square w-full rounded-2xl object-cover shadow-lg"
                      />
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="flex flex-col p-6 pt-0 sm:p-8 lg:pl-2">
                    <h4 className="text-2xl font-semibold tracking-tight">
                      José Augusto Palermo
                    </h4>
                    <p className="mt-1 text-sm font-medium text-primary">
                      Fundador · Especialista em Dados &amp; IA
                    </p>

                    <div className="mt-5 space-y-4 text-sm leading-6 text-muted-foreground">
                      <p>
                        Constrói soluções inteligentes de dados de ponta a ponta —
                        da ingestão à geração de valor — unindo visão de negócio a
                        uma execução técnica orientada a resultados.
                      </p>
                      <p>
                        Projeta e mantém pipelines de dados em{" "}
                        <strong className="font-medium text-foreground">
                          Python, Pentaho e Apache Airflow
                        </strong>
                        , com modelagem de dados, SQL avançado, processos ETL e
                        dashboards interativos no Power BI — transformando dados em
                        insights acionáveis, com atenção a Big Data e arquiteturas
                        para processamento em larga escala.
                      </p>
                      <p>
                        Incorpora ao stack ferramentas de ponta —{" "}
                        <strong className="font-medium text-foreground">
                          GitHub, n8n, Antigravity e Claude Code
                        </strong>{" "}
                        — para acelerar o desenvolvimento assistido por IA, sempre
                        com foco em automação, escalabilidade e inovação.
                      </p>
                    </div>

                    {/* Especialidades */}
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {especialidades.map(({ icon: Icon, label }) => (
                        <li
                          key={label}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-foreground"
                        >
                          <Icon className="size-3.5 text-primary" />
                          {label}
                        </li>
                      ))}
                    </ul>

                    <a
                      href="https://github.com/josefarias3108"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-highlight"
                    >
                      <GitBranch className="size-4" />
                      Ver projetos no GitHub
                      <ArrowUpRight className="size-4" />
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#e0b34d] via-primary to-highlight py-20 text-white sm:py-24">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Vamos acelerar o seu negócio com IA?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
              Conte seu desafio operacional e desenhamos a solução ideal.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={siteConfig.scheduleCta.href}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-white text-primary hover:bg-white/90",
                )}
              >
                {siteConfig.scheduleCta.label}
                <ArrowRight />
              </a>
              <Link
                href={siteConfig.cta.href}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-white/70 bg-transparent text-white hover:bg-white/10 hover:text-white",
                )}
              >
                {siteConfig.cta.label}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
