@echo off
setlocal

cd /d "%~dp0"

start "DwellTend Dev Server" cmd /k "npm.cmd run dev"

timeout /t 3 /nobreak >nul

start "" "http://localhost:5173"
