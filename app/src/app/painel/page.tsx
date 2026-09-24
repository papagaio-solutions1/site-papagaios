import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageCircle, MessagesSquare, LayoutGrid, ArrowRight, Phone } from "lucide-react";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProfileForm } from "@/components/forms/ProfileForm";
import { buttonVariants } from "@/components/ui/button";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { DemoBackendNotice } from "@/components/DemoBackendNotice";
import { siteConfig, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Área do cliente",
  robots: { index: false, follow: false },
};

const actions = [
  {
    icon: MessageCircle,
    title: "Agendar reunião",
    description: "Fale com nosso agente no WhatsApp e marque sua call.",
    href: whatsappLink(siteConfig.scheduleCta.message),
    external: true,
  },
  {
    icon: MessagesSquare,
    title: "Falar com um especialista",
    description: "Envie sua mensagem e nosso time retorna rápido.",
    href: "/contato",
    external: false,
  },
  {
    icon: LayoutGrid,
    title: "Conhecer os serviços",
    description: "Veja as frentes de automação da Papagaios Solutions.",
    href: "/servicos",
    external: false,
  },
];

export default async function PainelPage() {
  // Etapa 2 (sem backend): área do cliente indisponível — mostra aviso de demo.
  if (!isSupabaseConfigured()) {
    return (
      <>
        <Header />
        <main className="flex-1">
          <section className="mx-auto max-w-2xl px-4 py-24 sm:px-6 lg:px-8">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Área do cliente
            </span>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Área do cliente
            </h1>
            <div className="mt-6">
              <DemoBackendNotice />
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const supabase = (await createClient())!;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar");

  const { data: cliente } = await supabase
    .from("clientes")
    .select("nome, email, telefone")
    .eq("id", user.id)
    .maybeSingle();

  const nome =
    cliente?.nome ?? (user.user_metadata?.name as string | undefined) ?? "Cliente";
  const primeiroNome = nome.trim().split(/\s+/)[0];
  const email = cliente?.email ?? user.email ?? "";
  const telefone =
    cliente?.telefone ?? (user.user_metadata?.phone as string | undefined) ?? "";
  const cadastroIncompleto = telefone.trim() === "";

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-secondary to-background">
          <div className="mx-auto max-w-[90rem] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Área do cliente
            </span>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Olá, {primeiroNome} 👋
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Bem-vindo à sua área. Agende reuniões e fale com um especialista por aqui.
            </p>
          </div>
        </section>

        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
            {cadastroIncompleto ? (
              <div className="mb-8 flex flex-col gap-3 rounded-xl border border-highlight/40 bg-highlight/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-highlight/15 text-highlight">
                    <Phone className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Complete seu cadastro</p>
                    <p className="text-sm text-muted-foreground">
                      Falta o seu telefone (WhatsApp) — complete para agilizarmos
                      o agendamento e o atendimento.
                    </p>
                  </div>
                </div>
                <a
                  href="#dados"
                  className={cn(buttonVariants({ size: "sm" }), "shrink-0")}
                >
                  Completar agora
                </a>
              </div>
            ) : null}

            <div className="grid gap-6 lg:grid-cols-3">
              {actions.map((action) => {
                const inner = (
                  <>
                    <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <action.icon className="size-5" />
                    </div>
                    <h2 className="mt-5 text-lg font-semibold">{action.title}</h2>
                    <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                      {action.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                      Acessar
                      <ArrowRight className="size-4" />
                    </span>
                  </>
                );
                const cls =
                  "group flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md";
                return action.external ? (
                  <a
                    key={action.title}
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cls}
                  >
                    {inner}
                  </a>
                ) : (
                  <Link key={action.title} href={action.href} className={cls}>
                    {inner}
                  </Link>
                );
              })}
            </div>

            {/* Dados da conta (editável) */}
            <div
              id="dados"
              className="mt-8 max-w-2xl scroll-mt-24 rounded-2xl border border-border bg-card p-7 shadow-sm"
            >
              <h2 className="text-lg font-semibold">Seus dados</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Atualize seu nome e telefone quando precisar.
              </p>
              <ProfileForm
                initialName={nome}
                initialPhone={telefone}
                email={email}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
