@echo off
echo ========================================
echo DentCarePRO v8.0 - Instalacao Automatica
echo ========================================
echo.

echo [1/4] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js nao esta instalado!
    echo Por favor, instale o Node.js de https://nodejs.org/
    pause
    exit /b 1
)
echo OK - Node.js encontrado

echo.
echo [2/4] Instalando PNPM...
call npm install -g pnpm
if errorlevel 1 (
    echo ERRO: Falha ao instalar PNPM
    pause
    exit /b 1
)
echo OK - PNPM instalado

echo.
echo [3/4] Instalando dependencias do projeto...
echo (Isto pode demorar 5-10 minutos)
call pnpm install
if errorlevel 1 (
    echo ERRO: Falha ao instalar dependencias
    pause
    exit /b 1
)
echo OK - Dependencias instaladas

echo.
echo [4/4] Compilando o projeto...
call pnpm build
if errorlevel 1 (
    echo ERRO: Falha ao compilar o projeto
    pause
    exit /b 1
)
echo OK - Projeto compilado

echo.
echo ========================================
echo Instalacao concluida com sucesso!
echo ========================================
echo.
echo Para iniciar o sistema, execute: start_windows.bat
echo.
pause

