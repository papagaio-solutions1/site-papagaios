import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { buttonVariants } from "@/components/ui/button";
import { cases } from "@/lib/cases";
import { cn } from "@/lib/utils";

export function Cases() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Cases"
          title="Sistemas reais, rodando em produção"
          description="Ecossistemas de IA, automação e dashboards que a Papagaios Solutions construiu para resolver gargalos operacionais."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {cases.map((item, i) => (
            <Reveal key={item.slug} delay={(i % 2) * 0.1}>
              <Link
                href={`/cases/${item.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
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
                  <h3 className="mt-2 text-xl font-semibold">{item.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                    {item.summary}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.services.map((service) => (
                      <span
                        key={service}
                        className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-transform group-hover:translate-x-0.5">
                    Ver case completo
                    <ArrowRight className="size-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/cases" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
            Ver todos os cases
          </Link>
        </div>
      </div>
    </section>
  );
}
