# 🚀 GUIA COMPLETO DE INSTALAÇÃO - DentCarePro v8.0

**Versão:** 8.0 Final  
**Data:** 24 de Outubro de 2025  
**Autor:** Sistema Manus  

---

## 📋 ÍNDICE

1. [Requisitos do Sistema](#requisitos-do-sistema)
2. [Instalação no Windows](#instalação-no-windows)
3. [Instalação no Linux/Mac](#instalação-no-linuxmac)
4. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
5. [Variáveis de Ambiente](#variáveis-de-ambiente)
6. [Primeiro Acesso](#primeiro-acesso)
7. [Deploy em Produção](#deploy-em-produção)
8. [Resolução de Problemas](#resolução-de-problemas)

---

## 📦 REQUISITOS DO SISTEMA

### Mínimos
- **Sistema Operacional:** Windows 10+, macOS 10.15+, Ubuntu 20.04+
- **RAM:** 4 GB
- **Espaço em Disco:** 2 GB
- **Processador:** Dual-core 2.0 GHz

### Recomendados
- **RAM:** 8 GB ou mais
- **Espaço em Disco:** 5 GB ou mais
- **Processador:** Quad-core 2.5 GHz ou superior
- **Internet:** Conexão estável para APIs externas

### Software Necessário

#### 1. Node.js (v18 ou superior)
**Download:** https://nodejs.org/

**Verificar instalação:**
```bash
node --version
# Deve mostrar: v18.x.x ou superior
```

#### 2. pnpm (Gerenciador de pacotes)
**Instalar:**
```bash
npm install -g pnpm
```

**Verificar instalação:**
```bash
pnpm --version
# Deve mostrar: 8.x.x ou superior
```

#### 3. Git (Opcional, mas recomendado)
**Download:** https://git-scm.com/

---

## 💻 INSTALAÇÃO NO WINDOWS

### Opção 1: Instalação Automática (Recomendado)

1. **Extrair o arquivo ZIP**
   - Extrair `dentcarepro-v8-completo.zip` para `C:\dentcarepro-v8`

2. **Executar instalador automático**
   - Duplo clique em `install.bat`
   - Aguardar conclusão da instalação

3. **Iniciar o sistema**
   - Duplo clique em `start.bat`
   - Aguardar mensagem "Server running on http://localhost:3000/"

4. **Acessar o sistema**
   - Abrir navegador em: http://localhost:3000

### Opção 2: Instalação Manual

1. **Abrir PowerShell ou CMD como Administrador**

2. **Navegar até a pasta do projeto**
```cmd
cd C:\dentcarepro-v8
```

3. **Instalar dependências**
```cmd
pnpm install
```

4. **Criar arquivo .env**
```cmd
copy .env.example .env
```

5. **Editar .env** (opcional)
   - Abrir `.env` com Notepad
   - Configurar variáveis conforme necessário

6. **Iniciar o sistema**
```cmd
pnpm dev
```

7. **Acessar**
   - http://localhost:3000

---

## 🐧 INSTALAÇÃO NO LINUX/MAC

### Opção 1: Instalação Automática (Recomendado)

1. **Extrair o arquivo**
```bash
unzip dentcarepro-v8-completo.zip
cd dentcarepro-v8
```

2. **Dar permissão de execução**
```bash
chmod +x install.sh start.sh
```

3. **Executar instalador**
```bash
./install.sh
```

4. **Iniciar o sistema**
```bash
./start.sh
```

5. **Acessar**
   - http://localhost:3000

### Opção 2: Instalação Manual

1. **Navegar até a pasta**
```bash
cd /caminho/para/dentcarepro-v8
```

2. **Instalar dependências**
```bash
pnpm install
```

3. **Criar arquivo .env**
```bash
cp .env.example .env
```

4. **Editar .env** (opcional)
```bash
nano .env
# ou
vim .env
```

5. **Iniciar o sistema**
```bash
pnpm dev
```

6. **Acessar**
   - http://localhost:3000

---

## 🗄️ CONFIGURAÇÃO DO BANCO DE DADOS

### Modo Desenvolvimento (Mock Data)

Por padrão, o sistema usa **mock data** (dados de exemplo em memória):
- ✅ Não precisa configurar banco de dados
- ✅ Perfeito para testes e desenvolvimento
- ⚠️ Dados não são persistidos (resetam ao reiniciar)

### Modo Produção (PostgreSQL)

Para dados persistentes, configure PostgreSQL:

#### 1. Instalar PostgreSQL

**Windows:**
- Download: https://www.postgresql.org/download/windows/
- Instalar com configurações padrão
- Anotar senha do usuário `postgres`

**Linux:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

#### 2. Criar Banco de Dados

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar banco de dados
CREATE DATABASE dentcarepro;

# Criar usuário
CREATE USER dentcare WITH PASSWORD 'sua_senha_segura';

# Dar permissões
GRANT ALL PRIVILEGES ON DATABASE dentcarepro TO dentcare;

# Sair
\q
```

#### 3. Configurar .env

Editar arquivo `.env`:

```env
# Banco de Dados
DATABASE_URL="postgresql://dentcare:sua_senha_segura@localhost:5432/dentcarepro"

# Modo de dados
USE_MOCK_DATA=false
```

#### 4. Executar Migrações

```bash
pnpm db:push
```

#### 5. Popular com Dados de Exemplo (Opcional)

```bash
psql -U dentcare -d dentcarepro -f database_init.sql
psql -U dentcare -d dentcarepro -f insert_sample_data.sql
```

---

## 🔐 VARIÁVEIS DE AMBIENTE

### Arquivo .env Completo

Criar/editar arquivo `.env` na raiz do projeto:

```env
# ========================================
# CONFIGURAÇÕES BÁSICAS
# ========================================

# Ambiente (development | production)
NODE_ENV=development

# Porta do servidor
PORT=3000

# URL base (para produção)
BASE_URL=http://localhost:3000

# ========================================
# BANCO DE DADOS
# ========================================

# PostgreSQL (produção)
DATABASE_URL="postgresql://usuario:senha@localhost:5432/dentcarepro"

# Usar mock data (true | false)
USE_MOCK_DATA=true

# ========================================
# AUTENTICAÇÃO E SEGURANÇA
# ========================================

# Chave secreta JWT (gerar nova em produção)
JWT_SECRET=sua_chave_secreta_muito_segura_aqui_123456

# Tempo de expiração do token (em segundos)
JWT_EXPIRATION=86400

# ========================================
# NOTIFICAÇÕES E COMUNICAÇÃO
# ========================================

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app

# WhatsApp Business API (Twilio)
WHATSAPP_ACCOUNT_SID=seu_account_sid
WHATSAPP_AUTH_TOKEN=seu_auth_token
WHATSAPP_PHONE_NUMBER=+351XXXXXXXXX

# SMS (Twilio)
SMS_ACCOUNT_SID=seu_account_sid
SMS_AUTH_TOKEN=seu_auth_token
SMS_PHONE_NUMBER=+351XXXXXXXXX

# ========================================
# INTEGRAÇÕES EXTERNAS
# ========================================

# Google Calendar
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# Stripe (Pagamentos)
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Mailchimp (Marketing)
MAILCHIMP_API_KEY=sua_api_key
MAILCHIMP_LIST_ID=seu_list_id

# ========================================
# UPLOAD DE ARQUIVOS
# ========================================

# AWS S3 (opcional)
AWS_ACCESS_KEY_ID=sua_access_key
AWS_SECRET_ACCESS_KEY=sua_secret_key
AWS_REGION=eu-west-1
AWS_BUCKET_NAME=dentcarepro-uploads

# Cloudinary (alternativa)
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=sua_api_secret

# ========================================
# IA E ANÁLISE
# ========================================

# Google Gemini (Análise de Imagens)
GEMINI_API_KEY=sua_api_key

# OpenAI (alternativa)
OPENAI_API_KEY=sua_api_key

# ========================================
# BACKUP
# ========================================

# Backup automático (true | false)
AUTO_BACKUP_ENABLED=true

# Frequência (daily | weekly | monthly)
BACKUP_FREQUENCY=daily

# Horário (formato 24h)
BACKUP_TIME=03:00

# Retenção (dias)
BACKUP_RETENTION_DAYS=30
```

### Gerar Chave JWT Segura

**Node.js:**
```javascript
require('crypto').randomBytes(64).toString('hex')
```

**Online:**
https://www.grc.com/passwords.htm

---

## 🎯 PRIMEIRO ACESSO

### 1. Iniciar o Sistema

**Windows:**
```cmd
start.bat
```

**Linux/Mac:**
```bash
./start.sh
```

**Manual:**
```bash
pnpm dev
```

### 2. Acessar o Sistema

Abrir navegador em: **http://localhost:3000**

### 3. Login Padrão (Mock Data)

Se estiver usando mock data:

```
Email: admin@dentcarepro.com
Senha: admin123
```

### 4. Configurar Sistema

1. **Ir em Ajustes** (http://localhost:3000/ajustes)

2. **Tab Básicas:**
   - Nome da clínica
   - NIF
   - Morada
   - Contactos

3. **Tab Branding:**
   - Upload de logo
   - Cores da marca
   - Tipografia

4. **Tab Avançado:**
   - Configurar backup
   - Ativar notificações
   - Configurar lembretes

### 5. Criar Primeiro Utente

1. Ir em **Utentes** (http://localhost:3000/utentes)
2. Clicar em **Novo Utente**
3. Preencher dados
4. Salvar

---

## 🚀 DEPLOY EM PRODUÇÃO

### Opção 1: Vercel (Recomendado - Gratuito)

#### Pré-requisitos
- Conta no GitHub
- Conta no Vercel (https://vercel.com)

#### Passos

1. **Fazer push do código para GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/seu-usuario/dentcarepro-v8.git
git push -u origin main
```

2. **Conectar ao Vercel**
   - Acessar https://vercel.com
   - Clicar em "New Project"
   - Importar repositório do GitHub
   - Configurar variáveis de ambiente
   - Deploy!

3. **URL Gerada**
   - Vercel gera URL automática: `https://seu-projeto.vercel.app`
   - Pode adicionar domínio personalizado

### Opção 2: Railway (Backend + Database)

1. **Criar conta:** https://railway.app
2. **New Project** > Deploy from GitHub
3. **Adicionar PostgreSQL**
4. **Configurar variáveis de ambiente**
5. **Deploy automático**

### Opção 3: VPS (Controle Total)

#### Servidor (Ubuntu 22.04)

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar pnpm
npm install -g pnpm

# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib

# Clonar projeto
git clone https://github.com/seu-usuario/dentcarepro-v8.git
cd dentcarepro-v8

# Instalar dependências
pnpm install

# Configurar .env
nano .env

# Build
pnpm build

# Instalar PM2 (gerenciador de processos)
npm install -g pm2

# Iniciar com PM2
pm2 start dist/index.js --name dentcarepro

# Auto-start no boot
pm2 startup
pm2 save

# Nginx (proxy reverso)
sudo apt install nginx

# Configurar Nginx
sudo nano /etc/nginx/sites-available/dentcarepro
```

**Configuração Nginx:**
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/dentcarepro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# SSL com Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

---

## 🔧 RESOLUÇÃO DE PROBLEMAS

### Erro: "Port 3000 already in use"

**Solução:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Erro: "pnpm: command not found"

**Solução:**
```bash
npm install -g pnpm
```

### Erro: "Cannot connect to database"

**Verificar:**
1. PostgreSQL está rodando?
2. Credenciais no .env estão corretas?
3. Banco de dados foi criado?

**Solução:**
```bash
# Verificar status PostgreSQL
# Windows
services.msc (procurar PostgreSQL)

# Linux
sudo systemctl status postgresql

# Mac
brew services list
```

### Erro: "Module not found"

**Solução:**
```bash
# Limpar cache e reinstalar
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### Erro de compilação TypeScript

**Solução:**
```bash
# Verificar erros
pnpm check

# Rebuild
pnpm build
```

### Sistema lento

**Soluções:**
1. Aumentar RAM disponível
2. Usar PostgreSQL em vez de mock data
3. Otimizar queries no código
4. Usar CDN para assets estáticos

---

## 📞 SUPORTE

### Documentação
- **README.md** - Visão geral do projeto
- **RESUMO_IMPLEMENTACOES_COMPLETO.md** - Todas as funcionalidades
- **ANALISE_FUNCIONALIDADES_FALTANTES.md** - Roadmap futuro

### Logs
- Verificar console do navegador (F12)
- Verificar logs do servidor (terminal)
- Verificar logs do PostgreSQL

### Comunidade
- GitHub Issues: https://github.com/ferpesso/dentcarepro-v8/issues
- Email: suporte@dentcarepro.com (se disponível)

---

## ✅ CHECKLIST DE INSTALAÇÃO

- [ ] Node.js 18+ instalado
- [ ] pnpm instalado
- [ ] Projeto extraído/clonado
- [ ] Dependências instaladas (`pnpm install`)
- [ ] Arquivo .env criado e configurado
- [ ] Banco de dados configurado (se produção)
- [ ] Sistema iniciado (`pnpm dev`)
- [ ] Acesso em http://localhost:3000 funcionando
- [ ] Login realizado com sucesso
- [ ] Configurações básicas preenchidas
- [ ] Primeiro utente criado

---

## 🎉 CONCLUSÃO

Seguindo este guia, você terá o **DentCarePro v8.0** instalado e funcionando em qualquer computador!

**Sistema completo com:**
- ✅ 17 módulos principais
- ✅ 130+ endpoints tRPC
- ✅ Interface moderna e responsiva
- ✅ Configurações completas
- ✅ Pronto para produção

**Boa sorte e bom uso! 🚀**

---

**Versão do Guia:** 1.0  
**Última Atualização:** 24 Out 2025  
**Criado por:** Sistema Manus

