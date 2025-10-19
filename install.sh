#!/bin/bash

# ========================================
# SCRIPT DE INSTALAÇÃO AUTOMÁTICA
# DentCare PRO v8.0
# ========================================

echo "======================================"
echo "  DentCare PRO - Instalação Automática"
echo "======================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para verificar comando
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 está instalado"
        return 0
    else
        echo -e "${RED}✗${NC} $1 NÃO está instalado"
        return 1
    fi
}

# Função para verificar versão do Node
check_node_version() {
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -ge 18 ]; then
        echo -e "${GREEN}✓${NC} Node.js versão $NODE_VERSION (OK)"
        return 0
    else
        echo -e "${RED}✗${NC} Node.js versão $NODE_VERSION (Necessário 18+)"
        return 1
    fi
}

echo "Passo 1: Verificando requisitos..."
echo ""

# Verificar Node.js
if check_command node; then
    check_node_version
else
    echo -e "${RED}ERRO:${NC} Node.js não está instalado!"
    echo "Instale em: https://nodejs.org/"
    exit 1
fi

# Verificar pnpm
if ! check_command pnpm; then
    echo ""
    echo -e "${YELLOW}Instalando pnpm...${NC}"
    npm install -g pnpm
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} pnpm instalado com sucesso"
    else
        echo -e "${RED}ERRO:${NC} Falha ao instalar pnpm"
        exit 1
    fi
fi

# Verificar MySQL
if ! check_command mysql; then
    echo -e "${RED}ERRO:${NC} MySQL não está instalado!"
    echo "Instale em: https://dev.mysql.com/downloads/mysql/"
    exit 1
fi

echo ""
echo "Passo 2: Verificando arquivo .env..."
echo ""

# Verificar se .env existe
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo -e "${YELLOW}Criando .env a partir de .env.example...${NC}"
        cp .env.example .env
        echo -e "${GREEN}✓${NC} Arquivo .env criado"
        echo -e "${YELLOW}⚠${NC}  IMPORTANTE: Configure o arquivo .env antes de continuar!"
        echo "   Edite o arquivo .env e configure:"
        echo "   - DATABASE_URL (senha do MySQL)"
        echo "   - GEMINI_API_KEY (para IA Financeira)"
        echo ""
        read -p "Pressione ENTER após configurar o .env..."
    else
        echo -e "${RED}ERRO:${NC} Arquivo .env.example não encontrado!"
        exit 1
    fi
else
    echo -e "${GREEN}✓${NC} Arquivo .env encontrado"
fi

echo ""
echo "Passo 3: Instalando dependências..."
echo ""

pnpm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Dependências instaladas com sucesso"
else
    echo -e "${RED}ERRO:${NC} Falha ao instalar dependências"
    exit 1
fi

echo ""
echo "Passo 4: Configurando base de dados..."
echo ""

# Perguntar credenciais do MySQL
echo "Digite a senha do root do MySQL:"
read -s MYSQL_ROOT_PASSWORD

# Criar base de dados e usuário
mysql -u root -p"$MYSQL_ROOT_PASSWORD" <<EOF
CREATE DATABASE IF NOT EXISTS dentcarepro;
CREATE USER IF NOT EXISTS 'dentcare'@'localhost' IDENTIFIED BY 'dentcare2025';
GRANT ALL PRIVILEGES ON dentcarepro.* TO 'dentcare'@'localhost';
FLUSH PRIVILEGES;
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Base de dados configurada com sucesso"
else
    echo -e "${YELLOW}⚠${NC}  Falha ao configurar base de dados (pode já estar configurada)"
fi

echo ""
echo "Passo 5: Aplicando migrações..."
echo ""

pnpm db:push

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Migrações aplicadas com sucesso"
else
    echo -e "${RED}ERRO:${NC} Falha ao aplicar migrações"
    echo "Verifique:"
    echo "  - MySQL está rodando?"
    echo "  - Credenciais no .env estão corretas?"
    exit 1
fi

echo ""
echo "======================================"
echo -e "${GREEN}✓ INSTALAÇÃO CONCLUÍDA COM SUCESSO!${NC}"
echo "======================================"
echo ""
echo "Para iniciar o servidor:"
echo "  $ pnpm dev"
echo ""
echo "Depois acesse no navegador:"
echo "  http://localhost:3000"
echo ""
echo "Documentação:"
echo "  - GUIA_INSTALACAO_COMPLETO.md"
echo "  - LISTA_ERROS_E_CORRECOES.md"
echo "  - PROGRESSO_MODULO_FINANCEIRO.md"
echo ""

