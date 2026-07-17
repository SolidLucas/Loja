<#
Envia uma notificação de novo evento para o canal do Discord via webhook.
Cada jogo tem seu próprio webhook, guardado numa variável de ambiente
específica (nunca neste arquivo), para não vazar junto com os arquivos do site.
Se o webhook do jogo ainda não foi configurado, o script avisa e não envia nada.

Uso:
  .\scripts\notify-discord.ps1 -Titulo "TCGCON" -Jogo pokemon -Data "12 e 13 de setembro de 2026" -Local "Av. Manuel Bandeira, 360, Vila Leopoldina, São Paulo - SP"

Valores aceitos para -Jogo (mesmos "data-jogo" usados em torneios.html):
  pokemon, magic, yugioh, onepiece, digimon, lorcana, geral
#>
param(
    [Parameter(Mandatory = $true)][string]$Titulo,
    [Parameter(Mandatory = $true)][string]$Data,
    [string]$Local = "A confirmar",
    [Parameter(Mandatory = $true)]
    [ValidateSet("pokemon", "magic", "yugioh", "onepiece", "digimon", "lorcana", "geral")]
    [string]$Jogo
)

$infoPorJogo = @{
    pokemon  = @{ nome = [char]0x0050 + "ok" + [char]0x00E9 + "mon"; variavel = "TCGBRASA_DISCORD_WEBHOOK_POKEMON"; cor = 3126070 }
    magic    = @{ nome = "Magic: The Gathering"; variavel = "TCGBRASA_DISCORD_WEBHOOK_MAGIC"; cor = 3092790 }
    yugioh   = @{ nome = "Yu-Gi-Oh!"; variavel = "TCGBRASA_DISCORD_WEBHOOK_YUGIOH"; cor = 10038562 }
    onepiece = @{ nome = "One Piece"; variavel = "TCGBRASA_DISCORD_WEBHOOK_ONEPIECE"; cor = 15105570 }
    digimon  = @{ nome = "Digimon"; variavel = "TCGBRASA_DISCORD_WEBHOOK_DIGIMON"; cor = 2201331 }
    lorcana  = @{ nome = "Lorcana"; variavel = "TCGBRASA_DISCORD_WEBHOOK_LORCANA"; cor = 9442302 }
    geral    = @{ nome = "Geral"; variavel = "TCGBRASA_DISCORD_WEBHOOK_GERAL"; cor = 60159 }
}

$info = $infoPorJogo[$Jogo]
$webhookUrl = [Environment]::GetEnvironmentVariable($info.variavel, "User")

if (-not $webhookUrl) {
    Write-Warning "Nenhum webhook configurado ainda para '$Jogo' (variável $($info.variavel)). Nada foi enviado."
    exit 0
}

$payload = @{
    embeds = @(
        @{
            title       = "Novo evento: $Titulo"
            description = "**Jogo:** $($info.nome)`n**Data:** $Data`n**Local:** $Local"
            color       = $info.cor
        }
    )
} | ConvertTo-Json -Depth 5

$corpoUtf8 = [System.Text.Encoding]::UTF8.GetBytes($payload)
Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $corpoUtf8 -ContentType "application/json; charset=utf-8"
Write-Host "Notificacao enviada ao Discord ($($info.nome)): $Titulo"
