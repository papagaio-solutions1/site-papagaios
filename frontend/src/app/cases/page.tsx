import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { buttonVariants } from "@/components/ui/button";
import { cases } from "@/lib/cases";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Cases",
  description:
    "Sistemas de IA, automação e dashboards que a Papagaios Solutions construiu e mantém em produção — agendamento de clínicas, prospecção no WhatsApp, delivery e vending fitness.",
};

export default function CasesPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-secondary to-background">
          <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Cases
            </span>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Sistemas reais, rodando em produção
            </h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Ecossistemas de IA, automação e dashboards que resolvem gargalos
              operacionais de ponta a ponta.
            </p>
          </div>
        </section>

        {/* Grade de cases */}
        <section className="pb-8">
          <div className="mx-auto grid max-w-[90rem] gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            {cases.map((item) => (
              <Link
                key={item.slug}
                href={`/cases/${item.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="aspect-[16/10] overflow-hidden bg-muted">
                  <Image
                    src={item.images[0].src}
                    alt={item.images[0].alt}
                    width={item.images[0].w}
                    height={item.images[0].h}
                    className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {item.segment}
                  </span>
                  <h2 className="mt-2 text-xl font-semibold">{item.name}</h2>
                  <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                    {item.summary}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.services.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-transform group-hover:translate-x-0.5">
                    Ver case completo
                    <ArrowRight className="size-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Tem um gargalo parecido na sua operação?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Vamos desenhar o ecossistema de automação ideal para o seu negócio.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={siteConfig.scheduleCta.href}
                className={cn(buttonVariants({ size: "lg" }))}
              >
                {siteConfig.scheduleCta.label}
                <ArrowRight />
              </a>
              <Link
                href={siteConfig.cta.href}
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
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
