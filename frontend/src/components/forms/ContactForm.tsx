"use client";

import type { ReactNode } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2 } from "lucide-react";

import { submitLead, type FormState } from "@/app/contato/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialState: FormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full">
      {pending ? "Enviando..." : "Enviar mensagem"}
    </Button>
  );
}

function Field({
  label,
  name,
  error,
  required,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium">
        {label}
        {required ? <span className="text-primary"> *</span> : null}
      </label>
      {children}
      {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitLead, initialState);

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-primary/40 bg-card p-8 text-center">
        <CheckCircle2 className="mx-auto size-12 text-primary" />
        <h3 className="mt-4 text-xl font-semibold">Mensagem enviada!</h3>
        <p className="mt-2 text-muted-foreground">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.status === "error" && state.message ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-foreground">
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nome" name="name" error={state.errors?.name} required>
          <Input id="name" name="name" autoComplete="name" placeholder="Seu nome" />
        </Field>
        <Field label="Telefone" name="phone" error={state.errors?.phone} required>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="(00) 00000-0000"
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="E-mail" name="email" error={state.errors?.email} required>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="voce@empresa.com"
          />
        </Field>
        <Field label="Empresa" name="company" error={state.errors?.company}>
          <Input
            id="company"
            name="company"
            autoComplete="organization"
            placeholder="Nome da empresa"
          />
        </Field>
      </div>

      <Field label="Mensagem" name="message" error={state.errors?.message}>
        <Textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Como podemos ajudar?"
        />
      </Field>

      {/* Honeypot anti-spam — oculto para humanos */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Não preencher</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <SubmitButton />
      <p className="text-center text-xs text-muted-foreground">
        Ao enviar, você concorda em ser contatado pela Papagaios Solutions.
      </p>
    </form>
  );
}
