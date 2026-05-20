# Pin Claude Pulse Chrome --app window to always-on-top
# Uses Win32 SetWindowPos with HWND_TOPMOST flag
# Reversible: close + reopen the widget, or rerun with -unpin

param([switch]$unpin)

Add-Type @"
using System;
using System.Runtime.InteropServices;
public class Pin {
    [DllImport("user32.dll")]
    public static extern bool SetWindowPos(IntPtr h, IntPtr ins, int x, int y, int w, int hh, uint f);
}
"@

$HWND_TOPMOST    = [IntPtr]::new(-1)
$HWND_NOTOPMOST  = [IntPtr]::new(-2)
$SWP_NOMOVE      = 0x0002
$SWP_NOSIZE      = 0x0001
$SWP_SHOWWINDOW  = 0x0040
$flags           = $SWP_NOMOVE -bor $SWP_NOSIZE -bor $SWP_SHOWWINDOW

# Wait up to 10 sec for the widget to appear
$p = $null
for ($i = 0; $i -lt 20; $i++) {
    $p = Get-Process chrome -ErrorAction SilentlyContinue |
         Where-Object { $_.MainWindowTitle -like '*Claude Pulse*' -or $_.MainWindowTitle -like '*Pulse*' -or $_.MainWindowTitle -like '*Mockup*' } |
         Select-Object -First 1
    if ($p) { break }
    Start-Sleep -Milliseconds 500
}

if (-not $p) {
    Write-Host "Pulse widget not found. Launch it first (install.bat or launch.bat)."
    exit 1
}

$target = if ($unpin) { $HWND_NOTOPMOST } else { $HWND_TOPMOST }
[Pin]::SetWindowPos($p.MainWindowHandle, $target, 0, 0, 0, 0, $flags) | Out-Null

if ($unpin) {
    Write-Host "Unpinned. Widget is now normal Z-order."
} else {
    Write-Host "Pinned. Widget stays on top of all other windows."
}
