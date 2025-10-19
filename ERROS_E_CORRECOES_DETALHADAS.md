# 🔧 DentCarePRO v8.0 - Lista Completa de Erros e Correções

## 📋 Índice

1. [Erros Encontrados Durante o Desenvolvimento](#erros-desenvolvimento)
2. [Correções Aplicadas](#correcoes-aplicadas)
3. [Problemas Conhecidos e Soluções](#problemas-conhecidos)
4. [Como Corrigir Erros Comuns](#como-corrigir)

---

## 1. Erros Encontrados Durante o Desenvolvimento {#erros-desenvolvimento}

### Erro 1: "obterConfigClinica is not a function"

**Quando ocorre:** Ao aceder à página de Ajustes

**Mensagem completa:**
```
TRPCClientError: obterConfigClinica is not a function
```

**Causa:**
- A função `obterConfigClinica()` estava definida no router mas não existia no ficheiro `server/db.ts`
- O sistema em memória não tinha esta função implementada

**Sintomas:**
- Página de Ajustes não carrega
- Erro 500 (Internal Server Error)
- Consola do navegador mostra erro tRPC

**Ficheiros afetados:**
- `server/db.ts`
- `server/routers.ts`

---

### Erro 2: "There was an error establishing an SSL connection"

**Quando ocorre:** Ao tentar aceder a qualquer página que precise de dados da base de dados

**Mensagem completa:**
```
Error: There was an error establishing an SSL connection
    at /home/ubuntu/dentcarepro/node_modules/.pnpm/pg-pool@3.10.1_pg@8.16.3/node_modules/pg-pool/index.js:45:11
```

**Causa:**
- O driver PostgreSQL (pg) tenta usar SSL por padrão
- O PostgreSQL local não estava configurado para aceitar conexões SSL
- A configuração `ssl: false` na connection string não estava a funcionar

**Sintomas:**
- Ficha do utente não carrega
- Erro "SSL connection" na interface
- Erro 500 nas chamadas API
- Logs do servidor mostram erro de SSL

**Ficheiros afetados:**
- `server/db.ts`
- Configuração do PostgreSQL

---

### Erro 3: Incompatibilidade de Formato de Dados

**Quando ocorre:** Ao visualizar detalhes de um utente

**Mensagem:** Dados não aparecem ou aparecem "undefined"

**Causa:**
- PostgreSQL retorna campos em formato `snake_case` (telefone, telemovel, rua, cidade)
- Frontend espera objetos JSON aninhados (contacto.telefone, morada.rua)
- Campos de arrays (alergias, medicamentos) estavam como strings separadas por vírgula

**Sintomas:**
- Dados do utente aparecem vazios
- Contactos não aparecem
- Morada não aparece
- Informação médica não aparece

**Ficheiros afetados:**
- `server/db.ts` (função `obterUtente`)

---

### Erro 4: "Missing 'Description' or 'aria-describedby'"

**Quando ocorre:** Ao abrir diálogo de Nova Consulta

**Mensagem completa:**
```
Warning: Missing 'Description' or 'aria-describedby={undefined}' for {DialogContent}
```

**Causa:**
- Componente Dialog não tinha propriedade `aria-describedby` definida
- Problema de acessibilidade no componente

**Sintomas:**
- Aviso na consola do navegador
- Não impede funcionamento mas indica problema de acessibilidade

**Ficheiros afetados:**
- `client/src/pages/Agenda.tsx`

---

### Erro 5: Funções de Base de Dados em Falta

**Quando ocorre:** Durante a compilação ou ao aceder a diferentes módulos

**Mensagens:**
- "obterFormasPagamento is not defined"
- "obterCategoriasDespesa is not defined"
- "obterFornecedores is not defined"
- etc.

**Causa:**
- Sistema original usava base de dados em memória
- Ao migrar para PostgreSQL, muitas funções não foram implementadas

**Sintomas:**
- Erros de compilação TypeScript
- Erros 500 em várias páginas
- Funcionalidades não funcionam

**Ficheiros afetados:**
- `server/db.ts`

---

## 2. Correções Aplicadas {#correcoes-aplicadas}

### Correção 1: Implementação de Todas as Funções de Base de Dados

**Ficheiro:** `server/db.ts`

**O que foi feito:**
- Implementadas TODAS as funções necessárias para PostgreSQL
- Total de 40+ funções criadas

**Funções implementadas:**

#### Configuração
```typescript
export async function obterConfigClinica()
export async function atualizarConfigClinica(config: any)
```

#### Utentes
```typescript
export async function listarUtentes()
export async function obterUtente(id: string)
export async function criarUtente(utente: any)
export async function atualizarUtente(id: string, utente: any)
export async function removerUtente(id: string)
```

#### Consultas
```typescript
export async function listarConsultas(filtros?: any)
export async function obterConsulta(id: string)
export async function criarConsulta(consulta: any)
export async function atualizarConsulta(id: string, consulta: any)
export async function removerConsulta(id: string)
```

#### Dentistas
```typescript
export async function listarDentistas()
export async function obterDentista(id: string)
export async function criarDentista(dentista: any)
export async function atualizarDentista(id: string, dentista: any)
export async function removerDentista(id: string)
```

#### Financeiro
```typescript
export async function obterFormasPagamento()
export async function obterCategoriasDespesa()
export async function obterFornecedores()
export async function listarFaturas(filtros?: any)
export async function criarFatura(fatura: any)
export async function listarPagamentos(filtros?: any)
export async function criarPagamento(pagamento: any)
```

#### Laboratórios
```typescript
export async function listarLaboratorios()
export async function obterLaboratorio(id: string)
export async function criarLaboratorio(laboratorio: any)
export async function listarTrabalhosLaboratorio(filtros?: any)
export async function criarTrabalhoLaboratorio(trabalho: any)
```

#### Comissões
```typescript
export async function obterConfigComissoes()
export async function atualizarConfigComissoes(config: any)
export async function listarComissoes(filtros?: any)
export async function calcularComissoes(periodo: any)
```

**Como verificar se está correto:**
- Abra o ficheiro `server/db.ts`
- Procure por `export async function`
- Deve ter pelo menos 40 funções

---

### Correção 2: Configuração PostgreSQL sem SSL

**Ficheiro:** `server/db.ts`

**ANTES (ERRADO):**
```typescript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // Isto NÃO funcionava!
});
```

**DEPOIS (CORRETO):**
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

**Por que funciona:**
- Configuração explícita de cada parâmetro
- SSL desativado explicitamente
- Não depende de variáveis de ambiente

**Como verificar se está correto:**
- Abra `server/db.ts`
- Procure por `const pool = new Pool(`
- Deve ter `host`, `port`, `database`, `user`, `password`, `ssl: false`

---

### Correção 3: Transformação de Dados para Frontend

**Ficheiro:** `server/db.ts` (função `obterUtente`)

**O que foi feito:**
- Conversão de campos PostgreSQL para formato esperado pelo frontend
- Transformação de strings em arrays
- Criação de objetos aninhados

**ANTES (PostgreSQL retorna):**
```javascript
{
  id: 'utente-001',
  nome: 'Maria Silva Santos',
  telefone: '212345678',
  telemovel: '912345678',
  email: 'maria.silva@email.pt',
  rua: 'Rua das Flores',
  numero: '45',
  cidade: 'Lisboa',
  alergias: 'Penicilina, Látex',
  medicamentos: 'Aspirina'
}
```

**DEPOIS (Frontend recebe):**
```javascript
{
  id: 'utente-001',
  nome: 'Maria Silva Santos',
  nomeCompleto: 'Maria Silva Santos',
  contacto: {
    telefone: '212345678',
    telemovel: '912345678',
    email: 'maria.silva@email.pt'
  },
  morada: {
    rua: 'Rua das Flores',
    numero: '45',
    localidade: 'Lisboa'
  },
  infoMedica: {
    alergias: ['Penicilina', 'Látex'],
    medicamentos: ['Aspirina']
  }
}
```

**Código da transformação:**
```typescript
export async function obterUtente(id: string) {
  const result = await pool.query(
    'SELECT * FROM utentes WHERE id = $1',
    [id]
  );
  
  if (result.rows.length === 0) return null;
  
  const row = result.rows[0];
  
  // Converter alergias e medicamentos de string para array
  const alergias = row.alergias 
    ? row.alergias.split(',').map((a: string) => a.trim()).filter((a: string) => a) 
    : [];
  const medicamentos = row.medicamentos 
    ? row.medicamentos.split(',').map((m: string) => m.trim()).filter((m: string) => m) 
    : [];
  
  return {
    id: row.id,
    codigo: row.codigo,
    nomeCompleto: row.nome,
    nome: row.nome,
    dataNascimento: row.data_nascimento,
    genero: row.genero,
    nif: row.nif,
    numUtenteSns: row.numero_sns,
    numeroSNS: row.numero_sns,
    estado: row.estado,
    status: row.estado,
    observacoes: row.observacoes,
    contacto: {
      telefone: row.telefone || '',
      telemovel: row.telemovel || '',
      email: row.email || '',
      telefoneEmergencia: '',
    },
    morada: {
      rua: row.rua || '',
      numero: row.numero || '',
      complemento: row.complemento || '',
      codigoPostal: row.codigo_postal || '',
      localidade: row.cidade || '',
      distrito: row.cidade || '',
    },
    infoMedica: {
      alergias: alergias,
      medicamentos: medicamentos,
      condicoesMedicas: [],
      classificacaoAsa: 'I',
      grupoSanguineo: '',
      notasImportantes: row.historico_medico || '',
    },
    tags: [],
    criadoEm: row.created_at,
    atualizadoEm: row.updated_at,
  };
}
```

**Como verificar se está correto:**
- Abra `server/db.ts`
- Procure pela função `obterUtente`
- Deve ter a transformação de dados como mostrado acima

---

### Correção 4: Desativação de SSL no PostgreSQL

**Ficheiro:** Configuração do PostgreSQL

**Comandos executados:**
```sql
ALTER SYSTEM SET ssl = off;
SELECT pg_reload_conf();
```

**Como verificar se está correto:**

**No Windows:**
1. Abra o Prompt de Comando como Administrador
2. Digite:
```cmd
cd "C:\Program Files\PostgreSQL\16\bin"
psql -U postgres
```
3. Digite a password
4. No prompt do PostgreSQL, digite:
```sql
SHOW ssl;
```
5. Deve aparecer: `off`

**No Linux:**
```bash
sudo -u postgres psql -c "SHOW ssl;"
```
Deve aparecer: `off`

---

### Correção 5: Conversão snake_case para camelCase

**Ficheiro:** `server/db.ts` (função `getUser`)

**ANTES:**
```typescript
export async function getUser(userId: string) {
  const result = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [userId]
  );
  return result.rows[0] || null;
}
```

**DEPOIS:**
```typescript
export async function getUser(userId: string) {
  const result = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [userId]
  );
  
  const user = result.rows[0] || null;
  if (user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      loginMethod: user.login_method,  // snake_case → camelCase
      role: user.role,
      lastSignedIn: user.last_signed_in,  // snake_case → camelCase
    };
  }
  return null;
}
```

**Como verificar se está correto:**
- Abra `server/db.ts`
- Procure pela função `getUser`
- Deve ter a conversão de `login_method` para `loginMethod`
- Deve ter a conversão de `last_signed_in` para `lastSignedIn`

---

## 3. Problemas Conhecidos e Soluções {#problemas-conhecidos}

### Problema: "Porta 3000 já está em uso"

**Solução 1 (Windows):**
```cmd
netstat -ano | findstr :3000
taskkill /PID [NÚMERO] /F
```

**Solução 2 (Mudar porta):**
Edite o ficheiro `.env`:
```
PORT=3001
```

---

### Problema: "Cannot find module 'pg'"

**Causa:** Dependências não foram instaladas

**Solução:**
```cmd
cd C:\DentCarePRO
pnpm install
```

---

### Problema: "Database does not exist"

**Causa:** Base de dados não foi criada

**Solução:**
```cmd
cd "C:\Program Files\PostgreSQL\16\bin"
psql -U postgres -c "CREATE DATABASE dentcarepro OWNER dentcarepro;"
```

---

### Problema: Dados não aparecem após instalação

**Causa:** Backup não foi restaurado

**Solução:**
```cmd
cd C:\DentCarePRO
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U dentcarepro -d dentcarepro -f database_backup_completo.sql
```

---

## 4. Como Corrigir Erros Comuns {#como-corrigir}

### Se o sistema não inicia

1. Verifique se o Node.js está instalado:
```cmd
node --version
```

2. Verifique se o PostgreSQL está a correr:
```cmd
sc query postgresql-x64-16
```

3. Verifique se o projeto foi compilado:
```cmd
dir dist\index.js
```
Se não existir, compile:
```cmd
pnpm build
```

---

### Se aparecem erros de base de dados

1. Verifique a conexão:
```cmd
cd "C:\Program Files\PostgreSQL\16\bin"
psql -U dentcarepro -d dentcarepro
```

2. Verifique se SSL está desativado:
```sql
SHOW ssl;
```
Deve aparecer `off`

3. Verifique se as tabelas existem:
```sql
\dt
```
Deve listar 17 tabelas

---

### Se a página aparece em branco

1. Abra a consola do navegador (F12)
2. Veja os erros
3. Se aparecer erro 404, recompile:
```cmd
pnpm build
```

4. Se aparecer erro de CORS, verifique o ficheiro `.env`

---

### Se aparecem erros TypeScript

1. Limpe o cache:
```cmd
pnpm store prune
```

2. Reinstale dependências:
```cmd
del /s /q node_modules
pnpm install
```

3. Recompile:
```cmd
pnpm build
```

---

## ✅ Checklist de Verificação

Use esta checklist para verificar se tudo está correto:

**Ficheiros:**
- [ ] `server/db.ts` tem 40+ funções
- [ ] `server/db.ts` tem configuração PostgreSQL sem SSL
- [ ] `database_backup_completo.sql` existe
- [ ] `.env` tem configuração correta
- [ ] `dist/index.js` existe (projeto compilado)

**Base de Dados:**
- [ ] PostgreSQL instalado
- [ ] SSL desativado (`SHOW ssl;` retorna `off`)
- [ ] Base de dados `dentcarepro` existe
- [ ] Utilizador `dentcarepro` existe
- [ ] 17 tabelas criadas
- [ ] Dados de exemplo inseridos

**Sistema:**
- [ ] Node.js instalado
- [ ] PNPM instalado
- [ ] Dependências instaladas
- [ ] Projeto compilado
- [ ] Sistema inicia sem erros
- [ ] Acesso via navegador funciona

---

**Última atualização:** 17 de Outubro de 2025

