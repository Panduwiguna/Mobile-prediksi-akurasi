@echo off
title Zona Killzone ML Assistant - Backend Server
echo ========================================================
echo   ZONA KILLZONE ML ASSISTANT - MULTI-MARKET BACKEND
echo   Asia (JP225/HK50/AUD), Eropa (GER40/UK100), NY (NAS100/US30), Gold
echo ========================================================
echo.

set PYTHON_CMD=python
where python >nul 2>nul
if %errorlevel% neq 0 (
    set PYTHON_CMD=py
)
if exist "%LOCALAPPDATA%\Python\bin\python.exe" (
    set PYTHON_CMD="%LOCALAPPDATA%\Python\bin\python.exe"
)

echo Using Python: %PYTHON_CMD%
echo Starting Uvicorn Server at http://127.0.0.1:8000 ...
echo API Documentation available at: http://127.0.0.1:8000/docs
echo.

%PYTHON_CMD% -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
pause
