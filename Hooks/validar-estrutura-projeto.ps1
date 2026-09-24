<#
  validar-estrutura-projeto.ps1 — Hook SessionStart (NUDGE, nunca bloqueia).

  Compara a árvore do repo atual contra o molde canônico (Hooks/lib-molde-estrutura.ps1) e injeta
  no contexto o que falta: pastas ausentes, variante 13/14 divergente e pastas sem documento.md.
  Mata o retrabalho de "ler o repo inteiro para descobrir o que existe" no início da sessão.

  Detecção de tipo: 'agentes/' -> Agent; '01_Negocio' ou '00_Indice_Mestre' -> Produto; senão sai calado.
  Falha SEGURA: qualquer erro -> não injeta nada e sai 0 (nunca quebra o SessionStart).
#>
$ErrorActionPreference = 'Stop'
try {
  $root = $env:CLAUDE_PROJECT_DIR
  if (-not $root) { $root = (Get-Location).Path }

  $libPath = Join-Path $PSScriptRoot 'lib-molde-estrutura.ps1'
  if (-not (Test-Path $libPath)) { exit 0 }
  . $libPath

  $hasAgent   = Test-Path (Join-Path $root 'agentes')
  $hasProduto = (Test-Path (Join-Path $root '01_Negocio')) -or (Test-Path (Join-Path $root '00_Indice_Mestre'))
  if (-not $hasAgent -and -not $hasProduto) { exit 0 }  # repo sem estrutura de molde: nada a validar

  if ($hasAgent) {
    $type = 'Agent'; $variant = $null
    $expected = Get-MoldeFolders -Type Agent
  } else {
    $type = 'Produto'
    if (Test-Path (Join-Path $root '13_Mendix'))      { $variant = 'Presencial' }
    elseif (Test-Path (Join-Path $root '13_User_Stories')) { $variant = 'Digital' }
    else { $variant = 'Digital' }
    $expected = Get-MoldeFolders -Type Produto -Variant $variant
  }

  $missing = @()
  foreach ($rel in $expected) {
    if (-not (Test-Path (Join-Path $root $rel))) { $missing += $rel }
  }

  # Pastas de topo do molde que existem mas não têm documento.md nem README.md
  $semDoc = @()
  $topDirs = ($expected | ForEach-Object { ($_ -split '/')[0] } | Select-Object -Unique)
  foreach ($d in $topDirs) {
    $full = Join-Path $root $d
    if (Test-Path $full) {
      $temDoc = (Test-Path (Join-Path $full 'documento.md')) -or (Test-Path (Join-Path $full 'README.md'))
      if (-not $temDoc) { $semDoc += $d }
    }
  }

  # Divergência de nomenclatura conhecida (retrabalho recorrente)
  $avisos = @()
  if ((Test-Path (Join-Path $root 'Conversa_Agentes')) -and (Test-Path (Join-Path $root '_Conversas_Agentes'))) {
    $avisos += "Duplicidade: 'Conversa_Agentes' e '_Conversas_Agentes' coexistem (canonico e '_Conversas_Agentes')."
  } elseif ((Test-Path (Join-Path $root 'Conversa_Agentes')) -and -not (Test-Path (Join-Path $root '_Conversas_Agentes'))) {
    $avisos += "Nomenclatura: usa 'Conversa_Agentes'; o canonico do molde e '_Conversas_Agentes'."
  }

  if ($missing.Count -eq 0 -and $semDoc.Count -eq 0 -and $avisos.Count -eq 0) { exit 0 }

  $sb = [System.Text.StringBuilder]::new()
  [void]$sb.AppendLine("Estrutura do repo (molde $type$(if($variant){" / $variant"})) — verificacao automatica:")
  if ($missing.Count -gt 0) {
    [void]$sb.AppendLine("- Pastas faltando ($($missing.Count)): " + ($missing -join ', '))
  }
  if ($semDoc.Count -gt 0) {
    [void]$sb.AppendLine("- Sem documento.md/README ($($semDoc.Count)): " + ($semDoc -join ', '))
  }
  foreach ($a in $avisos) { [void]$sb.AppendLine("- $a") }
  [void]$sb.AppendLine("Corrigir: scripts/propagar_estrutura.ps1 (pastas) + scripts/propagar-documentos-pastas.ps1 (documento.md). Nudge, nao bloqueia.")

  $ctx = $sb.ToString()
  $out = @{ hookSpecificOutput = @{ hookEventName = 'SessionStart'; additionalContext = $ctx } }
  $out | ConvertTo-Json -Depth 6 -Compress | Write-Output
  exit 0
} catch {
  exit 0
}
