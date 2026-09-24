import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { buttonVariants } from "@/components/ui/button";
import { cases, getCase } from "@/lib/cases";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getCase(slug);
  if (!item) return { title: "Case não encontrado" };
  return {
    title: item.name,
    description: item.summary,
    openGraph: {
      title: `${item.name} | ${siteConfig.name}`,
      description: item.summary,
      images: [item.images[0].src],
    },
  };
}

function Block({ label, children }: { label: string; children: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
        {label}
      </h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{children}</p>
    </div>
  );
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getCase(slug);
  if (!item) notFound();

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-secondary to-background">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <Link
              href="/cases"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Todos os cases
            </Link>
            <span className="mt-6 block text-sm font-semibold uppercase tracking-wider text-primary">
              {item.segment}
            </span>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
              {item.name}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
              {item.overview}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {item.services.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Capa */}
        <section>
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
              <Image
                src={item.images[0].src}
                alt={item.images[0].alt}
                width={item.images[0].w}
                height={item.images[0].h}
                className="h-auto w-full"
                priority
                sizes="(min-width: 1024px) 1024px, 100vw"
              />
            </div>
          </div>
        </section>

        {/* Desafio / Solução / Resultado */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 md:grid-cols-3">
              <Block label="Desafio">{item.challenge}</Block>
              <Block label="Solução">{item.solution}</Block>
              <Block label="Resultado">{item.result}</Block>
            </div>
          </div>
        </section>

        {/* Destaques + Tecnologias */}
        <section className="border-y border-border bg-secondary/50 py-16 sm:py-20">
          <div className="mx-auto grid max-w-5xl gap-10 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Destaques</h2>
              <ul className="mt-5 space-y-3">
                {item.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="size-3.5" />
                    </span>
                    <span className="text-sm text-muted-foreground">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Tecnologias</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {item.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Galeria */}
        {item.images.length > 1 ? (
          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-semibold tracking-tight">Telas do projeto</h2>
              <div className="mt-8 gap-5 [column-fill:_balance] sm:columns-2">
                {item.images.slice(1).map((img) => (
                  <div
                    key={img.src}
                    className="mb-5 break-inside-avoid overflow-hidden rounded-xl border border-border bg-muted shadow-sm"
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={img.w}
                      height={img.h}
                      className="h-auto w-full"
                      sizes="(min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* CTA */}
        <section className="pb-20 sm:pb-24">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Tem um desafio parecido?
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
                href="/cases"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                Ver outros cases
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
