"use server";

import { createClient } from "@/lib/supabase/server";
import { isValidEmail } from "@/lib/utils";

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<
    Record<"name" | "phone" | "email" | "company" | "message", string>
  >;
};

// validação de e-mail centralizada em @/lib/utils → isValidEmail

export async function submitLead(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  // Honeypot: campo oculto que humanos não preenchem.
  const website = String(formData.get("website") ?? "").trim();

  if (website) {
    // Provável bot — finge sucesso sem gravar nada.
    return { status: "success", message: "Recebemos sua mensagem!" };
  }

  const errors: FormState["errors"] = {};
  if (name.length < 2) errors.name = "Informe seu nome.";
  if (phone.replace(/\D/g, "").length < 8)
    errors.phone = "Informe um telefone válido.";
  if (!isValidEmail(email))
    errors.email = "Por favor, informe um e-mail válido (ex.: nome@empresa.com).";
  if (message.length > 2000) errors.message = "Mensagem muito longa.";

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Confira os campos destacados.", errors };
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return {
      status: "error",
      message:
        "O formulário ainda não está conectado ao banco. Tente novamente em instantes.",
    };
  }

  try {
    const supabase = await createClient();
    if (!supabase) {
      return {
        status: "error",
        message:
          "O formulário ainda não está conectado ao banco. Tente novamente em instantes.",
      };
    }
    const { error } = await supabase.from("leads").insert({
      name,
      phone,
      email,
      company: company || null,
      message: message || null,
      source: "site-contato",
    });

    if (error) {
      console.error("[leads] insert error:", error.message);
      return {
        status: "error",
        message: "Não foi possível enviar agora. Tente novamente em instantes.",
      };
    }
  } catch (err) {
    console.error("[leads] unexpected error:", err);
    return {
      status: "error",
      message: "Não foi possível enviar agora. Tente novamente em instantes.",
    };
  }

  return {
    status: "success",
    message: "Recebemos sua mensagem! Em breve entraremos em contato.",
  };
}
