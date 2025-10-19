# 📦 DentCare Pro - Guia Completo de Instalação e Deploy

**Versão:** Sistema Híbrido v1.0  
**Data:** 17 de Outubro de 2025  
**Autor:** Manus AI

---

## 📋 Índice

1. [Requisitos do Sistema](#requisitos-do-sistema)
2. [Instalação Passo-a-Passo](#instalação-passo-a-passo)
3. [Configuração da Base de Dados](#configuração-da-base-de-dados)
4. [Variáveis de Ambiente](#variáveis-de-ambiente)
5. [Iniciar o Sistema](#iniciar-o-sistema)
6. [Verificação de Funcionamento](#verificação-de-funcionamento)
7. [Problemas Conhecidos e Soluções](#problemas-conhecidos-e-soluções)
8. [Estrutura do Projeto](#estrutura-do-projeto)

---

## 🖥️ Requisitos do Sistema

### Software Necessário

- **Node.js**: versão 22.13.0 ou superior
- **pnpm**: versão 9.x ou superior
- **MySQL**: versão 8.0 ou superior (ou TiDB compatível)
- **Git**: para controlo de versões (opcional)

### Como Verificar Versões Instaladas

```bash
node --version    # Deve mostrar v22.x.x ou superior
pnpm --version    # Deve mostrar 9.x.x ou superior
mysql --version   # Deve mostrar 8.0.x ou superior
```

### Instalar Node.js (se não tiver)

**Windows:**
1. Baixar de https://nodejs.org/
2. Executar o instalador
3. Reiniciar o terminal

**macOS:**
```bash
brew install node@22
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Instalar pnpm

```bash
npm install -g pnpm
```

---

## 📥 Instalação Passo-a-Passo

### Passo 1: Extrair o Projeto

1. Extrair o arquivo ZIP do projeto para uma pasta (ex: `C:\dentcare-pro` ou `/home/user/dentcare-pro`)
2. Abrir terminal/prompt de comando nessa pasta

### Passo 2: Instalar Dependências

```bash
# Navegar para a pasta do projeto
cd dentcare-pro-hybrid

# Instalar todas as dependências
pnpm install
```

**⚠️ IMPORTANTE:** Este passo pode demorar 5-10 minutos. Aguarde até terminar completamente.

### Passo 3: Verificar Instalação

```bash
# Verificar se as dependências foram instaladas
ls node_modules  # Linux/Mac
dir node_modules # Windows
```

Deve ver uma pasta `node_modules` com centenas de pastas dentro.

---

## 🗄️ Configuração da Base de Dados

### Opção 1: MySQL Local

#### Instalar MySQL

**Windows:**
1. Baixar MySQL Installer de https://dev.mysql.com/downloads/installer/
2. Executar e escolher "Developer Default"
3. Definir senha do root (guardar esta senha!)

**macOS:**
```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

**Linux:**
```bash
sudo apt-get install mysql-server
sudo mysql_secure_installation
```

#### Criar Base de Dados

```bash
# Entrar no MySQL
mysql -u root -p

# Dentro do MySQL, executar:
CREATE DATABASE dentcare_pro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'dentcare'@'localhost' IDENTIFIED BY 'senha_segura_aqui';
GRANT ALL PRIVILEGES ON dentcare_pro.* TO 'dentcare'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Guardar estas informações:**
- Host: `localhost`
- Porta: `3306`
- Base de dados: `dentcare_pro`
- Utilizador: `dentcare`
- Senha: `senha_segura_aqui`

### Opção 2: TiDB Cloud (Recomendado para Produção)

1. Criar conta em https://tidbcloud.com/
2. Criar novo cluster (Free Tier disponível)
3. Copiar a connection string fornecida

---

## 🔐 Variáveis de Ambiente

### Criar Arquivo .env

Criar um arquivo chamado `.env` na raiz do projeto com o seguinte conteúdo:

```env
# ========================================
# BASE DE DADOS
# ========================================
DATABASE_URL=mysql://dentcare:senha_segura_aqui@localhost:3306/dentcare_pro

# ========================================
# AUTENTICAÇÃO (Fornecido pela Manus)
# ========================================
JWT_SECRET=seu_jwt_secret_aqui
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_ID=seu_app_id_aqui
OWNER_OPEN_ID=seu_owner_id_aqui
OWNER_NAME=Seu Nome

# ========================================
# APLICAÇÃO
# ========================================
VITE_APP_TITLE=DentCare Pro
VITE_APP_LOGO=/logo.png
PORT=3000
NODE_ENV=production

# ========================================
# APIS INTEGRADAS (Fornecido pela Manus)
# ========================================
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_api_key_aqui

# ========================================
# ANALYTICS (Opcional)
# ========================================
VITE_ANALYTICS_ENDPOINT=
VITE_ANALYTICS_WEBSITE_ID=
```

**⚠️ ATENÇÃO:** Substituir os valores `seu_*_aqui` pelos valores reais fornecidos pela plataforma Manus.

### Como Obter as Credenciais Manus

As credenciais são fornecidas automaticamente quando o projeto é criado na plataforma Manus. Se estiver a fazer deploy fora da plataforma, contactar o suporte Manus para obter:
- `JWT_SECRET`
- `VITE_APP_ID`
- `OWNER_OPEN_ID`
- `BUILT_IN_FORGE_API_KEY`

---

## 🚀 Iniciar o Sistema

### Passo 1: Criar Tabelas na Base de Dados

```bash
# Executar migrations
pnpm db:push
```

Este comando cria todas as tabelas necessárias na base de dados.

**Tabelas criadas:**
- `users` - Utilizadores do sistema
- `utentes` - Pacientes
- `consultas` - Consultas/Agendamentos
- `dentistas` - Profissionais
- `comissoes` - Comissões dos dentistas
- `config_comissoes` - Configuração de comissões
- `config_clinica` - Configurações da clínica
- `formas_pagamento` - Métodos de pagamento
- `funcionarios` - Staff da clínica

### Passo 2: Iniciar o Servidor

#### Modo Desenvolvimento

```bash
pnpm dev
```

O sistema estará disponível em: http://localhost:3000

#### Modo Produção

```bash
# Compilar o projeto
pnpm build

# Iniciar servidor de produção
pnpm start
```

---

## ✅ Verificação de Funcionamento

### Checklist de Verificação

- [ ] Servidor iniciou sem erros
- [ ] Página inicial carrega (http://localhost:3000)
- [ ] Login funciona
- [ ] Dashboard mostra os 6 módulos
- [ ] Módulo Utentes abre
- [ ] Módulo Consultas abre
- [ ] Módulo Faturação abre
- [ ] Módulo Ajustes abre

### Testes Funcionais

1. **Testar Login:**
   - Aceder http://localhost:3000
   - Clicar em "Login"
   - Fazer login com conta Manus

2. **Testar Dashboard:**
   - Deve ver 6 cards: Utentes, Consultas, Tratamentos, Orçamentos, Faturação, Ajustes

3. **Testar Gestão de Dentistas:**
   - Ir em Ajustes > Dentistas
   - Clicar "Novo Dentista"
   - Preencher formulário
   - Salvar
   - Verificar se aparece na lista

4. **Testar Configuração de Comissões:**
   - No formulário de dentista, rolar até "Configuração de Comissões"
   - Escolher tipo (Percentagem/Fixo/Misto)
   - Definir valores
   - Salvar
   - Verificar se salvou corretamente

---

## 🔧 Problemas Conhecidos e Soluções

### Erro 1: "Query data cannot be undefined"

**Sintoma:** Erro ao carregar página de Ajustes

**Causa:** Função `obterConfigClinica()` retorna undefined quando não há configurações

**Solução:** JÁ CORRIGIDO na versão atual. A função agora retorna objeto padrão.

**Se ainda ocorrer:**
```typescript
// Verificar em server/db.ts linha 868
// Deve ter:
export async function obterConfigClinica(): Promise<ConfigClinica> {
  // ... código que retorna objeto padrão se não houver dados
}
```

### Erro 2: "Component is changing controlled input to uncontrolled"

**Sintoma:** Warning no console do navegador na página de Ajustes

**Causa:** Inputs recebem `undefined` como valor inicial

**Solução:** JÁ CORRIGIDO. Todos os inputs usam `|| ""` para garantir string vazia.

**Se ainda ocorrer:**
```tsx
// Em ConfiguracoesBasicas.tsx, verificar se todos os inputs têm:
value={formData.campo || ""}
// Em vez de:
value={formData.campo}
```

### Erro 3: "Table doesn't exist"

**Sintoma:** Erro ao tentar acessar dados

**Causa:** Tabelas não foram criadas na base de dados

**Solução:**
```bash
pnpm db:push
```

### Erro 4: "Connection refused" ou "ECONNREFUSED"

**Sintoma:** Não consegue conectar à base de dados

**Causas possíveis:**
1. MySQL não está a correr
2. Credenciais erradas no `.env`
3. Porta errada

**Soluções:**

**Verificar se MySQL está a correr:**
```bash
# Windows
net start MySQL80

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql
sudo systemctl status mysql
```

**Verificar credenciais:**
```bash
mysql -u dentcare -p dentcare_pro
# Se não conseguir entrar, as credenciais estão erradas
```

**Verificar porta:**
```bash
mysql -u root -p -e "SHOW VARIABLES LIKE 'port';"
# Deve mostrar 3306
```

### Erro 5: "Port 3000 already in use"

**Sintoma:** Erro ao iniciar servidor

**Causa:** Outra aplicação está a usar a porta 3000

**Solução:**

**Opção 1 - Mudar porta:**
```env
# No arquivo .env, adicionar:
PORT=3001
```

**Opção 2 - Parar processo na porta 3000:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <número_do_pid> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Erro 6: "pnpm: command not found"

**Sintoma:** Comando pnpm não é reconhecido

**Solução:**
```bash
npm install -g pnpm
```

### Erro 7: Página em branco após login

**Sintoma:** Após login, página fica em branco

**Causa:** Erro de JavaScript no frontend

**Solução:**
1. Abrir console do navegador (F12)
2. Ver erro específico
3. Verificar se todos os arquivos foram copiados corretamente
4. Limpar cache do navegador (Ctrl+Shift+Delete)
5. Reiniciar servidor

---

## 📁 Estrutura do Projeto

```
dentcare-pro-hybrid/
├── client/                    # Frontend (React)
│   ├── public/               # Arquivos estáticos
│   │   └── logo.png         # Logo da aplicação
│   └── src/
│       ├── components/       # Componentes reutilizáveis
│       │   ├── ui/          # Componentes shadcn/ui
│       │   └── ajustes/     # Componentes de Ajustes
│       │       ├── ConfiguracoesBasicas.tsx
│       │       ├── GestaoDentistas.tsx
│       │       ├── FormularioDentista.tsx
│       │       └── ConfiguracoesFinanceiras.tsx
│       ├── pages/           # Páginas da aplicação
│       │   ├── Home.tsx            # Dashboard principal
│       │   ├── Utentes.tsx         # Gestão de pacientes
│       │   ├── UtenteDetail.tsx    # Ficha do paciente
│       │   ├── AgendaAvancadaV2.tsx # Agenda de consultas
│       │   ├── Faturacao.tsx       # Módulo financeiro
│       │   ├── Ajustes.tsx         # Configurações
│       │   └── DentistaComissoes.tsx # Dashboard de comissões
│       ├── lib/
│       │   └── trpc.ts      # Cliente tRPC
│       ├── App.tsx          # Rotas principais
│       └── main.tsx         # Entry point
│
├── server/                   # Backend (Express + tRPC)
│   ├── _core/               # Infraestrutura
│   │   ├── index.ts        # Servidor Express
│   │   ├── trpc.ts         # Configuração tRPC
│   │   ├── context.ts      # Contexto de autenticação
│   │   └── cookies.ts      # Gestão de cookies
│   ├── routers/            # Routers tRPC
│   │   ├── dentistas.ts    # API de dentistas
│   │   ├── configuracoes.ts # API de configurações
│   │   ├── comissoes.ts    # API de comissões
│   │   └── financeiro.ts   # API financeira
│   ├── db.ts               # Funções de acesso a dados
│   ├── routers.ts          # Router principal
│   └── mockData.ts         # Dados de exemplo
│
├── drizzle/                 # Schema da base de dados
│   └── schema.ts           # Definição de tabelas
│
├── shared/                  # Código partilhado
│   ├── types-financeiro.ts # Tipos financeiros
│   └── const.ts            # Constantes
│
├── .env                     # Variáveis de ambiente (CRIAR)
├── package.json            # Dependências
├── tsconfig.json           # Configuração TypeScript
└── vite.config.ts          # Configuração Vite

```

### Arquivos Importantes

| Arquivo | Descrição | Pode Editar? |
|---------|-----------|--------------|
| `.env` | Variáveis de ambiente | ✅ SIM - Necessário configurar |
| `drizzle/schema.ts` | Schema da BD | ⚠️ Cuidado - Apenas se souber |
| `server/db.ts` | Funções de BD | ⚠️ Cuidado - Apenas se souber |
| `server/routers.ts` | APIs | ⚠️ Cuidado - Apenas se souber |
| `client/src/pages/*.tsx` | Páginas | ✅ SIM - Para personalizar UI |
| `package.json` | Dependências | ❌ NÃO - Não alterar |

---

## 🎯 Funcionalidades Implementadas

### ✅ Módulos Completos

1. **Dashboard**
   - Visão geral do sistema
   - Acesso rápido aos módulos
   - Cards informativos

2. **Gestão de Utentes**
   - Cadastro de pacientes
   - Ficha completa com tabs
   - Histórico médico
   - Histórico de consultas
   - **Histórico financeiro** (novo)

3. **Agenda de Consultas**
   - Calendário semanal
   - Marcação de consultas
   - Filtros por status
   - Estatísticas

4. **Faturação**
   - Criação de faturas
   - Gestão de pagamentos
   - Relatórios financeiros
   - **Integração com comissões** (novo)

5. **Ajustes e Configurações**
   - Configurações básicas da clínica
   - **Gestão de dentistas** (novo)
   - **Sistema de comissões** (novo)
   - Configurações financeiras
   - Branding (em desenvolvimento)

### ✅ Sistema de Comissões (NOVO)

#### Configuração por Dentista
- **Tipo Percentagem:** Ex: 30% do valor da fatura
- **Tipo Fixo:** Ex: 150€ por dia/consulta
- **Tipo Misto:** Ex: 20% + 50€ fixo

#### Cálculo Automático
- Ao criar fatura, sistema calcula comissão automaticamente
- Respeita limites mínimo/máximo configurados
- Registra na tabela de comissões

#### Dashboard de Comissões
- Resumo financeiro por dentista
- Total pendente, pago, geral
- Histórico detalhado de comissões
- Filtros por período

---

## 📊 Fluxo de Dados

### Criação de Fatura → Comissão

```
1. Utilizador cria fatura
   ↓
2. Seleciona dentista responsável
   ↓
3. Sistema busca configuração de comissão do dentista
   ↓
4. Calcula valor da comissão:
   - Se percentagem: valor_fatura × (percentagem / 100)
   - Se fixo: valor_fixo
   - Se misto: (valor_fatura × percentagem / 100) + valor_fixo
   ↓
5. Aplica limites (mínimo/máximo se configurados)
   ↓
6. Cria registro na tabela comissoes
   ↓
7. Comissão fica "pendente" até ser paga ao dentista
```

---

## 🔄 Histórico de Alterações e Correções

### Versão 1.0 (17/10/2025)

#### ✅ Implementado
- Sistema base completo (Dashboard, Utentes, Consultas, Faturação)
- Módulo de Ajustes e Configurações
- Gestão de Dentistas
- Sistema de Comissões
- Integração Faturas ↔ Comissões

#### 🐛 Bugs Corrigidos

**Bug #1: Query undefined**
- **Problema:** `configuracoes.obter` retornava `undefined`
- **Arquivo:** `server/db.ts` linha 868
- **Correção:** Função agora retorna objeto padrão quando não há dados
- **Status:** ✅ CORRIGIDO

**Bug #2: Controlled/Uncontrolled Input**
- **Problema:** Inputs recebiam `undefined` causando warning React
- **Arquivo:** `client/src/components/ajustes/ConfiguracoesBasicas.tsx`
- **Correção:** Todos os inputs usam `|| ""` para garantir string vazia
- **Status:** ✅ CORRIGIDO

---

## 📞 Suporte

### Em Caso de Problemas

1. **Verificar esta documentação** - A maioria dos problemas está documentada
2. **Verificar logs do servidor** - Erros aparecem no terminal
3. **Verificar console do navegador** - Erros de frontend aparecem aqui (F12)
4. **Verificar arquivo .env** - Credenciais corretas?
5. **Verificar base de dados** - MySQL está a correr?

### Logs Importantes

**Logs do Servidor:**
```bash
# Ao iniciar com pnpm dev, ver mensagens:
✓ Server running on http://localhost:3000/
✓ [OAuth] Initialized
✓ Database connected
```

**Logs de Erro Comuns:**
```
❌ "ECONNREFUSED" → MySQL não está a correr
❌ "Table doesn't exist" → Executar pnpm db:push
❌ "Port already in use" → Mudar porta ou parar processo
❌ "Cannot find module" → Executar pnpm install
```

---

## 🎓 Para Quem Não Sabe Programar

### Comandos Básicos do Terminal

```bash
# Navegar para pasta
cd nome_da_pasta

# Ver conteúdo da pasta atual
ls        # Mac/Linux
dir       # Windows

# Voltar para pasta anterior
cd ..

# Limpar terminal
clear     # Mac/Linux
cls       # Windows
```

### Como Abrir Terminal na Pasta do Projeto

**Windows:**
1. Abrir pasta do projeto no Explorador de Arquivos
2. Clicar na barra de endereço
3. Escrever `cmd` e pressionar Enter

**macOS:**
1. Abrir pasta do projeto no Finder
2. Botão direito na pasta
3. "Serviços" → "Novo Terminal na Pasta"

**Linux:**
1. Abrir pasta do projeto no gestor de arquivos
2. Botão direito
3. "Abrir no Terminal"

### Atalhos Úteis

- **Ctrl+C** - Parar servidor em execução
- **Seta para cima** - Ver comando anterior
- **Tab** - Autocompletar nome de arquivo/pasta

---

## ✅ Checklist Final Antes do Deploy

- [ ] Node.js instalado (v22+)
- [ ] pnpm instalado
- [ ] MySQL instalado e a correr
- [ ] Base de dados criada
- [ ] Arquivo `.env` criado e configurado
- [ ] Dependências instaladas (`pnpm install`)
- [ ] Tabelas criadas (`pnpm db:push`)
- [ ] Servidor inicia sem erros (`pnpm dev`)
- [ ] Página inicial carrega
- [ ] Login funciona
- [ ] Todos os módulos abrem

---

**Versão do documento:** 1.0  
**Última atualização:** 17 de Outubro de 2025  
**Preparado por:** Manus AI para DentCare Pro

