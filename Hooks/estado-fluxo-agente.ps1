<#
  estado-fluxo-agente.ps1 — Hook SessionStart (NUDGE, nunca bloqueia).

  Em projeto de AGENT (tem 'agentes/'), injeta em que etapa do fluxo o projeto esta
  (arquitetura -> discovery -> guilda -> implementacao), marcando os artefatos ja presentes, e
  lembra de carregar a skill de arquitetura. Acelera retomar o trabalho sem reler o repo todo.

  Falha SEGURA: qualquer erro -> nao injeta e sai 0. Busca limitada em profundidade (rapidez).
#>
$ErrorActionPreference = 'Stop'
try {
  $root = $env:CLAUDE_PROJECT_DIR
  if (-not $root) { $root = (Get-Location).Path }
  if (-not (Test-Path (Join-Path $root 'agentes'))) { exit 0 }  # so ProjetoAgent

  function Existe([string[]]$padroes) {
    foreach ($pat in $padroes) {
      $achou = Get-ChildItem -Path $root -Recurse -Depth 4 -File -Filter $pat -ErrorAction SilentlyContinue | Select-Object -First 1
      if ($achou) { return $true }
    }
    return $false
  }

  $etapas = [ordered]@{
    'Arquitetura'    = (Existe @('DESENHO_E2E.md','PASSOS_DETALHADOS.md'))
    'Discovery'      = (Existe @('PROBLEMAS.md','FONTES.md'))
    'Guilda Tecnica' = (Existe @('GUILDA_TECNICA*.md'))
    'Implementacao'  = (Existe @('PENDENCIAS.md','HANDOVER.md','*CHECKLIST.md'))
  }

  $linhas = @('Projeto de AGENT — estado do fluxo (arquitetura -> discovery -> guilda -> implementacao):')
  $prox = $null
  foreach ($k in $etapas.Keys) {
    $ok = $etapas[$k]
    $linhas += ("- {0}: {1}" -f $k, ($(if ($ok) { 'artefato presente' } else { 'pendente' })))
    if (-not $ok -and -not $prox) { $prox = $k }
  }
  if ($prox) {
    $linhas += "Proxima etapa provavel: $prox."
    if ($prox -eq 'Arquitetura') { $linhas += "Considere carregar a skill 'ai-agent-architect' (topologia/padrao) antes de codar." }
  } else {
    $linhas += "Todas as etapas tem artefato — provavel fase de manutencao/fechamento (ver skill 'fechar-spec')."
  }
  $ctx = ($linhas -join "`n")

  $out = @{ hookSpecificOutput = @{ hookEventName = 'SessionStart'; additionalContext = $ctx } }
  $out | ConvertTo-Json -Depth 6 -Compress | Write-Output
  exit 0
} catch {
  exit 0
}
