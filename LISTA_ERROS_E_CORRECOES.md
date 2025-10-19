# 🐛 LISTA COMPLETA DE ERROS E CORREÇÕES
## DentCare PRO - Histórico de Problemas Encontrados

**Data:** 17 de Outubro de 2025  
**Sessão de Desenvolvimento:** Módulo Financeiro + IA

---

## 📋 ÍNDICE

1. [Erros Durante o Desenvolvimento](#desenvolvimento)
2. [Erros de Configuração](#configuracao)
3. [Erros de Dependências](#dependencias)
4. [Erros de Base de Dados](#database)
5. [Como Evitar Estes Erros](#prevencao)

---

## 🔧 ERROS DURANTE O DESENVOLVIMENTO {#desenvolvimento}

### ERRO 1: Dependência @dnd-kit faltando

**Quando ocorreu:** Ao iniciar o servidor pela primeira vez

**Mensagem de erro:**
```
Error: Cannot find module '@dnd-kit/core'
```

**Causa:** Dependência não estava no package.json

**Solução aplicada:**
```bash
pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Como evitar:** Sempre execute `pnpm install` após extrair o projeto

---

### ERRO 2: Espaço no nome da função (db.ts)

**Quando ocorreu:** Ao adicionar funções de laboratórios

**Mensagem de erro:**
```
SyntaxError: Unexpected identifier 'Laboratorio'
```

**Causa:** Nome da função tinha espaço: `export async function criar Laboratorio`

**Solução aplicada:**
Corrigir para: `export async function criarLaboratorio`

**Linha afetada:** linha 1282 do arquivo `server/db.ts`

**Como evitar:** Sempre verificar sintaxe antes de salvar

---

### ERRO 3: Senha do MySQL com caracteres especiais

**Quando ocorreu:** Ao tentar conectar à base de dados

**Mensagem de erro:**
```
bash: !Secure': event not found
```

**Causa:** Senha `DentCare2025!Secure` tem `!` que é interpretado pelo bash

**Solução aplicada:**
Mudou-se a senha para: `dentcare2025` (sem caracteres especiais)

**Arquivo afetado:** `.env`

**Como evitar:** Use senhas sem caracteres especiais (!@#$%^&*) em ambientes de desenvolvimento

---

### ERRO 4: Timeout ao instalar @google/generative-ai

**Quando ocorreu:** Ao executar `pnpm add @google/generative-ai`

**Mensagem de erro:**
```
504 Gateway Time-out
```

**Causa:** Conexão lenta ou timeout do servidor npm

**Solução aplicada:**
1. Aguardar alguns segundos
2. Tentar novamente
3. Se persistir, usar: `pnpm add @google/generative-ai --network-timeout 100000`

**Como evitar:** Usar conexão estável à internet

---

### ERRO 5: Router de IA não exportado corretamente

**Quando ocorreu:** Ao tentar importar iaFinanceiraRouter

**Mensagem de erro:**
```
Module '"./routers/ia-financeira"' has no exported member 'iaFinanceiraRouter'
```

**Causa:** Arquivo `ia-financeira.ts` não tinha `export const iaFinanceiraRouter`

**Solução aplicada:**
Adicionar no final do arquivo:
```typescript
export const iaFinanceiraRouter = router({
  // ... rotas
});
```

**Como evitar:** Sempre verificar exports ao criar novos routers

---

## ⚙️ ERROS DE CONFIGURAÇÃO {#configuracao}

### ERRO 6: Arquivo .env não encontrado

**Quando ocorreu:** Ao iniciar o servidor

**Mensagem de erro:**
```
DATABASE_URL is not defined
```

**Causa:** Arquivo `.env` não existe ou está com nome errado

**Solução aplicada:**
1. Copiar `.env.example` para `.env`
2. Configurar as variáveis

**Como evitar:** Sempre criar `.env` a partir do `.env.example`

---

### ERRO 7: GEMINI_API_KEY não configurada

**Quando ocorreu:** Ao usar a IA Financeira

**Mensagem de erro:**
```
Error: GEMINI_API_KEY is not configured
```

**Causa:** Chave da API Gemini não estava no `.env`

**Solução aplicada:**
Adicionar ao `.env`:
```env
GEMINI_API_KEY=sua_chave_aqui
```

**Como obter a chave:** https://aistudio.google.com/app/apikey

**Como evitar:** Configurar todas as variáveis de ambiente antes de iniciar

---

## 📦 ERROS DE DEPENDÊNCIAS {#dependencias}

### ERRO 8: pnpm não instalado

**Quando ocorreu:** Ao tentar executar `pnpm install`

**Mensagem de erro:**
```
pnpm: command not found
```

**Causa:** pnpm não está instalado globalmente

**Solução aplicada:**
```bash
npm install -g pnpm
```

**Como evitar:** Instalar pnpm antes de começar

---

### ERRO 9: Versão do Node.js incompatível

**Quando ocorreu:** Ao executar `pnpm install`

**Mensagem de erro:**
```
The engine "node" is incompatible with this module
```

**Causa:** Node.js versão inferior a 18

**Solução aplicada:**
1. Atualizar Node.js para versão 18+
2. Ou usar nvm: `nvm install 18 && nvm use 18`

**Como evitar:** Verificar versão antes: `node --version`

---

## 🗄️ ERROS DE BASE DE DADOS {#database}

### ERRO 10: MySQL não está rodando

**Quando ocorreu:** Ao executar `pnpm db:push`

**Mensagem de erro:**
```
Error: Can't connect to MySQL server on 'localhost'
```

**Causa:** Serviço MySQL não está ativo

**Solução aplicada:**

**Windows:**
```bash
net start MySQL80
```

**macOS:**
```bash
brew services start mysql
```

**Linux:**
```bash
sudo service mysql start
```

**Como evitar:** Iniciar MySQL antes de rodar o projeto

---

### ERRO 11: Usuário 'dentcare' não existe

**Quando ocorreu:** Ao conectar à base de dados

**Mensagem de erro:**
```
ER_ACCESS_DENIED_ERROR: Access denied for user 'dentcare'@'localhost'
```

**Causa:** Usuário não foi criado no MySQL

**Solução aplicada:**
```sql
CREATE USER 'dentcare'@'localhost' IDENTIFIED BY 'dentcare2025';
GRANT ALL PRIVILEGES ON dentcarepro.* TO 'dentcare'@'localhost';
FLUSH PRIVILEGES;
```

**Como evitar:** Seguir o guia de instalação passo a passo

---

### ERRO 12: Base de dados 'dentcarepro' não existe

**Quando ocorreu:** Ao executar migrações

**Mensagem de erro:**
```
ER_BAD_DB_ERROR: Unknown database 'dentcarepro'
```

**Causa:** Base de dados não foi criada

**Solução aplicada:**
```sql
CREATE DATABASE IF NOT EXISTS dentcarepro;
```

**Como evitar:** Criar base de dados antes de rodar migrações

---

### ERRO 13: Tabelas já existem

**Quando ocorreu:** Ao executar `pnpm db:push` pela segunda vez

**Mensagem de erro:**
```
Table 'users' already exists
```

**Causa:** Migrações já foram aplicadas

**Solução aplicada:**
Isso não é um erro! É normal. O Drizzle detecta que as tabelas já existem.

**Como evitar:** N/A - comportamento esperado

---

## 🚫 ERROS DE RUNTIME {#runtime}

### ERRO 14: Porta 3000 já em uso

**Quando ocorreu:** Ao executar `pnpm dev`

**Mensagem de erro:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Causa:** Outro processo está usando a porta 3000

**Solução aplicada:**

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID [número] /F
```

**macOS/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

**Ou mudar a porta no `.env`:
```env
PORT=3001
```

**Como evitar:** Fechar o servidor anterior antes de iniciar novo

---

### ERRO 15: Timeout ao navegar no browser

**Quando ocorreu:** Ao testar a página de IA Financeira

**Mensagem de erro:**
```
browser:Error executing action browser_navigate: Task browser_navigate timeout: 90
```

**Causa:** Servidor ainda estava compilando ou página muito pesada

**Solução aplicada:**
1. Aguardar servidor terminar de compilar
2. Verificar logs do servidor
3. Tentar novamente

**Como evitar:** Aguardar mensagem "Server running on..." antes de abrir o navegador

---

## 🛡️ COMO EVITAR ESTES ERROS {#prevencao}

### Checklist Antes de Começar:

1. ✅ **Verificar versão do Node.js**
   ```bash
   node --version
   # Deve ser 18.x.x ou superior
   ```

2. ✅ **Verificar se pnpm está instalado**
   ```bash
   pnpm --version
   ```

3. ✅ **Verificar se MySQL está rodando**
   ```bash
   # Windows
   sc query MySQL80
   
   # macOS/Linux
   sudo service mysql status
   ```

4. ✅ **Criar arquivo .env**
   - Copiar `.env.example` para `.env`
   - Configurar todas as variáveis

5. ✅ **Criar base de dados**
   ```sql
   CREATE DATABASE dentcarepro;
   ```

6. ✅ **Instalar dependências**
   ```bash
   pnpm install
   ```

7. ✅ **Aplicar migrações**
   ```bash
   pnpm db:push
   ```

8. ✅ **Iniciar servidor**
   ```bash
   pnpm dev
   ```

---

## 📝 NOTAS IMPORTANTES

### Sobre Senhas:
- ❌ NÃO use caracteres especiais (!@#$%^&*) em senhas no `.env`
- ✅ Use senhas simples em desenvolvimento: `dentcare2025`
- ✅ Use senhas fortes em produção

### Sobre Caminhos:
- ❌ NÃO use pastas com espaços: `C:\Meus Documentos\Projeto`
- ✅ Use pastas sem espaços: `C:\Projetos\dentcare`

### Sobre Dependências:
- ✅ Sempre execute `pnpm install` após extrair o projeto
- ✅ Sempre execute `pnpm install` após atualizar package.json
- ✅ Use `pnpm` (não `npm` ou `yarn`)

### Sobre Base de Dados:
- ✅ MySQL deve estar rodando ANTES de iniciar o projeto
- ✅ Base de dados deve ser criada ANTES de rodar migrações
- ✅ Usuário deve ter permissões ANTES de conectar

---

## 🔍 COMO DIAGNOSTICAR NOVOS ERROS

Se encontrar um erro não listado aqui:

1. **Leia a mensagem de erro completa**
   - Não entre em pânico
   - A mensagem geralmente indica o problema

2. **Verifique o arquivo mencionado**
   - Erro geralmente mostra: `arquivo.ts:linha:coluna`
   - Abra o arquivo e vá até a linha indicada

3. **Verifique os logs**
   - Servidor: veja o terminal onde executou `pnpm dev`
   - Base de dados: veja logs do MySQL

4. **Verifique configurações**
   - `.env` está correto?
   - MySQL está rodando?
   - Porta está livre?

5. **Tente reiniciar**
   - Pare o servidor (Ctrl + C)
   - Execute `pnpm dev` novamente

6. **Em último caso**
   - Apague `node_modules`
   - Execute `pnpm install` novamente
   - Execute `pnpm db:push` novamente
   - Execute `pnpm dev` novamente

---

## 📞 SUPORTE

Se ainda tiver problemas após seguir este guia:

1. Verifique se seguiu TODOS os passos do `GUIA_INSTALACAO_COMPLETO.md`
2. Verifique se seu sistema atende aos requisitos mínimos
3. Consulte a documentação oficial das tecnologias:
   - Node.js: https://nodejs.org/docs
   - MySQL: https://dev.mysql.com/doc/
   - pnpm: https://pnpm.io/

---

**Última atualização:** 17 de Outubro de 2025  
**Desenvolvido com Manus AI**

