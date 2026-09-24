#!/usr/bin/env python3
"""
Hook anti-segredo (PreToolUse / Bash) — núcleo Processo Padrão.

Regra da fábrica: "nunca mandar credenciais para o Git". Este hook BLOQUEIA `git add`/`git commit`
prestes a versionar segredo. Recebe o JSON do tool call no stdin e, se achar problema, devolve
permissionDecision="deny" + motivo em pt-BR.

É o único hook de BLOQUEIO do programa; os demais só injetam aviso. Vale para TODOS os projetos da
Tribo (é genérico — sem padrões específicos de produto). Cada produto pode estender a lista via
`Hooks/check_secrets.local.py` no próprio repo (opcional; se existir, é importado e seus padrões são
somados — ver `carregar_extensao_local`).

O que bloqueia:
  1. Arquivos sensíveis no stage: `.env` (qualquer, menos `.env.example`), sessões/cookies, ou chaves
     (`.pem/.key/.p12/.pfx`).
  2. `git add` explícito desses arquivos, ou `git add --force` com segredo ignorado no disco.
  3. Conteúdo (no commit, só linhas adicionadas): chave privada, `sk-`/`gsk-` (OpenAI/GROQ), AWS key,
     JWT (`eyJ...`), string de conexão Postgres/MySQL com senha, atribuição de senha/token, e CPF.
     Exceção de conteúdo: a própria pasta de hooks e `.env.example`.

Falha de forma SEGURA: qualquer erro interno -> NÃO bloqueia (exit 0), para nunca travar o trabalho por
bug do hook. É defesa-em-profundidade, não a única barreira — a disciplina vem primeiro.
"""
import sys
import os
import re
import json
import subprocess
import importlib.util


def git(args):
    try:
        r = subprocess.run(["git"] + args, capture_output=True, text=True,
                           encoding="utf-8", errors="replace", timeout=10)
        return r.stdout
    except Exception:
        return ""


def allow():
    sys.exit(0)


def deny(reasons):
    corpo = "\n".join(f"  - {r}" for r in reasons)
    msg = (
        "git BLOQUEADO pelo hook anti-segredo (regra: nunca mandar credenciais ao Git).\n\n"
        f"{corpo}\n\n"
        "Segredos (.env, tokens, chaves .pem/SSH, senha/token, CPF) nao podem ir ao Git. "
        "Tire do stage (`git restore --staged <arquivo>`), confirme o .gitignore, e tente de novo."
    )
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",
            "permissionDecisionReason": msg,
        }
    }))
    sys.exit(0)


def is_forbidden_name(path):
    base = path.strip().strip('"').strip("'")
    if not base:
        return False
    if base.endswith(".env.example"):
        return False
    name = base.split("/")[-1]
    if re.match(r"\.env(\..+)?$", name):          # .env, .env.local, .env.prod...
        return True
    if name.endswith((".session", "_session.json", "_cookies.json")):
        return True
    if base.endswith((".pem", ".key", ".p12", ".pfx")):
        return True
    return False


# Padrões de conteúdo genéricos (label, regex). Extensível por repo via check_secrets.local.py.
SECRET_PATTERNS = [
    (re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----"), "chave privada"),
    (re.compile(r"\bgsk_[A-Za-z0-9]{20,}\b"), "GROQ API key (gsk_...)"),
    (re.compile(r"\bsk-[A-Za-z0-9]{20,}\b"), "API key estilo OpenAI (sk-...)"),
    (re.compile(r"AKIA[0-9A-Z]{16}"), "AWS access key"),
    (re.compile(r"\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}"),
     "JWT (provavel token/anon/service_role)"),
    (re.compile(r"(?:postgresql|mysql)(?:\+\w+)?://[^:@/\s]+:[^@/\s]+@"),
     "string de conexao de banco com senha"),
    (re.compile(r"(?i)\b(password|senha|secret|token|api[_-]?key|apikey)\b\s*[:=]\s*['\"]?\S{6,}"),
     "credencial atribuida (senha/token)"),
    (re.compile(r"\b\d{3}\.\d{3}\.\d{3}-\d{2}\b"), "CPF"),
]

# Prefixos de caminho isentos da checagem de CONTEÚDO (contêm os padrões por natureza).
CONTENT_EXEMPT_PREFIXES = ("Hooks/", ".claude/hooks/")


def carregar_extensao_local():
    """Se existir Hooks/check_secrets.local.py com SECRET_PATTERNS/FORBIDDEN_SUFFIXES, soma-os."""
    try:
        local = os.path.join("Hooks", "check_secrets.local.py")
        if not os.path.exists(local):
            return
        spec = importlib.util.spec_from_file_location("check_secrets_local", local)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        extra = getattr(mod, "SECRET_PATTERNS", None)
        if extra:
            for pat, label in extra:
                SECRET_PATTERNS.append((re.compile(pat) if isinstance(pat, str) else pat, label))
    except Exception:
        # Extensão local nunca pode quebrar o hook.
        return


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        allow()

    cmd = (data.get("tool_input") or {}).get("command", "") or ""

    # Só age em git add / git commit.
    if not re.search(r"\bgit\s+(add|commit)\b", cmd):
        allow()

    carregar_extensao_local()

    is_commit = bool(re.search(r"\bgit\s+commit\b", cmd))
    is_add = bool(re.search(r"\bgit\s+add\b", cmd))
    force = bool(re.search(r"(?:\s-\w*f\b)|(?:\s--force\b)", cmd))

    reasons = []

    # (1) Arquivos sensíveis já no stage.
    for f in git(["diff", "--cached", "--name-only"]).splitlines():
        if is_forbidden_name(f):
            reasons.append(f"Arquivo sensivel no stage: {f}")

    # (2) git add explícito / force.
    if is_add:
        for tok in cmd.split():
            if tok.startswith("-"):
                continue
            if is_forbidden_name(tok):
                reasons.append(f"git add de arquivo sensivel: {tok}")
        if force:
            for cand in (".env",):
                if os.path.exists(cand):
                    reasons.append(f"git add --force pode versionar segredo ignorado: {cand}")

    # (3) Conteúdo (apenas no commit, sobre linhas adicionadas).
    if is_commit:
        cur_file = None
        for line in git(["diff", "--cached", "--unified=0"]).splitlines():
            if line.startswith("+++ b/"):
                cur_file = line[6:]
                continue
            if not line.startswith("+") or line.startswith("+++"):
                continue
            if cur_file and (cur_file.startswith(CONTENT_EXEMPT_PREFIXES) or cur_file.endswith(".env.example")):
                continue
            content = line[1:]
            for pat, label in SECRET_PATTERNS:
                if pat.search(content):
                    reasons.append(f"{label} em {cur_file}")

    reasons = list(dict.fromkeys(reasons))  # dedup, preserva ordem
    if reasons:
        deny(reasons)
    allow()


def precommit():
    """Modo git pre-commit: varre o stage direto (sem JSON no stdin). Bloqueia com exit 1 se achar
    segredo; qualquer erro interno -> exit 0 (falha aberta, nunca trava por bug do hook)."""
    carregar_extensao_local()
    reasons = []
    for f in git(["diff", "--cached", "--name-only"]).splitlines():
        if is_forbidden_name(f):
            reasons.append(f"Arquivo sensivel no stage: {f}")
    cur_file = None
    for line in git(["diff", "--cached", "--unified=0"]).splitlines():
        if line.startswith("+++ b/"):
            cur_file = line[6:]
            continue
        if not line.startswith("+") or line.startswith("+++"):
            continue
        if cur_file and (cur_file.startswith(CONTENT_EXEMPT_PREFIXES) or cur_file.endswith(".env.example")):
            continue
        content = line[1:]
        for pat, label in SECRET_PATTERNS:
            if pat.search(content):
                reasons.append(f"{label} em {cur_file}")
    reasons = list(dict.fromkeys(reasons))
    if reasons:
        corpo = "\n".join(f"  - {r}" for r in reasons)
        sys.stderr.write(
            "pre-commit BLOQUEADO pelo hook anti-segredo:\n" + corpo +
            "\nTire do stage (`git restore --staged <arquivo>`) e confirme o .gitignore.\n"
        )
        sys.exit(1)
    sys.exit(0)


if __name__ == "__main__":
    try:
        if len(sys.argv) > 1 and sys.argv[1] == "precommit":
            precommit()
        else:
            main()
    except Exception:
        # Nunca trava o git por erro do próprio hook.
        sys.exit(0)
