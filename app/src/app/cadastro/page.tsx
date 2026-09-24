import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import { AuthForm } from "@/components/forms/AuthForm";
import { DemoBackendNotice } from "@/components/DemoBackendNotice";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Cadastrar",
  description: "Crie sua conta Papagaios Solutions para agendar reuniões e falar com um especialista.",
  robots: { index: false, follow: false },
};

export default function CadastroPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-secondary to-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight">Criar sua conta</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cadastre-se para agendar reuniões e falar com um especialista.
          </p>
          <div className="mt-6">
            {isSupabaseConfigured() ? (
              <AuthForm mode="signup" />
            ) : (
              <DemoBackendNotice />
            )}
          </div>
        </div>

        <Link
          href="/"
          className="mt-6 flex items-center justify-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar ao site
        </Link>
      </div>
    </main>
  );
}
