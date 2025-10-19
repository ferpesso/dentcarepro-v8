@echo off
echo.
echo ========================================
echo   DentCarePRO - Iniciando servidor
echo ========================================
echo.

REM Verificar se dist existe
if not exist "dist" (
    echo [ERRO] Pasta 'dist' nao encontrada!
    echo Execute primeiro: pnpm build
    pause
    exit /b 1
)

REM Verificar se node_modules existe
if not exist "node_modules" (
    echo [ERRO] Pasta 'node_modules' nao encontrada!
    echo Execute primeiro: pnpm install
    pause
    exit /b 1
)

echo [OK] Verificacoes concluidas
echo.
echo Iniciando servidor na porta 3000...
echo Aceder em: http://localhost:3000
echo.
echo Para parar o servidor: Pressione Ctrl+C
echo.

REM Iniciar servidor
set PORT=3000
node dist/index.js

pause
