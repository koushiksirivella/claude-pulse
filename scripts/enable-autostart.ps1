# Claude Pulse — enable auto-launch on every Claude Code session
# Adds a SessionStart hook to ~/.claude/settings.json that runs launch.bat
# silently in the background each time you open Claude Code.

param([switch]$disable)

$settingsPath = Join-Path $env:USERPROFILE ".claude\settings.json"
$repoRoot     = Split-Path -Parent $PSScriptRoot
$launchBat    = Join-Path $repoRoot "launch.bat"

if (-not (Test-Path $launchBat)) {
    Write-Host "ERROR: launch.bat not found at $launchBat"
    Write-Host "Run this script from inside the cloned claude-pulse repo."
    exit 1
}

# Read existing settings or create empty object
if (Test-Path $settingsPath) {
    $settings = Get-Content $settingsPath -Raw | ConvertFrom-Json
} else {
    New-Item -ItemType Directory -Path (Split-Path $settingsPath) -Force | Out-Null
    $settings = [PSCustomObject]@{}
}

# Ensure hooks.SessionStart exists
if (-not $settings.PSObject.Properties['hooks']) {
    $settings | Add-Member -MemberType NoteProperty -Name hooks -Value ([PSCustomObject]@{})
}
if (-not $settings.hooks.PSObject.Properties['SessionStart']) {
    $settings.hooks | Add-Member -MemberType NoteProperty -Name SessionStart -Value @()
}

$hookCmd = "powershell -WindowStyle Hidden -Command `"Start-Process -FilePath '$launchBat' -WindowStyle Hidden`""

if ($disable) {
    # Remove any SessionStart hook that points at this launch.bat
    $settings.hooks.SessionStart = @($settings.hooks.SessionStart | Where-Object {
        $_.hooks -notmatch [regex]::Escape($launchBat)
    })
    Write-Host "Claude Pulse auto-launch DISABLED."
} else {
    # Skip if already installed
    $exists = $settings.hooks.SessionStart | Where-Object {
        ($_.hooks | ConvertTo-Json -Compress) -match [regex]::Escape($launchBat)
    }
    if ($exists) {
        Write-Host "Already enabled. Nothing to do."
        exit 0
    }
    $newHook = [PSCustomObject]@{
        matcher = ""
        hooks   = @(
            [PSCustomObject]@{
                type    = "command"
                command = $hookCmd
            }
        )
    }
    $settings.hooks.SessionStart = @($settings.hooks.SessionStart) + $newHook
    Write-Host "Claude Pulse auto-launch ENABLED."
    Write-Host "Widget will pop every time you start a Claude Code session."
}

$settings | ConvertTo-Json -Depth 10 | Set-Content -Path $settingsPath -Encoding UTF8
Write-Host "Updated: $settingsPath"
