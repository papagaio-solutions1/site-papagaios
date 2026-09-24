<#
.SYNOPSIS
  Rotaciona barramentos locais sem perder histórico ou pendências.
.DESCRIPTION
  Mantém ask/todo no ativo; arquiva note/handoff/done mais antigos que RetentionDays e eventos
  mecânicos legados. Linhas inválidas permanecem no ativo. Usa lock compartilhado com bus.ps1,
  deduplica arquivos de histórico e substitui o ativo atomicamente.
#>
[CmdletBinding(SupportsShouldProcess=$true)]
param(
  [string]$ProjectRoot,
  [switch]$Todos,
  [switch]$TestMode,
  [ValidateRange(1,3650)]
  [int]$RetentionDays = 30
)

$ErrorActionPreference = 'Stop'
$canonicalRoot = Split-Path -Parent $PSScriptRoot
. (Join-Path $PSScriptRoot 'projetos-barramento.ps1')

function Resolve-Full([string]$Path) { [IO.Path]::GetFullPath($Path).TrimEnd('\','/') }
function Enter-BusLock([string]$Path, [int]$TimeoutSeconds = 30) {
  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  do {
    try { return [IO.File]::Open($Path,[IO.FileMode]::OpenOrCreate,[IO.FileAccess]::ReadWrite,[IO.FileShare]::None) }
    catch [IO.IOException] { Start-Sleep -Milliseconds 100 }
  } while ((Get-Date) -lt $deadline)
  throw "Timeout aguardando lock do barramento: $Path"
}
function Replace-Atomic([string]$Temp, [string]$Destination) {
  if (Test-Path -LiteralPath $Destination) {
    $backup = "$Destination.bak"
    [IO.File]::Replace($Temp,$Destination,$backup,$true)
    Remove-Item -LiteralPath $backup -Force -ErrorAction SilentlyContinue
  } else {
    Move-Item -LiteralPath $Temp -Destination $Destination
  }
}

$allowed = @(Get-ProjetosBarramento -CanonicalRoot $canonicalRoot | ForEach-Object { Resolve-Full $_ })
if ($Todos) { $roots = @($allowed | Where-Object { Test-Path -LiteralPath $_ -PathType Container }) }
elseif ($ProjectRoot) {
  $root = Resolve-Full $ProjectRoot
  $testBase = Resolve-Full (Join-Path $canonicalRoot '.tmp-bus-rotation-test')
  if ($root -notin $allowed -and -not ($TestMode -and $root.StartsWith($testBase,[StringComparison]::OrdinalIgnoreCase))) {
    throw "Projeto fora da allowlist: $root"
  }
  $roots = @($root)
} else { $roots = @((Resolve-Full $canonicalRoot)) }

$cutoff = (Get-Date).AddDays(-$RetentionDays)
$utf8 = [Text.UTF8Encoding]::new($false)
foreach ($root in $roots) {
  $dir = Join-Path $root 'Conversa_Agentes'
  $bus = Join-Path $dir 'BARRAMENTO.jsonl'
  if (-not (Test-Path -LiteralPath $bus -PathType Leaf)) { continue }
  $lock = Enter-BusLock (Join-Path $dir 'BARRAMENTO.jsonl.lock')
  try {
    $keep = [Collections.Generic.List[string]]::new()
    $archiveByMonth = @{}
    $invalid = 0
    foreach ($line in (Get-Content -LiteralPath $bus -Encoding utf8)) {
      if (-not $line.Trim()) { continue }
      try { $entry = $line | ConvertFrom-Json } catch { $entry = $null }
      if (-not $entry) { $keep.Add($line); $invalid++; continue }
      $ts = try { [datetimeoffset]$entry.ts } catch { $null }
      $mechanical = [string]$entry.type -in @('session-start','session-end')
      $oldClosed = $ts -and $ts -lt $cutoff -and [string]$entry.type -in @('note','handoff','done')
      if ($mechanical -or $oldClosed) {
        $month = if ($ts) { $ts.ToString('yyyy-MM') } else { 'sem-data' }
        if (-not $archiveByMonth.ContainsKey($month)) { $archiveByMonth[$month] = [Collections.Generic.List[string]]::new() }
        $archiveByMonth[$month].Add($line)
      } else { $keep.Add($line) }
    }
    $archiveCount = @($archiveByMonth.Values | ForEach-Object { $_.Count } | Measure-Object -Sum).Sum
    if (-not $archiveCount) {
      Write-Output "OK: $(Split-Path $root -Leaf) sem mensagens elegíveis; inválidas preservadas=$invalid"
      continue
    }
    if (-not $PSCmdlet.ShouldProcess($bus,"Arquivar $archiveCount mensagem(ns) e manter $($keep.Count)")) { continue }
    $archiveDir = Join-Path $dir 'arquivo'
    New-Item -ItemType Directory -Path $archiveDir -Force | Out-Null
    foreach ($month in $archiveByMonth.Keys) {
      $archive = Join-Path $archiveDir "BARRAMENTO-$month.jsonl"
      $existing = if (Test-Path $archive) { @(Get-Content $archive -Encoding utf8 | Where-Object { $_.Trim() }) } else { @() }
      $unique = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
      foreach ($line in $existing) { [void]$unique.Add($line) }
      foreach ($line in $archiveByMonth[$month]) { [void]$unique.Add($line) }
      $tmpArchive = "$archive.tmp-$PID"
      [IO.File]::WriteAllText($tmpArchive, (($unique | Sort-Object) -join "`n") + "`n", $utf8)
      Replace-Atomic $tmpArchive $archive
    }
    $tmpBus = "$bus.tmp-$PID"
    $activeText = if ($keep.Count) { ($keep -join "`n") + "`n" } else { '' }
    [IO.File]::WriteAllText($tmpBus,$activeText,$utf8)
    Replace-Atomic $tmpBus $bus
    Write-Output "OK: $(Split-Path $root -Leaf) arquivadas=$archiveCount ativas=$($keep.Count) inválidas=$invalid"
  } finally { $lock.Dispose() }
}
