"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Bot, MessageSquare, Zap } from "lucide-react";

import { RotatingText } from "@/components/animations/RotatingText";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

const rotatingWords = ["Atendimentos", "Tarefas", "Processos", "BI", "Vendas"];

const highlights = [
  { icon: Bot, label: "Agentes de IA 24/7" },
  { icon: MessageSquare, label: "Chatbots no WhatsApp" },
  { icon: Zap, label: "Automação de processos" },
];

export function Hero() {
  const reduce = useReducedMotion();
  const initial = reduce ? false : "hidden";
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-secondary to-background">
      {/* Banner: foto institucional (handshake humano + robô) como pano de fundo */}
      <Image
        src="/brand/homem-robo.png"
        alt=""
        aria-hidden
        fill
        priority
        quality={100}
        sizes="100vw"
        className="pointer-events-none absolute inset-0 -z-10 object-cover object-center opacity-70 select-none"
      />
      {/* Véu branco por cima da foto — brilho central forte garante a leitura do texto */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(58rem 36rem at 50% 44%, rgba(255,255,255,0.82), rgba(255,255,255,0.4) 55%, transparent 88%), linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.58) 100%)",
        }}
      />
      {/* Brilho solar quente no topo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem]"
        style={{
          background:
            "radial-gradient(52rem 40rem at 50% -8%, rgba(199,137,10,0.18), transparent 70%)",
        }}
      />
      {/* Malha/constelação sutil — alusão à "Rede Neural Estelar" (PRD §5) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(199,137,10,0.12) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          maskImage:
            "radial-gradient(ellipse 70% 55% at 50% 0%, black 30%, transparent 100%)",
        }}
      />

      <div className="mx-auto max-w-[90rem] px-4 pb-24 pt-20 sm:px-6 sm:pt-28 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.span
            custom={0}
            initial={initial}
            animate="visible"
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-sm"
          >
            <span className="size-2 rounded-full bg-primary" />
            Agência de IA, automações e SaaS
          </motion.span>

          <motion.h1
            custom={1}
            initial={initial}
            animate="visible"
            variants={fadeUp}
            className="mt-6 text-3xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-7xl"
          >
            <span className="block">Automatize</span>
            <RotatingText
              words={rotatingWords}
              className="bg-gradient-to-r from-primary to-highlight bg-clip-text text-transparent"
            />
            <span className="block">com agentes de IA 24/7</span>
          </motion.h1>

          <motion.p
            custom={2}
            initial={initial}
            animate="visible"
            variants={fadeUp}
            className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-muted-foreground"
          >
            Criamos agentes de IA, automações e dashboards que assumem o trabalho
            repetitivo do seu negócio — atendimento, processos, dados e vendas —
            dia e noite, sem aumentar a equipe.
          </motion.p>

          <motion.div
            custom={3}
            initial={initial}
            animate="visible"
            variants={fadeUp}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href={siteConfig.scheduleCta.href}
              className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
            >
              {siteConfig.scheduleCta.label}
              <ArrowRight />
            </Link>
            <Link
              href={siteConfig.cta.href}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full sm:w-auto",
              )}
            >
              {siteConfig.cta.label}
            </Link>
          </motion.div>

          <motion.ul
            custom={4}
            initial={initial}
            animate="visible"
            variants={fadeUp}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          >
            {highlights.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Icon className="size-4 text-primary" />
                {label}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
