import { Info } from "lucide-react";

/**
 * Aviso de modo demonstração (Etapa 2, sem backend). Usado onde a funcionalidade
 * depende do Supabase (login, área do cliente, envio de formulário) — deixa claro
 * que é demo, sem apresentar recurso simulado como se estivesse integrado.
 */
export function DemoBackendNotice() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-highlight/40 bg-highlight/10 p-4 text-sm">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-highlight/15 text-highlight">
        <Info className="size-4" />
      </span>
      <div>
        <p className="font-semibold">Recurso disponível na próxima etapa</p>
        <p className="mt-1 text-muted-foreground">
          Esta é a versão de demonstração do site (sem backend). Login, área do
          cliente e envio de formulários serão ativados quando o Supabase for
          integrado. Para falar agora, use o botão do WhatsApp ou o assistente Guto.
        </p>
      </div>
    </div>
  );
}
