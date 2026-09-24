import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/animations/Reveal";
import { siteConfig } from "@/lib/site";

const btnBase =
  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-md px-8 text-base font-semibold transition-colors sm:w-auto";

export function CTA() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ff8a4d] via-primary to-highlight px-6 py-16 text-center text-white sm:px-12">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Pronto para automatizar suas vendas com IA?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
              Agende uma conversa e descubra, em minutos, onde a automação pode
              gerar mais receita no seu negócio.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={siteConfig.scheduleCta.href}
                className={`${btnBase} bg-white text-primary shadow-lg hover:bg-white/90`}
              >
                {siteConfig.scheduleCta.label}
                <ArrowRight />
              </a>
              <Link
                href="/servicos"
                className={`${btnBase} border border-white/50 text-white hover:bg-white/10`}
              >
                Conhecer os serviços
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
