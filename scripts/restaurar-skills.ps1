<#
.SYNOPSIS
  Restaura as junctions das skills do site-papagaios a partir do skill-library do Processo-Padrao.
.DESCRIPTION
  As skills NAO sao versionadas (ver .gitignore: .claude/skills/ e .agents/skills/) — seguem o
  mecanismo #1 do Processo-Padrao (junction/link fisico para a fonte unica). Este script recria os
  links em qualquer maquina. Idempotente e nao-destrutivo: so cria o que falta.
.PARAMETER SkillLibrary
  Caminho do skill-library do Processo-Padrao. Padrao: irmao deste repo em ../Processo-Padrao.
.EXAMPLE
  pwsh scripts/restaurar-skills.ps1
  pwsh scripts/restaurar-skills.ps1 -SkillLibrary "D:\outro\Processo-Padrao\skill-library"
#>
param(
  [string]$SkillLibrary
)
$ErrorActionPreference = 'Stop'
$projeto = Split-Path -Parent $PSScriptRoot
if (-not $SkillLibrary) {
  $SkillLibrary = Join-Path (Split-Path -Parent $projeto) 'Processo-Padrao\skill-library'
}
if (-not (Test-Path -LiteralPath $SkillLibrary)) { throw "skill-library nao encontrado: $SkillLibrary" }

# Conjunto de skills ativas deste projeto: especificas do site + nucleo compartilhado.
$skills = @(
  'especialista-react','especialista-front-end','ux-ui-design',
  'especialista-banco-dados','especialista-aws','especialista-qa',
  'escritor-tecnico','engenheiro-de-prompt','orquestrador-claude-code',
  'curador-de-conhecimento','monitor-contexto-tokens','fechar-spec'
)

$criadas = 0; $existiam = 0; $faltando = @()
foreach ($base in @('.claude/skills','.agents/skills')) {
  $baseDir = Join-Path $projeto $base
  New-Item -ItemType Directory -Force -Path $baseDir | Out-Null
  foreach ($s in $skills) {
    $alvo = Join-Path $SkillLibrary $s
    if (-not (Test-Path -LiteralPath $alvo)) { $faltando += "$s (fonte ausente)"; continue }
    $link = Join-Path $baseDir $s
    if (Test-Path -LiteralPath $link) { $existiam++; continue }
    New-Item -ItemType Junction -Path $link -Target $alvo | Out-Null
    $criadas++
  }
}
Write-Host ("restaurar-skills: {0} criadas, {1} ja existiam, {2} skills x 2 destinos" -f $criadas, $existiam, $skills.Count) -ForegroundColor Green
if ($faltando.Count) { Write-Host ("  ATENCAO faltando: " + ($faltando -join ', ')) -ForegroundColor Yellow }
