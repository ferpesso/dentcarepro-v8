@echo off
echo ========================================
echo DentCarePRO v8.0 - Iniciando Sistema
echo ========================================
echo.

echo Verificando PostgreSQL...
sc query postgresql-x64-16 | find "RUNNING" >nul
if errorlevel 1 (
    echo AVISO: PostgreSQL nao esta a correr!
    echo A tentar iniciar PostgreSQL...
    net start postgresql-x64-16
    timeout /t 3 >nul
)

echo.
echo Iniciando servidor DentCarePRO...
echo.
echo IMPORTANTE: NAO FECHE esta janela enquanto usar o sistema!
echo.
echo Aceda ao sistema em: http://localhost:3000
echo.
echo Para parar o servidor, prima Ctrl+C
echo.
echo ========================================
echo.

set NODE_ENV=production
set PORT=3000
node dist/index.js

pause

