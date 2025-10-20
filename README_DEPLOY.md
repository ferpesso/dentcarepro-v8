# DentCarePRO v8.0 - Guia de Deploy Passo a Passo

## ⚠️ LEIA ISTO PRIMEIRO!

Este é um guia **passo a passo** para fazer o deploy do DentCarePRO em outro computador. Se você não seguir exatamente os passos, o programa **não funcionará**.

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

1. **Node.js 22.13.0 ou superior**
   ```bash
   node --version  # Deve mostrar v22.13.0 ou superior
   ```

2. **PostgreSQL 14 ou superior**
   ```bash
   psql --version  # Deve mostrar PostgreSQL 14.x ou superior
   ```

3. **pnpm** (gerenciador de pacotes)
   ```bash
   pnpm --version  # Deve mostrar a versão
   ```

Se algum desses não estiver instalado, instale antes de continuar.

---

## 🚀 PASSO 1: Copiar os Arquivos do Projeto

```bash
# Copiar todo o diretório do projeto
cp -r /home/ubuntu/dentcarepro /seu/caminho/destino/dentcarepro

# Entrar no diretório
cd /seu/caminho/destino/dentcarepro

# Verificar que os arquivos foram copiados
ls -la
```

Você deve ver:
- `client/` - Frontend
- `server/` - Backend
- `drizzle/` - Schema do banco de dados
- `package.json` - Dependências
- `vite.config.ts` - Configuração do Vite
- `tsconfig.json` - Configuração do TypeScript

---

## 🚀 PASSO 2: Instalar Dependências

```bash
# Instalar todas as dependências
pnpm install

# Isto pode levar alguns minutos...
```

Se receber erros, tente:
```bash
# Limpar cache e tentar novamente
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## 🚀 PASSO 3: Configurar PostgreSQL

### 3.1 Criar o Banco de Dados

```bash
# Abrir o PostgreSQL
sudo -u postgres psql

# Dentro do PostgreSQL, executar:
CREATE USER dentcarepro WITH PASSWORD 'dentcare2025';
CREATE DATABASE dentcarepro OWNER dentcarepro;
GRANT ALL PRIVILEGES ON DATABASE dentcarepro TO dentcarepro;

# Conectar ao banco de dados
\c dentcarepro

# Dar permissões
GRANT ALL PRIVILEGES ON SCHEMA public TO dentcarepro;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO dentcarepro;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO dentcarepro;

# Sair
\q
```

### 3.2 Criar as Tabelas

```bash
# Executar o script SQL
sudo -u postgres psql -d dentcarepro < scripts/create-tables.sql

# Verificar que as tabelas foram criadas
sudo -u postgres psql -d dentcarepro -c "\dt"
```

Você deve ver uma lista de tabelas como:
- utentes
- consultas
- faturacao
- dentistas
- etc.

---

## 🚀 PASSO 4: Configurar Variáveis de Ambiente

### 4.1 Criar arquivo `.env`

```bash
# Na raiz do projeto, criar arquivo .env
nano .env
```

### 4.2 Copiar o conteúdo abaixo

```
# Database
DATABASE_URL=postgresql://dentcarepro:dentcare2025@localhost:5432/dentcarepro

# JWT Secret (gere uma string aleatória)
JWT_SECRET=sua_chave_secreta_aleatoria_aqui_12345

# OAuth (do Manus - você precisa configurar isto)
VITE_APP_ID=seu_app_id_do_manus
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im/login

# App Info
VITE_APP_TITLE=DentCarePRO v8.0
VITE_APP_LOGO=https://seu-logo-url.com/logo.png

# Opcional
OWNER_NAME=Seu Nome
OWNER_OPEN_ID=seu_open_id
```

### 4.3 Salvar o arquivo

- Pressione `Ctrl+O` para salvar
- Pressione `Enter` para confirmar
- Pressione `Ctrl+X` para sair

---

## 🚀 PASSO 5: Compilar o Projeto

```bash
# Compilar o projeto
pnpm build

# Isto pode levar alguns minutos...
```

Se receber erros, verifique:
1. Se o arquivo `.env` existe e tem as variáveis corretas
2. Se o PostgreSQL está rodando
3. Se as dependências foram instaladas corretamente

---

## 🚀 PASSO 6: Rodar o Projeto

### Opção A: Desenvolvimento (com hot reload)

```bash
pnpm dev
```

O servidor iniciará em `http://localhost:3000`

### Opção B: Produção

```bash
pnpm start
```

---

## ✅ VERIFICAR SE ESTÁ FUNCIONANDO

Abra o navegador e vá para:
```
http://localhost:3000
```

Você deve ver:
- ✅ Dashboard com 6 módulos
- ✅ Utentes com 5 pacientes
- ✅ Agenda com 5 consultas
- ✅ Faturação com 3 faturas

Se não ver nada, verifique:
1. Se o servidor está rodando (deve dizer "Server running on http://localhost:3000")
2. Se o PostgreSQL está conectado (deve dizer "[PostgreSQL] Connected to database")
3. Se o arquivo `.env` tem as variáveis corretas

---

## 🐛 SOLUÇÃO DE PROBLEMAS

### Erro: "ECONNREFUSED 127.0.0.1:5432"

**Problema:** PostgreSQL não está rodando

**Solução:**
```bash
# Verificar status
sudo service postgresql status

# Se não está rodando, iniciar
sudo service postgresql start

# Verificar conexão
psql -U dentcarepro -d dentcarepro -h localhost
```

### Erro: "permission denied for schema public"

**Problema:** Permissões do PostgreSQL incorretas

**Solução:**
```bash
sudo -u postgres psql -d dentcarepro
GRANT ALL PRIVILEGES ON SCHEMA public TO dentcarepro;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO dentcarepro;
\q
```

### Erro: "Cannot find module 'express'"

**Problema:** Dependências não instaladas

**Solução:**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Erro: "EADDRINUSE :::3000"

**Problema:** Porta 3000 já está em uso

**Solução:**
```bash
# Encontrar processo usando porta 3000
lsof -i :3000

# Matar processo
kill -9 <PID>

# Ou usar porta diferente
PORT=3001 pnpm dev
```

### Erro: "Cannot read property 'DATABASE_URL' of undefined"

**Problema:** Arquivo `.env` não existe ou não tem DATABASE_URL

**Solução:**
```bash
# Verificar se .env existe
ls -la .env

# Se não existir, criar
nano .env
# E copiar o conteúdo da seção 4.2
```

---

## 📊 Dados de Teste

O projeto vem com dados de teste pré-carregados:

### Utentes
- Maria Silva Santos (U001)
- João Pedro Costa (U002)
- Ana Rita Ferreira (U003)
- Carlos Manuel Oliveira (U004)
- Sofia Marques Rodrigues (U005)

### Consultas
- 5 consultas agendadas entre 19-20 de Outubro

### Faturas
- 3 faturas emitidas com valores diferentes

### Dentistas
- Dr. João Costa
- Dra. Ana Martins
- Dr. Carlos Silva

---

## 🔐 Credenciais Importantes

### PostgreSQL
- **Host:** localhost
- **Port:** 5432
- **Username:** dentcarepro
- **Password:** dentcare2025
- **Database:** dentcarepro

### Admin
- Usuário: Configurado via OAuth do Manus
- Senha: Configurada via OAuth do Manus

---

## 📁 Estrutura de Arquivos

```
dentcarepro/
├── client/                 # Frontend React
├── server/                 # Backend Express
├── drizzle/                # Schema do banco de dados
├── scripts/                # Scripts SQL
│   └── create-tables.sql   # Script para criar tabelas
├── package.json            # Dependências
├── .env                    # Variáveis de ambiente
├── vite.config.ts          # Configuração do Vite
├── tsconfig.json           # Configuração do TypeScript
├── drizzle.config.ts       # Configuração do Drizzle
└── README_DEPLOY.md        # Este arquivo
```

---

## ✅ Checklist Final

Antes de considerar o deploy completo:

- [ ] PostgreSQL instalado e rodando
- [ ] Banco de dados `dentcarepro` criado
- [ ] Usuário `dentcarepro` criado
- [ ] Tabelas criadas com `create-tables.sql`
- [ ] Arquivo `.env` criado com variáveis corretas
- [ ] `pnpm install` executado sem erros
- [ ] `pnpm build` executado sem erros
- [ ] `pnpm dev` inicia sem erros
- [ ] Dashboard carrega em http://localhost:3000
- [ ] Utentes aparecem na lista
- [ ] Consultas aparecem no calendário
- [ ] Faturas aparecem na lista

---

## 📞 Próximos Passos

1. **Testar em desenvolvimento** - Use `pnpm dev` para testar tudo
2. **Configurar OAuth** - Se quiser autenticação real
3. **Fazer backup** - Faça backup do banco de dados regularmente
4. **Deploy em produção** - Quando tudo estiver funcionando

---

**Gerado em:** 20 de Outubro de 2025
**Versão:** DentCarePRO v8.0
**Status:** ✅ Pronto para Deploy

