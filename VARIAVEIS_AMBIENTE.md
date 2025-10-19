# 🔐 Guia de Variáveis de Ambiente - DentCare Pro

## ⚠️ IMPORTANTE

As variáveis de ambiente são **configuradas automaticamente** pela plataforma Manus quando o projeto é criado. 

Se estiver a fazer deploy **fora da plataforma Manus**, precisará de configurar manualmente o arquivo `.env`.

---

## 📝 Variáveis Já Configuradas (Plataforma Manus)

Estas variáveis já estão disponíveis automaticamente:

| Variável | Descrição | Valor Atual |
|----------|-----------|-------------|
| `BUILT_IN_FORGE_API_KEY` | Chave API Manus | ✅ Configurado |
| `BUILT_IN_FORGE_API_URL` | URL API Manus | ✅ Configurado |
| `JWT_SECRET` | Segredo JWT | ✅ Configurado |
| `OAUTH_SERVER_URL` | URL OAuth | ✅ Configurado |
| `OWNER_NAME` | Nome do proprietário | ✅ Configurado |
| `OWNER_OPEN_ID` | ID do proprietário | ✅ Configurado |
| `VITE_APP_ID` | ID da aplicação | ✅ Configurado |
| `VITE_APP_LOGO` | Logo da aplicação | ✅ Configurado |
| `VITE_APP_TITLE` | Título da aplicação | ✅ Configurado |
| `VITE_OAUTH_PORTAL_URL` | URL portal OAuth | ✅ Configurado |

---

## 🗄️ Variável que PRECISA Configurar

### DATABASE_URL (Obrigatória)

**Descrição:** String de conexão com a base de dados MySQL/TiDB

**Formato:**
```
mysql://usuario:senha@host:porta/nome_base_dados
```

**Exemplos:**

**MySQL Local:**
```env
DATABASE_URL=mysql://dentcare:minhasenha123@localhost:3306/dentcare_pro
```

**TiDB Cloud:**
```env
DATABASE_URL=mysql://usuario.root:senha@gateway01.sa-east-1.prod.aws.tidbcloud.com:4000/dentcare_pro?ssl={"rejectUnauthorized":true}
```

**Como configurar:**

1. **Se usar MySQL local:**
   - Instalar MySQL
   - Criar base de dados: `CREATE DATABASE dentcare_pro;`
   - Criar utilizador: `CREATE USER 'dentcare'@'localhost' IDENTIFIED BY 'sua_senha';`
   - Dar permissões: `GRANT ALL PRIVILEGES ON dentcare_pro.* TO 'dentcare'@'localhost';`
   - Usar no `.env`: `mysql://dentcare:sua_senha@localhost:3306/dentcare_pro`

2. **Se usar TiDB Cloud:**
   - Criar conta em https://tidbcloud.com/
   - Criar cluster (Free Tier disponível)
   - Copiar connection string fornecida
   - Colar no `.env`

---

## 🔧 Variáveis Opcionais

### PORT

**Descrição:** Porta onde o servidor vai rodar

**Valor padrão:** `3000`

**Como alterar:**
```env
PORT=3001
```

### NODE_ENV

**Descrição:** Ambiente de execução

**Valores possíveis:** `development` ou `production`

**Padrão:** `production`

---

## 📂 Onde Configurar

### Na Plataforma Manus

1. Aceder às configurações do projeto
2. Ir em "Environment Variables" ou "Secrets"
3. Adicionar `DATABASE_URL`
4. Salvar

### Deploy Manual (Fora da Manus)

1. Criar arquivo `.env` na raiz do projeto
2. Adicionar as variáveis necessárias
3. **NUNCA** fazer commit do arquivo `.env` no Git

**Exemplo de arquivo `.env`:**

```env
# Base de Dados (OBRIGATÓRIO)
DATABASE_URL=mysql://dentcare:senha@localhost:3306/dentcare_pro

# Porta (Opcional)
PORT=3000

# Ambiente (Opcional)
NODE_ENV=production
```

---

## ✅ Como Verificar se Está Configurado

### Método 1: Iniciar o Servidor

```bash
pnpm dev
```

**Se tudo estiver OK, verá:**
```
✓ Server running on http://localhost:3000/
✓ [OAuth] Initialized
✓ Database connected
```

**Se houver erro:**
```
❌ Error: DATABASE_URL is not defined
```
→ Precisa configurar a variável `DATABASE_URL`

### Método 2: Verificar Logs

Ao iniciar o servidor, verificar se aparecem mensagens de erro relacionadas a variáveis de ambiente.

---

## 🚨 Problemas Comuns

### Erro: "DATABASE_URL is not defined"

**Causa:** Variável `DATABASE_URL` não está configurada

**Solução:**
1. Criar arquivo `.env` na raiz do projeto
2. Adicionar: `DATABASE_URL=mysql://...`
3. Reiniciar servidor

### Erro: "ECONNREFUSED" ao conectar BD

**Causa:** MySQL não está a correr OU credenciais erradas

**Solução:**
1. Verificar se MySQL está a correr:
   ```bash
   # Windows
   net start MySQL80
   
   # macOS
   brew services start mysql
   
   # Linux
   sudo systemctl start mysql
   ```

2. Testar conexão manualmente:
   ```bash
   mysql -u dentcare -p dentcare_pro
   ```

3. Se não conseguir conectar, verificar:
   - Utilizador existe?
   - Senha está correta?
   - Base de dados existe?

### Erro: "Access denied for user"

**Causa:** Credenciais erradas no `DATABASE_URL`

**Solução:**
1. Verificar utilizador e senha no MySQL
2. Atualizar `DATABASE_URL` com credenciais corretas
3. Reiniciar servidor

---

## 🔒 Segurança

### ⚠️ NUNCA FAZER:

- ❌ Compartilhar arquivo `.env`
- ❌ Fazer commit do `.env` no Git
- ❌ Usar senhas fracas
- ❌ Expor credenciais em código

### ✅ SEMPRE FAZER:

- ✅ Usar senhas fortes e únicas
- ✅ Adicionar `.env` no `.gitignore`
- ✅ Fazer backup das credenciais em local seguro
- ✅ Usar variáveis de ambiente diferentes para dev/prod

---

## 📋 Checklist de Configuração

Antes de iniciar o sistema, verificar:

- [ ] MySQL instalado e a correr
- [ ] Base de dados `dentcare_pro` criada
- [ ] Utilizador MySQL criado com permissões
- [ ] Arquivo `.env` criado (se deploy manual)
- [ ] Variável `DATABASE_URL` configurada
- [ ] Credenciais Manus disponíveis (se usar OAuth)
- [ ] Servidor inicia sem erros (`pnpm dev`)
- [ ] Consegue fazer login no sistema

---

## 📞 Suporte

### Problemas com Variáveis Manus

Se perdeu as credenciais da plataforma Manus:
- Contactar suporte: https://help.manus.im
- Verificar painel de configurações do projeto

### Problemas com Base de Dados

Consultar documentação:
- MySQL: https://dev.mysql.com/doc/
- TiDB: https://docs.pingcap.com/

---

**Última atualização:** 17 de Outubro de 2025

