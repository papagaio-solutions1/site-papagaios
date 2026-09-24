"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, User } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

function firstName(full: string) {
  return full.trim().split(/\s+/)[0];
}

export function AuthNav() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    // Etapa 2 (sem backend): Supabase não configurado → modo demo, mostra os
    // botões de entrar/cadastrar sem consultar sessão.
    if (!supabase) {
      setLoading(false);
      return;
    }
    let active = true;

    function resolve(user: { user_metadata?: { name?: string }; email?: string } | null) {
      if (!active) return;
      setName(user ? (user.user_metadata?.name ?? user.email ?? "Cliente") : null);
      setLoading(false);
    }

    supabase.auth.getSession().then(({ data }) => resolve(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) =>
      resolve(session?.user ?? null),
    );

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    setName(null);
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return <div className="h-9 w-24" aria-hidden />;
  }

  if (name) {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/painel"
          className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="size-4" />
          </span>
          <span className="hidden max-w-[10rem] truncate sm:inline">
            {firstName(name)}
          </span>
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <LogOut className="size-4" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={siteConfig.auth.login.href}
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "hidden sm:inline-flex",
        )}
      >
        {siteConfig.auth.login.label}
      </Link>
      <Link
        href={siteConfig.auth.signup.href}
        className={buttonVariants({ size: "sm" })}
      >
        {siteConfig.auth.signup.label}
      </Link>
    </div>
  );
}
