# 📦 Lista Completa de Dependências - DentCare Pro

## 📋 Resumo

Este documento lista **TODAS** as dependências do projeto para garantir que o deploy funcione corretamente.

---

## 🎯 Dependências Principais (package.json)

### Frontend

| Pacote | Versão | Descrição |
|--------|--------|-----------|
| `react` | ^19.0.0 | Biblioteca UI |
| `react-dom` | ^19.0.0 | React para web |
| `@tanstack/react-query` | ^5.62.11 | Gestão de estado assíncrono |
| `@trpc/client` | ^11.0.0-rc.698 | Cliente tRPC |
| `@trpc/react-query` | ^11.0.0-rc.698 | Integração tRPC + React Query |
| `wouter` | ^3.5.0 | Router minimalista |
| `lucide-react` | ^0.468.0 | Ícones |
| `sonner` | ^1.7.1 | Notificações toast |
| `tailwindcss` | ^4.0.0 | Framework CSS |

### Backend

| Pacote | Versão | Descrição |
|--------|--------|-----------|
| `express` | ^4.21.2 | Servidor HTTP |
| `@trpc/server` | ^11.0.0-rc.698 | Servidor tRPC |
| `drizzle-orm` | ^0.39.3 | ORM para MySQL |
| `mysql2` | ^3.12.0 | Driver MySQL |
| `zod` | ^3.24.1 | Validação de schemas |
| `jsonwebtoken` | ^9.0.2 | Autenticação JWT |
| `cookie-parser` | ^1.4.7 | Parser de cookies |
| `cors` | ^2.8.5 | CORS middleware |

### UI Components (shadcn/ui)

| Pacote | Versão | Descrição |
|--------|--------|-----------|
| `@radix-ui/react-dialog` | ^1.1.4 | Diálogos/Modais |
| `@radix-ui/react-dropdown-menu` | ^2.1.4 | Menus dropdown |
| `@radix-ui/react-label` | ^2.1.1 | Labels |
| `@radix-ui/react-select` | ^2.1.5 | Selects |
| `@radix-ui/react-slot` | ^1.1.1 | Composição |
| `@radix-ui/react-tabs` | ^1.1.3 | Tabs |
| `@radix-ui/react-toast` | ^1.2.4 | Toasts |
| `@radix-ui/react-tooltip` | ^1.1.6 | Tooltips |
| `class-variance-authority` | ^0.7.1 | Variantes CSS |
| `clsx` | ^2.1.1 | Utilitário CSS |
| `tailwind-merge` | ^2.6.0 | Merge classes Tailwind |

### Ferramentas de Desenvolvimento

| Pacote | Versão | Descrição |
|--------|--------|-----------|
| `typescript` | ^5.7.3 | TypeScript |
| `vite` | ^6.0.7 | Build tool |
| `tsx` | ^4.19.2 | Executar TypeScript |
| `drizzle-kit` | ^0.30.1 | Migrations Drizzle |
| `@vitejs/plugin-react` | ^4.3.4 | Plugin React para Vite |

---

## 📥 Como Instalar Todas as Dependências

### Método Automático (Recomendado)

```bash
# Na pasta do projeto
pnpm install
```

Este comando lê o arquivo `package.json` e instala **TODAS** as dependências automaticamente.

### Verificar Instalação

```bash
# Ver lista de pacotes instalados
pnpm list

# Ver apenas dependências principais
pnpm list --depth=0
```

---

## 🔍 Dependências por Categoria

### 1. Autenticação e Segurança

```json
{
  "jsonwebtoken": "^9.0.2",
  "cookie-parser": "^1.4.7",
  "bcrypt": "^5.1.1"
}
```

**Função:** Gestão de sessões, tokens JWT, cookies seguros

### 2. Base de Dados

```json
{
  "drizzle-orm": "^0.39.3",
  "mysql2": "^3.12.0",
  "drizzle-kit": "^0.30.1"
}
```

**Função:** ORM, conexão MySQL, migrations

### 3. API e Comunicação

```json
{
  "@trpc/server": "^11.0.0-rc.698",
  "@trpc/client": "^11.0.0-rc.698",
  "@trpc/react-query": "^11.0.0-rc.698",
  "zod": "^3.24.1",
  "superjson": "^2.2.2"
}
```

**Função:** APIs type-safe, validação, serialização

### 4. Interface de Utilizador

```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "lucide-react": "^0.468.0",
  "sonner": "^1.7.1",
  "tailwindcss": "^4.0.0"
}
```

**Função:** Componentes React, ícones, notificações, estilos

### 5. Roteamento e Estado

```json
{
  "wouter": "^3.5.0",
  "@tanstack/react-query": "^5.62.11"
}
```

**Função:** Navegação SPA, gestão de estado assíncrono

---

## ⚠️ Problemas Comuns de Instalação

### Erro: "pnpm: command not found"

**Solução:**
```bash
npm install -g pnpm
```

### Erro: "EACCES: permission denied"

**Solução (Linux/Mac):**
```bash
sudo pnpm install
```

**Solução (Windows):**
- Executar terminal como Administrador

### Erro: "Cannot find module"

**Causa:** Dependências não instaladas ou `node_modules` corrompido

**Solução:**
```bash
# Limpar cache
pnpm store prune

# Remover node_modules
rm -rf node_modules  # Linux/Mac
rmdir /s node_modules  # Windows

# Reinstalar
pnpm install
```

### Erro: "Unsupported engine"

**Causa:** Versão do Node.js incompatível

**Solução:**
```bash
# Verificar versão
node --version

# Deve ser v22.x.x ou superior
# Se não for, instalar Node.js 22+
```

---

## 📊 Tamanho das Dependências

| Categoria | Tamanho Aproximado |
|-----------|-------------------|
| `node_modules` | ~500 MB |
| Dependências de produção | ~50 MB |
| Dependências de desenvolvimento | ~450 MB |

**Nota:** O tamanho pode variar dependendo do sistema operativo.

---

## 🚀 Otimização de Produção

### Dependências de Desenvolvimento (não vão para produção)

Estas dependências são usadas apenas durante desenvolvimento:

```json
{
  "typescript": "^5.7.3",
  "vite": "^6.0.7",
  "tsx": "^4.19.2",
  "drizzle-kit": "^0.30.1",
  "@vitejs/plugin-react": "^4.3.4",
  "@types/node": "^22.10.5",
  "@types/react": "^19.0.6",
  "@types/react-dom": "^19.0.3"
}
```

### Build de Produção

```bash
# Compilar para produção
pnpm build

# Apenas dependências de produção são incluídas no bundle final
```

---

## 🔄 Atualização de Dependências

### Verificar Atualizações Disponíveis

```bash
pnpm outdated
```

### Atualizar Todas as Dependências

```bash
# Atualizar respeitando versões do package.json
pnpm update

# Atualizar para últimas versões (cuidado!)
pnpm update --latest
```

**⚠️ ATENÇÃO:** Atualizar dependências pode quebrar o código. Testar sempre após atualizar.

---

## 📋 Checklist de Dependências

Antes de fazer deploy, verificar:

- [ ] `pnpm install` executado sem erros
- [ ] Pasta `node_modules` existe e tem ~500MB
- [ ] Comando `pnpm dev` inicia sem erros
- [ ] Comando `pnpm build` compila sem erros
- [ ] Não há avisos de versões incompatíveis
- [ ] Todas as dependências críticas instaladas:
  - [ ] react
  - [ ] express
  - [ ] drizzle-orm
  - [ ] mysql2
  - [ ] @trpc/server
  - [ ] @trpc/client

---

## 🆘 Em Caso de Problemas

### Reinstalação Completa

Se tudo mais falhar:

```bash
# 1. Limpar tudo
rm -rf node_modules
rm pnpm-lock.yaml

# 2. Limpar cache do pnpm
pnpm store prune

# 3. Reinstalar
pnpm install

# 4. Verificar
pnpm dev
```

### Logs Detalhados

```bash
# Instalar com logs verbosos
pnpm install --loglevel verbose
```

---

## 📞 Suporte

### Documentação das Dependências Principais

- **React:** https://react.dev/
- **tRPC:** https://trpc.io/
- **Drizzle ORM:** https://orm.drizzle.team/
- **Tailwind CSS:** https://tailwindcss.com/
- **shadcn/ui:** https://ui.shadcn.com/

### Problemas com pnpm

- Documentação: https://pnpm.io/
- Troubleshooting: https://pnpm.io/faq

---

**Última atualização:** 17 de Outubro de 2025

