@echo off
REM ========================================
REM SCRIPT DE INSTALAÇÃO AUTOMÁTICA - WINDOWS
REM DentCare PRO v8.0
REM ========================================

echo ======================================
echo   DentCare PRO - Instalacao Automatica
echo ======================================
echo.

REM Verificar Node.js
echo Passo 1: Verificando requisitos...
echo.

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [X] Node.js NAO esta instalado!
    echo     Instale em: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo [OK] Node.js esta instalado
)

REM Verificar pnpm
where pnpm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [!] pnpm nao encontrado. Instalando...
    call npm install -g pnpm
    if %ERRORLEVEL% NEQ 0 (
        echo [X] Falha ao instalar pnpm
        pause
        exit /b 1
    )
    echo [OK] pnpm instalado com sucesso
) else (
    echo [OK] pnpm esta instalado
)

REM Verificar MySQL
where mysql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [X] MySQL NAO esta instalado!
    echo     Instale em: https://dev.mysql.com/downloads/mysql/
    pause
    exit /b 1
) else (
    echo [OK] MySQL esta instalado
)

echo.
echo Passo 2: Verificando arquivo .env...
echo.

REM Verificar .env
if not exist ".env" (
    if exist ".env.example" (
        echo [!] Criando .env a partir de .env.example...
        copy .env.example .env
        echo [OK] Arquivo .env criado
        echo.
        echo ============================================
        echo IMPORTANTE: Configure o arquivo .env agora!
        echo ============================================
        echo.
        echo Abra o arquivo .env e configure:
        echo   - DATABASE_URL (senha do MySQL)
        echo   - GEMINI_API_KEY (para IA Financeira)
        echo.
        pause
    ) else (
        echo [X] Arquivo .env.example nao encontrado!
        pause
        exit /b 1
    )
) else (
    echo [OK] Arquivo .env encontrado
)

echo.
echo Passo 3: Instalando dependencias...
echo.

call pnpm install

if %ERRORLEVEL% NEQ 0 (
    echo [X] Falha ao instalar dependencias
    pause
    exit /b 1
)

echo [OK] Dependencias instaladas com sucesso

echo.
echo Passo 4: Aplicando migracoes...
echo.
echo NOTA: Certifique-se que o MySQL esta rodando!
echo       e que a base de dados 'dentcarepro' foi criada.
echo.
pause

call pnpm db:push

if %ERRORLEVEL% NEQ 0 (
    echo [X] Falha ao aplicar migracoes
    echo.
    echo Verifique:
    echo   - MySQL esta rodando?
    echo   - Base de dados 'dentcarepro' foi criada?
    echo   - Credenciais no .env estao corretas?
    echo.
    echo Para criar a base de dados manualmente:
    echo   1. Abra MySQL Workbench
    echo   2. Execute:
    echo      CREATE DATABASE IF NOT EXISTS dentcarepro;
    echo      CREATE USER IF NOT EXISTS 'dentcare'@'localhost' IDENTIFIED BY 'dentcare2025';
    echo      GRANT ALL PRIVILEGES ON dentcarepro.* TO 'dentcare'@'localhost';
    echo      FLUSH PRIVILEGES;
    echo.
    pause
    exit /b 1
)

echo [OK] Migracoes aplicadas com sucesso

echo.
echo ======================================
echo   INSTALACAO CONCLUIDA COM SUCESSO!
echo ======================================
echo.
echo Para iniciar o servidor:
echo   pnpm dev
echo.
echo Depois acesse no navegador:
echo   http://localhost:3000
echo.
echo Documentacao:
echo   - GUIA_INSTALACAO_COMPLETO.md
echo   - LISTA_ERROS_E_CORRECOES.md
echo   - PROGRESSO_MODULO_FINANCEIRO.md
echo.
pause

