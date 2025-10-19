# ✅ DentCarePRO v8.0 - Verificação de Integridade do Pacote

## 📋 Lista de Verificação de Ficheiros

Use esta lista para verificar se todos os ficheiros necessários estão presentes após extrair o ZIP.

---

## Ficheiros Principais (Obrigatórios)

### Raiz do Projeto
- [ ] `package.json` - Configuração do projeto e dependências
- [ ] `.env` - Configurações e passwords
- [ ] `tsconfig.json` - Configuração TypeScript
- [ ] `vite.config.ts` - Configuração do Vite (build)
- [ ] `database_backup_completo.sql` - **BACKUP DA BASE DE DADOS** ⭐

### Scripts de Instalação e Execução
- [ ] `install_windows.bat` - Instalação automática
- [ ] `start_windows.bat` - Iniciar sistema
- [ ] `backup_windows.bat` - Fazer backup

### Documentação
- [ ] `LEIA-ME_PRIMEIRO.md` - Guia de início rápido
- [ ] `GUIA_INSTALACAO_COMPLETO_WINDOWS.md` - Guia detalhado
- [ ] `ERROS_E_CORRECOES_DETALHADAS.md` - Lista de erros e correções
- [ ] `CORRECOES_POSTGRESQL_COMPLETAS.md` - Detalhes técnicos
- [ ] `VERIFICACAO_INTEGRIDADE.md` - Este ficheiro

---

## Pastas Principais (Obrigatórias)

### client/
Contém o frontend (interface do utilizador)

**Estrutura:**
```
client/
├── public/              ← Ficheiros estáticos
├── src/
│   ├── components/      ← Componentes React
│   ├── pages/           ← Páginas do sistema
│   ├── lib/             ← Bibliotecas e utilitários
│   ├── contexts/        ← Contextos React
│   ├── hooks/           ← Hooks personalizados
│   ├── App.tsx          ← Componente principal
│   ├── main.tsx         ← Ponto de entrada
│   └── index.css        ← Estilos globais
└── index.html           ← HTML principal
```

**Ficheiros importantes:**
- [ ] `client/public/index.html`
- [ ] `client/src/App.tsx`
- [ ] `client/src/main.tsx`
- [ ] `client/src/index.css`
- [ ] `client/src/lib/trpc.ts`

**Páginas principais:**
- [ ] `client/src/pages/Dashboard.tsx`
- [ ] `client/src/pages/Utentes.tsx`
- [ ] `client/src/pages/UtenteDetail.tsx`
- [ ] `client/src/pages/Agenda.tsx`
- [ ] `client/src/pages/Faturacao.tsx`
- [ ] `client/src/pages/IAFinanceira.tsx`
- [ ] `client/src/pages/Ajustes.tsx`

### server/
Contém o backend (servidor e lógica de negócio)

**Estrutura:**
```
server/
├── _core/               ← Núcleo do servidor
│   ├── context.ts
│   ├── trpc.ts
│   ├── cookies.ts
│   └── ...
├── routers/             ← Rotas da API (se existir)
├── db.ts                ← **FUNÇÕES DA BASE DE DADOS** ⭐
├── routers.ts           ← Rotas tRPC
└── index.ts             ← Ponto de entrada do servidor
```

**Ficheiros críticos:**
- [ ] `server/db.ts` - **MUITO IMPORTANTE** (40+ funções)
- [ ] `server/routers.ts`
- [ ] `server/index.ts`
- [ ] `server/_core/trpc.ts`
- [ ] `server/_core/context.ts`

### shared/
Código partilhado entre client e server

- [ ] `shared/const.ts`
- [ ] `shared/types.ts` (se existir)

### drizzle/
Definições da base de dados

- [ ] `drizzle/schema.ts` - Schema das tabelas

---

## Verificação de Conteúdo dos Ficheiros Críticos

### 1. Verificar `server/db.ts`

**Abra o ficheiro e verifique:**

✅ Deve ter configuração PostgreSQL:
```typescript
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dentcarepro',
  user: 'dentcarepro',
  password: 'dentcare2025',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: false,
});
```

✅ Deve ter PELO MENOS estas funções:
- `getUser()`
- `upsertUser()`
- `obterConfigClinica()`
- `atualizarConfigClinica()`
- `listarUtentes()`
- `obterUtente()`
- `criarUtente()`
- `atualizarUtente()`
- `removerUtente()`
- `listarConsultas()`
- `obterConsulta()`
- `criarConsulta()`
- `atualizarConsulta()`
- `removerConsulta()`
- `listarDentistas()`
- `obterDentista()`
- `criarDentista()`
- `atualizarDentista()`
- `removerDentista()`
- `obterFormasPagamento()`
- `obterCategoriasDespesa()`
- `obterFornecedores()`
- `listarFaturas()`
- `criarFatura()`
- `listarPagamentos()`
- `criarPagamento()`
- `listarLaboratorios()`
- `obterLaboratorio()`
- `criarLaboratorio()`
- `listarTrabalhosLaboratorio()`
- `criarTrabalhoLaboratorio()`
- `obterConfigComissoes()`
- `atualizarConfigComissoes()`
- `listarComissoes()`
- `calcularComissoes()`

**Total:** Deve ter **40+ funções** que começam com `export async function`

**Como verificar:**
1. Abra `server/db.ts` num editor de texto
2. Procure por `export async function` (Ctrl+F)
3. Conte quantas vezes aparece
4. Deve aparecer pelo menos 40 vezes

---

### 2. Verificar `.env`

**Abra o ficheiro e verifique:**

✅ Deve ter:
```
DATABASE_URL=postgresql://dentcarepro:dentcare2025@localhost:5432/dentcarepro
NODE_ENV=production
PORT=3000
```

**IMPORTANTE:** Se a password do PostgreSQL for diferente, altere aqui!

---

### 3. Verificar `database_backup_completo.sql`

**Características:**
- Tamanho: ~30-40 KB
- Primeira linha deve ser: `--` ou `SET`
- Deve conter: `CREATE TABLE`
- Deve conter: `INSERT INTO`

**Como verificar:**
1. Abra o ficheiro num editor de texto
2. Procure por `CREATE TABLE users`
3. Procure por `CREATE TABLE utentes`
4. Procure por `INSERT INTO utentes`
5. Se encontrar todos, o backup está correto!

---

### 4. Verificar `package.json`

**Abra o ficheiro e verifique:**

✅ Deve ter estas dependências principais:
```json
{
  "dependencies": {
    "@trpc/server": "^11.x.x",
    "@trpc/react-query": "^11.x.x",
    "react": "^19.x.x",
    "pg": "^8.x.x",
    "express": "^4.x.x"
  }
}
```

✅ Deve ter estes scripts:
```json
{
  "scripts": {
    "dev": "...",
    "build": "...",
    "start": "..."
  }
}
```

---

## Verificação Automática (Avançado)

Se souber usar o Prompt de Comando, pode verificar automaticamente:

### Verificar estrutura de pastas
```cmd
cd C:\DentCarePRO
dir /s /b > estrutura.txt
notepad estrutura.txt
```

### Contar funções em db.ts
```cmd
cd C:\DentCarePRO
findstr /c:"export async function" server\db.ts
```

Deve aparecer pelo menos 40 linhas!

### Verificar tamanho do backup
```cmd
cd C:\DentCarePRO
dir database_backup_completo.sql
```

Deve ter ~30-40 KB

---

## Problemas Comuns

### Ficheiro `db.ts` muito pequeno

**Sintoma:** Ficheiro `server/db.ts` tem menos de 1000 linhas

**Causa:** Ficheiro corrompido ou versão antiga

**Solução:** Reextraia o ZIP ou descarregue novamente

### Backup da base de dados vazio

**Sintoma:** `database_backup_completo.sql` tem 0 KB ou menos de 10 KB

**Causa:** Backup não foi criado corretamente

**Solução:** Use o backup incluído no pacote original

### Pastas `node_modules` ou `dist` presentes

**Sintoma:** Pastas `node_modules` ou `dist` já existem após extrair

**Causa:** Normal! Estas pastas são criadas durante a instalação

**Solução:** Não é problema, pode continuar

---

## Checklist Final de Integridade

Marque TODOS os itens antes de instalar:

**Ficheiros de Configuração:**
- [ ] `package.json` existe e tem dependências
- [ ] `.env` existe e tem configuração PostgreSQL
- [ ] `tsconfig.json` existe

**Código Fonte:**
- [ ] Pasta `client/` existe e tem ficheiros
- [ ] Pasta `server/` existe e tem ficheiros
- [ ] Pasta `shared/` existe
- [ ] `server/db.ts` existe e tem 40+ funções
- [ ] `server/routers.ts` existe

**Base de Dados:**
- [ ] `database_backup_completo.sql` existe
- [ ] Tamanho do backup é ~30-40 KB
- [ ] Backup contém `CREATE TABLE` e `INSERT INTO`

**Scripts:**
- [ ] `install_windows.bat` existe
- [ ] `start_windows.bat` existe
- [ ] `backup_windows.bat` existe

**Documentação:**
- [ ] `LEIA-ME_PRIMEIRO.md` existe
- [ ] `GUIA_INSTALACAO_COMPLETO_WINDOWS.md` existe
- [ ] `ERROS_E_CORRECOES_DETALHADAS.md` existe

**Se TODOS os itens estiverem marcados, o pacote está íntegro e pronto para instalação!**

---

## O que fazer se faltar algum ficheiro

1. **NÃO CONTINUE** com a instalação
2. Verifique se extraiu o ZIP completamente
3. Verifique se não há erros de extração
4. Tente extrair novamente para uma pasta diferente
5. Se o problema persistir, descarregue o pacote novamente

---

## Suporte

Se após verificar tudo ainda tiver problemas:

1. Anote quais ficheiros estão em falta
2. Tire uma foto da estrutura de pastas
3. Contacte o suporte com estas informações

---

**Versão:** 1.0  
**Data:** 17 de Outubro de 2025

