@echo off
REM Claude Pulse — 60-second installer
REM What it does:
REM   1. Verifies Node.js is installed
REM   2. Starts the background server (port 7456)
REM   3. Opens Chrome --app window pointing at the widget
REM   4. Reminds user to install the Chrome extension for REAL Anthropic %

setlocal
cd /d "%~dp0widget"

echo.
echo ============================================
echo   Claude Pulse v0.1.0 - Installer
echo ============================================
echo.

REM Check Node
where node >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js not found.
    echo Install from https://nodejs.org/  ^(LTS, ~20 MB^)
    echo Then double-click install.bat again.
    pause
    exit /b 1
)

echo [OK] Node.js found
echo.
echo Starting Claude Pulse server on http://localhost:7456 ...
start "" /B cmd /c "node server.js > pulse.log 2>&1"

REM Wait for server to come up
timeout /t 3 /nobreak >nul

echo.
echo Launching widget window...
start "" "chrome.exe" --app=http://localhost:7456 --window-size=420,720 --window-position=1080,100 2>nul

if errorlevel 1 (
    echo [WARN] Chrome not on PATH. Opening default browser instead.
    start "" "http://localhost:7456"
)

echo.
echo ============================================
echo   NEXT STEP - Chrome Extension (60 sec)
echo ============================================
echo.
echo To see your REAL Anthropic usage %% (not just ccusage estimate):
echo.
echo   1. Open chrome://extensions
echo   2. Toggle "Developer mode" ON  ^(top-right^)
echo   3. Click "Load unpacked"
echo   4. Select the "extension" folder in this repo
echo   5. Visit https://claude.ai/settings/usage ONCE
echo   6. Widget dot turns GREEN = real data flowing
echo.
echo Press any key to open chrome://extensions ...
pause >nul
start "" "chrome://extensions"

endlocal
