# strip Chrome --app title bar of the Claude Pulse window
# uses Win32 API: SetWindowLong removes WS_CAPTION | WS_THICKFRAME styles

Add-Type @"
using System;
using System.Runtime.InteropServices;
public class Win {
    [DllImport("user32.dll")] public static extern IntPtr GetWindowLongPtr(IntPtr h, int idx);
    [DllImport("user32.dll")] public static extern IntPtr SetWindowLongPtr(IntPtr h, int idx, IntPtr val);
    [DllImport("user32.dll", EntryPoint="GetWindowLong")] public static extern int GetWindowLong32(IntPtr h, int idx);
    [DllImport("user32.dll", EntryPoint="SetWindowLong")] public static extern int SetWindowLong32(IntPtr h, int idx, int val);
    [DllImport("user32.dll")] public static extern bool SetWindowPos(IntPtr h, IntPtr ins, int x, int y, int w, int hh, uint f);
    [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int n);
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
}
"@

$GWL_STYLE   = -16
$WS_CAPTION  = 0x00C00000
$WS_THICKFRAME = 0x00040000
$WS_SYSMENU  = 0x00080000
$WS_BORDER   = 0x00800000
$WS_DLGFRAME = 0x00400000

$SWP_NOMOVE   = 0x0002
$SWP_NOSIZE   = 0x0001
$SWP_NOZORDER = 0x0004
$SWP_FRAMECHANGED = 0x0020

$p = Get-Process chrome -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -like '*Pulse*' -or $_.MainWindowTitle -like '*Mockup*' } | Select-Object -First 1
if (-not $p) { Write-Host "Pulse window not found"; exit 1 }

$h = $p.MainWindowHandle
$is64 = [Environment]::Is64BitProcess

if ($is64) {
    $style = [Win]::GetWindowLongPtr($h, $GWL_STYLE).ToInt64()
} else {
    $style = [Win]::GetWindowLong32($h, $GWL_STYLE)
}

Write-Host ("Current style: 0x{0:X8}" -f $style)

# Strip caption + thickframe + sysmenu + border + dlgframe
$mask = -bnot ($WS_CAPTION -bor $WS_THICKFRAME -bor $WS_SYSMENU -bor $WS_BORDER -bor $WS_DLGFRAME)
$new = $style -band $mask
Write-Host ("New style:     0x{0:X8}" -f $new)

if ($is64) {
    [Win]::SetWindowLongPtr($h, $GWL_STYLE, [IntPtr]::new($new)) | Out-Null
} else {
    [Win]::SetWindowLong32($h, $GWL_STYLE, $new) | Out-Null
}

# Force redraw with new frame
[Win]::SetWindowPos($h, [IntPtr]::Zero, 0, 0, 0, 0, $SWP_NOMOVE -bor $SWP_NOSIZE -bor $SWP_NOZORDER -bor $SWP_FRAMECHANGED) | Out-Null
[Win]::SetForegroundWindow($h) | Out-Null

Write-Host "Title bar stripped from PID $($p.Id)"
