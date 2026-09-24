"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidEmail } from "@/lib/utils";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setDone(null);

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    const name = String(fd.get("name") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();

    if (!isValidEmail(email)) {
      setError("Por favor, digite um e-mail válido (ex.: nome@empresa.com).");
      return;
    }

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      setError(
        "Autenticação ainda não conectada ao banco. Tente novamente em instantes.",
      );
      return;
    }

    setLoading(true);
    const supabase = createClient();
    if (!supabase) {
      setError("Autenticação ainda não conectada ao banco.");
      setLoading(false);
      return;
    }
    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name, phone } },
        });
        if (error) throw error;
        if (data.session) {
          router.push("/painel");
          router.refresh();
        } else {
          setDone(
            "Conta criada! Verifique seu e-mail para confirmar o cadastro e depois faça login.",
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível concluir. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-xl border border-primary/40 bg-secondary/50 p-6 text-center text-sm leading-6">
        {done}
        <div className="mt-4">
          <Link href="/entrar" className="font-medium text-primary hover:underline">
            Ir para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-foreground">
          {error}
        </p>
      ) : null}

      {isSignup ? (
        <>
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
              Nome
            </label>
            <Input id="name" name="name" autoComplete="name" placeholder="Seu nome" required />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
              Telefone (WhatsApp)
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="(00) 00000-0000"
              required
            />
          </div>
        </>
      ) : null}

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
          E-mail
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="voce@empresa.com"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
          Senha
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          placeholder="••••••••"
          minLength={6}
          required
        />
      </div>

      <Button type="submit" size="lg" disabled={loading} className="w-full">
        {loading ? "Aguarde..." : isSignup ? "Criar conta" : "Entrar"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {isSignup ? (
          <>
            Já tem conta?{" "}
            <Link href="/entrar" className="font-medium text-primary hover:underline">
              Entrar
            </Link>
          </>
        ) : (
          <>
            Ainda não tem conta?{" "}
            <Link
              href="/cadastro"
              className="font-medium text-primary hover:underline"
            >
              Cadastrar
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
