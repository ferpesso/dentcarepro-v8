@echo off
echo ========================================
echo DentCarePRO v8.0 - Backup da Base de Dados
echo ========================================
echo.

REM Criar pasta de backups se não existir
if not exist "backups" mkdir backups

REM Gerar nome do ficheiro com data e hora
set TIMESTAMP=%date:~-4,4%%date:~-7,2%%date:~-10,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set BACKUP_FILE=backups\backup_%TIMESTAMP%.sql

echo A criar backup em: %BACKUP_FILE%
echo.

REM Executar backup
"C:\Program Files\PostgreSQL\16\bin\pg_dump.exe" -U dentcarepro -d dentcarepro -F p -f %BACKUP_FILE%

if errorlevel 1 (
    echo.
    echo ERRO: Falha ao criar backup!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Backup criado com sucesso!
echo ========================================
echo.
echo Ficheiro: %BACKUP_FILE%
echo.

REM Mostrar tamanho do ficheiro
for %%A in (%BACKUP_FILE%) do echo Tamanho: %%~zA bytes

echo.
pause

