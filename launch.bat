@echo off
REM Daily launcher — assumes install.bat ran once and Chrome extension installed
setlocal
cd /d "%~dp0widget"

REM Kill any orphaned server on 7456
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":7456" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>nul

start "" /B cmd /c "node server.js > pulse.log 2>&1"
timeout /t 2 /nobreak >nul
start "" "chrome.exe" --app=http://localhost:7456 --window-size=510,900 --window-position=1000,40

REM Pin widget always-on-top so VS Code clicks don't bury it
powershell -ExecutionPolicy Bypass -File "%~dp0scripts\pin-on-top.ps1" >nul 2>&1

endlocal
