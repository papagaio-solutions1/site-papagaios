"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProfileForm({
  initialName,
  initialPhone,
  email,
}: {
  initialName: string;
  initialPhone: string;
  email: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    const supabase = createClient();
    if (!supabase) {
      setMsg({ type: "err", text: "Backend não configurado." });
      setLoading(false);
      return;
    }
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/entrar");
        return;
      }
      const cleanName = name.trim();
      const cleanPhone = phone.trim();

      // Atualiza os metadados do Auth (reflete no cabeçalho na hora)
      const { error: metaError } = await supabase.auth.updateUser({
        data: { name: cleanName, phone: cleanPhone },
      });
      if (metaError) throw metaError;

      // Atualiza a tabela de clientes
      const { error: rowError } = await supabase
        .from("clientes")
        .update({ nome: cleanName, telefone: cleanPhone })
        .eq("id", user.id);
      if (rowError) throw rowError;

      setMsg({ type: "ok", text: "Dados atualizados com sucesso!" });
      router.refresh();
    } catch (err) {
      setMsg({
        type: "err",
        text: err instanceof Error ? err.message : "Não foi possível salvar.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-5">
      {msg ? (
        <p
          className={
            msg.type === "ok"
              ? "rounded-md border border-primary/40 bg-secondary/60 px-4 py-3 text-sm text-foreground"
              : "rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-foreground"
          }
        >
          {msg.text}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Nome
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
            Telefone (WhatsApp)
          </label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            placeholder="(00) 00000-0000"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
          E-mail
        </label>
        <Input id="email" value={email} disabled className="opacity-70" />
        <p className="mt-1 text-xs text-muted-foreground">
          Para alterar o e-mail, fale com o suporte.
        </p>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Salvando..." : "Salvar alterações"}
      </Button>
    </form>
  );
}
