import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Mail, MessageCircle, Clock } from "lucide-react";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/forms/ContactForm";
import { DemoBackendNotice } from "@/components/DemoBackendNotice";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com um especialista da Papagaios Solutions e descubra como automatizar vendas e atendimento com agentes de IA.",
};

// NOTE: e-mail é placeholder — substituir pelo canal real.
const channels = [
  {
    icon: Mail,
    label: "E-mail",
    value: "contato@papagaiossolutions.com.br",
    href: "mailto:contato@papagaiossolutions.com.br",
  },
  {
    icon: Clock,
    label: "Atendimento",
    value: "Respondemos em horário comercial",
  },
];

export default async function ContatoPage() {
  // Etapa 2 (sem backend): página renderiza normalmente; a área do formulário
  // mostra aviso de demo. Com Supabase configurado (Etapa 3), volta a exigir login.
  const configured = isSupabaseConfigured();
  if (configured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase!.auth.getUser();
    if (!user) redirect("/entrar");
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-[90rem] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                Contato
              </span>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                Fale com um especialista
              </h1>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                Conte seu desafio de atendimento e vendas. Respondemos rápido e
                mostramos onde a automação com IA gera mais resultado no seu
                negócio.
              </p>

              {/* Handoff direto para o bot de agendamento no WhatsApp */}
              <a
                href={whatsappLink(siteConfig.scheduleCta.message)}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: "lg" }), "mt-8")}
              >
                <MessageCircle />
                {siteConfig.scheduleCta.label} no WhatsApp
              </a>
              <p className="mt-2 text-xs text-muted-foreground">
                Agende em segundos — nosso agente de IA mostra os horários
                disponíveis e envia o link da call.
              </p>

              <ul className="mt-10 space-y-5">
                {channels.map((channel) => {
                  const content = (
                    <>
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <channel.icon className="size-5" />
                      </span>
                      <span>
                        <span className="block text-sm text-muted-foreground">
                          {channel.label}
                        </span>
                        <span className="block font-medium">{channel.value}</span>
                      </span>
                    </>
                  );
                  return (
                    <li key={channel.label}>
                      {channel.href ? (
                        <a
                          href={channel.href}
                          className="flex items-center gap-4 transition-opacity hover:opacity-80"
                        >
                          {content}
                        </a>
                      ) : (
                        <div className="flex items-center gap-4">{content}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              {configured ? <ContactForm /> : <DemoBackendNotice />}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
