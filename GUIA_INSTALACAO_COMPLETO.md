# 📘 GUIA COMPLETO DE INSTALAÇÃO - DentCare PRO
## Sistema de Gestão Odontológica com IA Financeira

**Versão:** 8.0  
**Data:** 17 de Outubro de 2025  
**Autor:** Desenvolvido com Manus AI

---

## ⚠️ IMPORTANTE - LEIA ANTES DE COMEÇAR

Este guia foi criado especialmente para **pessoas sem conhecimento de programação**.  
Siga **EXATAMENTE** cada passo na ordem apresentada.

---

## 📋 ÍNDICE

1. [Requisitos do Sistema](#requisitos)
2. [Instalação Passo a Passo](#instalacao)
3. [Configuração da Base de Dados](#database)
4. [Iniciar o Sistema](#iniciar)
5. [Resolução de Problemas](#problemas)
6. [Erros Comuns e Soluções](#erros)
7. [Backup e Restauração](#backup)

---

## 🖥️ REQUISITOS DO SISTEMA {#requisitos}

### Mínimo Necessário:
- **Sistema Operacional:** Windows 10/11, macOS 10.15+, ou Ubuntu 20.04+
- **RAM:** 4 GB (recomendado 8 GB)
- **Espaço em Disco:** 2 GB livres
- **Conexão à Internet:** Necessária para instalação inicial

### Software Necessário:

#### 1. Node.js (versão 18 ou superior)
- **Download:** https://nodejs.org/
- **Escolha:** "LTS" (Long Term Support)
- **Instalação:** 
  - Windows: Execute o instalador `.msi` e clique "Next" em tudo
  - macOS: Execute o instalador `.pkg`
  - Linux: Veja instruções abaixo

**Verificar instalação:**
```bash
node --version
# Deve mostrar: v18.x.x ou superior
```

#### 2. MySQL 8.0
- **Download:** https://dev.mysql.com/downloads/mysql/
- **Instalação:**
  - Windows: Use o MySQL Installer
  - macOS: Use o DMG installer
  - Linux: Veja instruções abaixo

**IMPORTANTE:** Anote a senha do MySQL que você criar!

#### 3. pnpm (Gerenciador de Pacotes)
Após instalar Node.js, abra o terminal/prompt e execute:
```bash
npm install -g pnpm
```

**Verificar instalação:**
```bash
pnpm --version
# Deve mostrar: 9.x.x ou superior
```

---

## 📦 INSTALAÇÃO PASSO A PASSO {#instalacao}

### PASSO 1: Extrair o Projeto

1. Localize o arquivo `DentCarePro_DEPLOY_COMPLETO.zip`
2. **Clique com botão direito** → "Extrair tudo..." ou "Extract here"
3. Escolha uma pasta **SEM ESPAÇOS** no caminho
   - ✅ BOM: `C:\Projetos\dentcare`
   - ✅ BOM: `/home/usuario/dentcare`
   - ❌ RUIM: `C:\Meus Documentos\Novo Projeto\dentcare`
   - ❌ RUIM: `/home/usuario/Área de Trabalho/dentcare`

### PASSO 2: Abrir Terminal na Pasta do Projeto

#### Windows:
1. Abra a pasta `dentcare-pro-hybrid`
2. Clique na barra de endereço (onde mostra o caminho)
3. Digite `cmd` e pressione Enter
4. Uma janela preta (terminal) vai abrir

#### macOS:
1. Abra o Finder
2. Vá até a pasta `dentcare-pro-hybrid`
3. Clique com botão direito na pasta
4. Escolha "Serviços" → "Novo Terminal na Pasta"

#### Linux:
1. Abra o gerenciador de arquivos
2. Navegue até `dentcare-pro-hybrid`
3. Clique com botão direito → "Abrir no Terminal"

### PASSO 3: Instalar Dependências

No terminal que você abriu, execute:

```bash
pnpm install
```

**O que vai acontecer:**
- Vai baixar muitos arquivos (isso é normal!)
- Pode demorar 2-5 minutos
- Vai aparecer muitas mensagens (não se preocupe)

**Aguarde até aparecer:** `Done in X.Xs`

---

## 🗄️ CONFIGURAÇÃO DA BASE DE DADOS {#database}

### PASSO 1: Criar a Base de Dados

#### Opção A: Usando MySQL Workbench (Mais Fácil)

1. Abra o **MySQL Workbench**
2. Conecte ao servidor local (clique na conexão "Local instance")
3. Digite a senha que você criou na instalação
4. Clique em "Query" → "New Query Tab"
5. Cole este código:

```sql
CREATE DATABASE IF NOT EXISTS dentcarepro;
CREATE USER IF NOT EXISTS 'dentcare'@'localhost' IDENTIFIED BY 'dentcare2025';
GRANT ALL PRIVILEGES ON dentcarepro.* TO 'dentcare'@'localhost';
FLUSH PRIVILEGES;
```

6. Clique no ícone de **raio** (⚡) para executar
7. Deve aparecer "Query executed successfully"

#### Opção B: Usando Linha de Comando

**Windows:**
```bash
mysql -u root -p
# Digite a senha do MySQL
# Depois cole os comandos acima
```

**macOS/Linux:**
```bash
sudo mysql -u root -p
# Digite a senha do MySQL
# Depois cole os comandos acima
```

### PASSO 2: Configurar Variáveis de Ambiente

1. Na pasta do projeto, localize o arquivo `.env.example`
2. **Copie** este arquivo
3. **Renomeie a cópia** para `.env` (sem o .example)
4. Abra o arquivo `.env` com um editor de texto (Bloco de Notas, VS Code, etc.)
5. Verifique se está assim:

```env
# BASE DE DADOS
DATABASE_URL=mysql://dentcare:dentcare2025@localhost:3306/dentcarepro

# CHAVE GEMINI (IA Financeira)
GEMINI_API_KEY=sua_chave_aqui
```

**IMPORTANTE:** Se você usou uma senha diferente no MySQL, altere `dentcare2025` para sua senha.

### PASSO 3: Obter Chave da API Gemini (Para IA Financeira)

1. Acesse: https://aistudio.google.com/app/apikey
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Copie a chave gerada
5. Cole no arquivo `.env` substituindo `sua_chave_aqui`

**Exemplo:**
```env
GEMINI_API_KEY=AIzaSyAbc123def456ghi789jkl012mno345pqr
```

### PASSO 4: Aplicar Migrações (Criar Tabelas)

No terminal, execute:

```bash
pnpm db:push
```

**O que vai acontecer:**
- Vai criar todas as tabelas na base de dados
- Deve aparecer: `[✓] migrations applied successfully!`

**Se der erro:**
- Verifique se o MySQL está rodando
- Verifique se a senha no `.env` está correta
- Veja a seção [Resolução de Problemas](#problemas)

---

## 🚀 INICIAR O SISTEMA {#iniciar}

### PASSO 1: Iniciar o Servidor

No terminal, execute:

```bash
pnpm dev
```

**O que vai acontecer:**
- Vai compilar o código
- Vai iniciar o servidor
- Deve aparecer: `Server running on http://localhost:3000/`

### PASSO 2: Abrir no Navegador

1. Abra seu navegador (Chrome, Firefox, Edge, Safari)
2. Digite na barra de endereço: `http://localhost:3000`
3. Pressione Enter

**Deve aparecer:** A tela de login do DentCare PRO

### PASSO 3: Primeiro Acesso

**Usuário padrão:**
- Email: `dev@dentcare.local`
- Senha: (não tem senha no modo desenvolvimento)

---

## 🔧 RESOLUÇÃO DE PROBLEMAS {#problemas}

### Problema 1: "pnpm: command not found"

**Solução:**
```bash
npm install -g pnpm
```

Depois feche e abra o terminal novamente.

---

### Problema 2: "Cannot connect to MySQL server"

**Possíveis causas:**

#### A) MySQL não está rodando

**Windows:**
1. Abra "Serviços" (Win + R → digite `services.msc`)
2. Procure por "MySQL80" ou "MySQL"
3. Clique com botão direito → "Iniciar"

**macOS:**
```bash
brew services start mysql
```

**Linux:**
```bash
sudo service mysql start
```

#### B) Senha incorreta no .env

1. Abra o arquivo `.env`
2. Verifique a linha `DATABASE_URL`
3. Certifique-se que a senha está correta

---

### Problema 3: "Port 3000 is already in use"

**Solução:**

#### Windows:
```bash
netstat -ano | findstr :3000
taskkill /PID [número_do_processo] /F
```

#### macOS/Linux:
```bash
lsof -ti:3000 | xargs kill -9
```

Depois execute `pnpm dev` novamente.

---

### Problema 4: Página em branco ou erro 404

**Soluções:**

1. **Limpar cache do navegador:**
   - Pressione `Ctrl + Shift + Delete` (Windows/Linux)
   - Pressione `Cmd + Shift + Delete` (macOS)
   - Marque "Cache" e clique "Limpar"

2. **Recompilar o projeto:**
```bash
# Parar o servidor (Ctrl + C)
rm -rf node_modules
pnpm install
pnpm dev
```

---

### Problema 5: Erro "GEMINI_API_KEY is not configured"

**Solução:**
1. Abra o arquivo `.env`
2. Adicione sua chave do Gemini:
```env
GEMINI_API_KEY=sua_chave_aqui
```
3. Reinicie o servidor

---

## ❌ ERROS COMUNS E SOLUÇÕES {#erros}

### Erro: "ER_ACCESS_DENIED_ERROR"

**Significa:** Senha do MySQL incorreta

**Solução:**
1. Abra `.env`
2. Verifique a senha em `DATABASE_URL`
3. Ou recrie o usuário no MySQL:
```sql
DROP USER IF EXISTS 'dentcare'@'localhost';
CREATE USER 'dentcare'@'localhost' IDENTIFIED BY 'dentcare2025';
GRANT ALL PRIVILEGES ON dentcarepro.* TO 'dentcare'@'localhost';
FLUSH PRIVILEGES;
```

---

### Erro: "ENOENT: no such file or directory"

**Significa:** Arquivo ou pasta não encontrada

**Solução:**
1. Verifique se você está na pasta correta
2. Execute `pwd` (macOS/Linux) ou `cd` (Windows) para ver onde está
3. Navegue até a pasta `dentcare-pro-hybrid`

---

### Erro: "Cannot find module '@google/generative-ai'"

**Significa:** Dependência não instalada

**Solução:**
```bash
pnpm add @google/generative-ai
```

---

### Erro: "Syntax error near 'DentCare2025!Secure'"

**Significa:** Problema com caracteres especiais na senha

**Solução:**
Use uma senha sem caracteres especiais (!@#$%):
```env
DATABASE_URL=mysql://dentcare:dentcare2025@localhost:3306/dentcarepro
```

---

## 💾 BACKUP E RESTAURAÇÃO {#backup}

### Fazer Backup da Base de Dados

```bash
mysqldump -u dentcare -p dentcarepro > backup_dentcare_$(date +%Y%m%d).sql
```

### Restaurar Backup

```bash
mysql -u dentcare -p dentcarepro < backup_dentcare_20251017.sql
```

---

## 📞 SUPORTE

### Documentação Adicional

Consulte os seguintes arquivos na pasta do projeto:

1. `PROGRESSO_MODULO_FINANCEIRO.md` - Histórico de desenvolvimento
2. `ANALISE_SISTEMA.md` - Estrutura do sistema
3. `ESPECIFICACAO_MODULO_FINANCEIRO.md` - Detalhes do módulo financeiro
4. `LISTA_ERROS_E_CORRECOES.md` - Todos os erros que ocorreram e como foram corrigidos

---

## ✅ CHECKLIST DE VERIFICAÇÃO

Antes de reportar um problema, verifique:

- [ ] Node.js instalado (versão 18+)
- [ ] pnpm instalado
- [ ] MySQL instalado e rodando
- [ ] Base de dados `dentcarepro` criada
- [ ] Arquivo `.env` configurado corretamente
- [ ] Dependências instaladas (`pnpm install`)
- [ ] Migrações aplicadas (`pnpm db:push`)
- [ ] Porta 3000 livre
- [ ] Navegador atualizado

---

## 🎯 PRÓXIMOS PASSOS

Após a instalação bem-sucedida:

1. ✅ Acesse o sistema em `http://localhost:3000`
2. ✅ Configure a clínica em **Ajustes** → **Configurações**
3. ✅ Cadastre dentistas em **Ajustes** → **Dentistas**
4. ✅ Cadastre laboratórios em **Ajustes** → **Laboratórios**
5. ✅ Comece a usar o sistema!

---

**Desenvolvido com ❤️ usando Manus AI**

