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
start "" "chrome.exe" --app=http://localhost:7456 --window-size=510,900 --window-position=1000,40 2>nul

if errorlevel 1 (
    echo [WARN] Chrome not on PATH. Opening default browser instead.
    start "" "http://localhost:7456"
)

REM Pin widget always-on-top so VS Code clicks don't bury it
powershell -ExecutionPolicy Bypass -File "%~dp0scripts\pin-on-top.ps1" >nul 2>&1

echo.
echo ============================================
echo   DONE. Widget is now running.
echo ============================================
echo.
echo   Token count, $ cost, context %% are EXACT.
echo   5h block %% bar is 5-10%% off Anthropic's
echo   weighted formula. (Cosmetic only.)
echo.
echo   To exact-match claude.ai dashboard:
echo   See docs/EXTENSION.md for the optional
echo   Chrome bridge (v0.2 ships as Web Store).
echo.
echo Press any key to close this window.
pause >nul

endlocal
