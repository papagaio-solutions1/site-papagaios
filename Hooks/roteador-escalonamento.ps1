<#
  roteador-escalonamento.ps1 — Hook UserPromptSubmit (NUDGE, nunca bloqueia).

  Transforma as regras textuais de roteamento (CLAUDE.md §5, AGENTS.md, SETUP_CODEX.md) em recomendacao
  automatica: classifica o verbo do prompt e injeta o nivel sugerido (perfil/modelo) e se vale fan-out.
  NAO decide sozinho nem troca modelo — apenas recomenda; o lider decide.

  Roda a CADA prompt: precisa ser rapido e falha-segura (qualquer erro -> nao injeta, sai 0).
  Fica calado quando o sinal e neutro (evita ruido em todo prompt).
#>
$ErrorActionPreference = 'Stop'
try {
  $raw = [Console]::In.ReadToEnd()
  $prompt = ''
  if ($raw) {
    try { $prompt = (($raw | ConvertFrom-Json).prompt) } catch { $prompt = $raw }
  }
  if (-not $prompt) { exit 0 }
  $p = $prompt.ToLowerInvariant()

  # Grupos de verbos (pt-BR). Alto = decisao critica; Baixo = mecanico.
  $alto  = 'arquitet|topologia|decidir|decis[aã]o|migra|seguran[cç]a|revis|design|trade-?off|diagnostic|refator'
  $baixo = 'inventari|listar|list[ae]|mapear|localizar|achar|buscar|renomear|formatar|validar mecanic|checar|conferir'
  $fanout = 'todos os|todas as|cada (projeto|produto|arquivo|repo)|varredura|mapear a fonte|em paralelo|toda a base|todos os repos'

  $nivel = $null
  if ($p -match $alto)  { $nivel = 'ALTO' }
  elseif ($p -match $baixo) { $nivel = 'BAIXO' }

  $temFanout = ($p -match $fanout)
  if (-not $nivel -and -not $temFanout) { exit 0 }  # neutro: nao injeta

  $linhas = @('Roteamento sugerido (nudge, CLAUDE.md secao 5) - o lider decide:')
  if ($nivel -eq 'ALTO') {
    $linhas += "- Tarefa parece critica/arquitetural: use modelo de topo / perfil Codex 'critico' ou 'revisor'. Volte ao menor nivel ao terminar."
  } elseif ($nivel -eq 'BAIXO') {
    $linhas += "- Tarefa parece mecanica (inventario/validacao): use nivel baixo / perfil 'mecanico'. Nao gaste modelo caro por conveniencia."
  }
  if ($temFanout) {
    $linhas += "- Escopo amplo: considere fan-out (1 worker por area, ~3-5 por rodada), retorno estruturado + padrao artifact. Coordenacao pelo lider, nao barramento."
  }
  $ctx = ($linhas -join "`n")

  $out = @{ hookSpecificOutput = @{ hookEventName = 'UserPromptSubmit'; additionalContext = $ctx } }
  $out | ConvertTo-Json -Depth 6 -Compress | Write-Output
  exit 0
} catch {
  exit 0
}
