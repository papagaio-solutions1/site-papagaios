# lib-molde-estrutura.ps1 — FONTE ÚNICA do molde de pastas oficial (Processo Padrão).
# Dot-source este arquivo (. .\Hooks\lib-molde-estrutura.ps1) para obter as listas canônicas.
# Consumidores: scripts/propagar_estrutura.ps1 (scaffold) e Hooks/validar-estrutura-projeto.ps1 (validação).
# Regra: alterar o molde SÓ aqui; todos os consumidores refletem. Nunca duplicar as listas.

$MoldeProdutoComum = @(
  '00_Indice_Mestre','00_Specs_SDD',
  '01_Negocio/Blocos_PF','01_Negocio/Blocos_PJ',
  '02_Arquitetura/desenhos',
  '03_Integracoes',
  '04_Banco_de_Dados/_entregaveis',
  '05_Seguranca','06_Operacao','07_Configuracoes','08_Estudos',
  '09_Qualidade/features','09_Qualidade/scripts',
  '10_Kafka','11_Orquestradora','12_API_Contratos',
  '_Conversas_Agentes','specs'
)
$MoldeDigital    = @('13_User_Stories/_entregaveis','13_User_Stories/1 - Modelo','14_Status_Reports')
$MoldePresencial = @('13_Mendix/Blocos_PF','13_Mendix/Blocos_PJ','13_Mendix/_fonte_curada','14_Jornada/PF','14_Jornada/PJ')
$MoldeAgent = @(
  '00_ORGANIZACAO',
  'agentes/agente-extrator','agentes/agente-negocio','agentes/agente-tecnico',
  'conhecimento/_fontes','conhecimento/_metodo','conhecimento/agente-negocio',
  'conhecimento/agente-tecnico','conhecimento/compartilhado','conhecimento/_produto',
  'docs/analises','docs/decisoes','docs/modelos',
  'governanca',
  'publicacao/build','publicacao/scripts',
  'scripts','specs',
  'teste automatizado/Dynamics','teste automatizado/_outras_camadas',
  '_Conversas_Agentes'
)

function Get-MoldeFolders {
  param(
    [Parameter(Mandatory=$true)][ValidateSet('Produto','Agent')][string]$Type,
    [ValidateSet('Digital','Presencial')][string]$Variant = 'Digital'
  )
  if ($Type -eq 'Produto') {
    return $MoldeProdutoComum + $(if ($Variant -eq 'Digital') { $MoldeDigital } else { $MoldePresencial })
  }
  return $MoldeAgent
}
