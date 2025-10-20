# 🚀 Deploy DentCarePRO na Railway

## Passo 1: Criar Conta na Railway

1. Aceder a [railway.app](https://railway.app)
2. Clicar em **"Start a New Project"**
3. Fazer login com GitHub

## Passo 2: Criar Projeto

1. Clicar em **"Deploy from GitHub repo"**
2. Selecionar o repositório **ferpesso/dentcarepro-v8**
3. Clicar em **"Deploy Now"**

## Passo 3: Adicionar PostgreSQL

1. No dashboard do projeto, clicar em **"+ New"**
2. Selecionar **"Database"**
3. Escolher **"Add PostgreSQL"**
4. Aguardar a criação da base de dados

## Passo 4: Conectar Base de Dados à Aplicação

1. Clicar no serviço da aplicação (dentcarepro-v8)
2. Ir para a aba **"Variables"**
3. Clicar em **"+ New Variable"**
4. Adicionar **"Reference"** → Selecionar PostgreSQL → **DATABASE_URL**

## Passo 5: Configurar Variáveis de Ambiente

Adicionar as seguintes variáveis (aba Variables):

```
NODE_ENV=production
PORT=3000
JWT_SECRET=dentcarepro-jwt-secret-2025-secure-key-railway
VITE_APP_ID=dentcarepro_v8
VITE_APP_TITLE=DentCare PRO
```

## Passo 6: Inicializar Base de Dados

1. No serviço PostgreSQL, clicar em **"Data"** → **"Query"**
2. Copiar e executar o conteúdo do ficheiro `database_init.sql`
3. Depois executar `insert_sample_data.sql` para dados de exemplo

## Passo 7: Fazer Deploy

1. A Railway faz deploy automático após cada commit
2. Aguardar o build terminar (3-5 minutos)
3. Clicar em **"Settings"** → **"Generate Domain"**
4. Copiar o URL gerado (ex: `dentcarepro-production.up.railway.app`)

## Passo 8: Aceder ao Sistema

1. Abrir o URL no navegador
2. O sistema criará automaticamente um utilizador demo
3. Pronto! Sistema online e funcional

## 🔧 Comandos Úteis

### Ver Logs
```bash
railway logs
```

### Executar Comandos na Base de Dados
```bash
railway run psql $DATABASE_URL
```

### Fazer Redeploy Manual
```bash
railway up
```

## 📊 Monitorização

- **Logs:** Railway Dashboard → Deployments → View Logs
- **Métricas:** Railway Dashboard → Metrics
- **Base de Dados:** Railway Dashboard → PostgreSQL → Data

## ⚠️ Importante

- Railway oferece **$5 de crédito grátis** por mês
- Depois precisa de adicionar cartão de crédito
- Custo estimado: **$5-10/mês** para uso básico

## 🆘 Problemas Comuns

### Build falha
- Verificar logs de build
- Confirmar que `pnpm build` funciona localmente

### Erro de conexão à base de dados
- Verificar se DATABASE_URL está configurado
- Confirmar que PostgreSQL está a correr

### Página em branco
- Verificar logs da aplicação
- Confirmar que todas as variáveis de ambiente estão configuradas

## 📞 Suporte

- Documentação Railway: [docs.railway.app](https://docs.railway.app)
- Discord Railway: [discord.gg/railway](https://discord.gg/railway)

