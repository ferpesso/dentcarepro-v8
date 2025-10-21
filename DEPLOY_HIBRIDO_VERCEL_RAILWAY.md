# Deploy Híbrido: Vercel + Railway

**Data:** 21 de Outubro de 2025  
**Arquitetura:** Frontend na Vercel + Backend no Railway  
**Custo:** €5/mês

---

## Arquitetura Implementada

```
┌─────────────────────────────────────────────────────────┐
│                    UTILIZADOR                            │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│              VERCEL (Frontend)                           │
│  - React + Vite                                          │
│  - CDN Global                                            │
│  - HTTPS Automático                                      │
│  - Custo: €0/mês (Plano Hobby)                          │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ API Requests
                  │ (CORS configurado)
                  ▼
┌─────────────────────────────────────────────────────────┐
│              RAILWAY (Backend)                           │
│  - Node.js + Express                                     │
│  - tRPC API                                              │
│  - PostgreSQL                                            │
│  - Custo: €5/mês (Plano Hobby)                          │
└─────────────────────────────────────────────────────────┘
```

---

## Alterações Realizadas

### 1. Frontend (Vercel)

#### Ficheiro: `client/src/main.tsx`
**Alteração:** Configuração dinâmica da URL da API

```typescript
// Configuração da URL da API
// Em desenvolvimento: usa proxy local (/api/trpc)
// Em produção: usa URL do Railway (variável de ambiente)
const apiUrl = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/trpc`
  : "/api/trpc";

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: apiUrl,
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});
```

#### Ficheiro: `.env.production`
**Criado:** Variáveis de ambiente para produção

```bash
VITE_API_URL=https://web-production-1be3.up.railway.app
VITE_APP_ID=dentcarepro_v8
VITE_APP_TITLE="DentCare PRO"
VITE_APP_LOGO="https://placehold.co/40x40/3b82f6/ffffff?text=DC"
NODE_ENV=production
```

#### Ficheiro: `vercel.json`
**Criado:** Configuração de deploy na Vercel

```json
{
  "version": 2,
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": null,
  "installCommand": "pnpm install",
  "devCommand": "pnpm dev",
  "env": {
    "NODE_ENV": "production",
    "VITE_API_URL": "https://web-production-1be3.up.railway.app",
    "VITE_APP_ID": "dentcarepro_v8",
    "VITE_APP_TITLE": "DentCare PRO",
    "VITE_APP_LOGO": "https://placehold.co/40x40/3b82f6/ffffff?text=DC"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. Backend (Railway)

#### Ficheiro: `server/_core/index.ts`
**Alteração:** Adicionada configuração de CORS

```typescript
// CORS configuration for Vercel frontend
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://dentcarepro-v8.vercel.app',
    'https://dentcare-pro.vercel.app',
    'https://web-production-1be3.up.railway.app'
  ];
  
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-trpc-source');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
});
```

---

## Passos para Deploy

### Passo 1: Commit e Push das Alterações

```bash
cd /home/ubuntu/dentcarepro-v8

# Adicionar alterações
git add .

# Commit
git commit -m "feat: Configuração para deploy híbrido Vercel + Railway"

# Push para GitHub
git push origin main
```

### Passo 2: Deploy do Backend no Railway

O backend já está deployado no Railway. As alterações de CORS serão aplicadas automaticamente quando fizermos push.

**URL do Backend:** https://web-production-1be3.up.railway.app

### Passo 3: Deploy do Frontend na Vercel

Será feito via MCP Vercel tool, conectando ao repositório GitHub.

---

## Variáveis de Ambiente

### Vercel (Frontend)
Configuradas no `vercel.json`:
- `VITE_API_URL`: URL do backend Railway
- `VITE_APP_ID`: ID da aplicação
- `VITE_APP_TITLE`: Título da aplicação
- `VITE_APP_LOGO`: URL do logotipo
- `NODE_ENV`: production

### Railway (Backend)
Já configuradas no painel Railway:
- `DATABASE_URL`: URL do PostgreSQL
- `NODE_ENV`: production
- `PORT`: 3000
- `JWT_SECRET`: dentcarepro-jwt-secret-2025-secure-key

---

## URLs de Acesso

### Desenvolvimento Local
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000
- **API:** http://localhost:3000/api/trpc

### Produção
- **Frontend (Vercel):** https://dentcarepro-v8.vercel.app (após deploy)
- **Backend (Railway):** https://web-production-1be3.up.railway.app
- **API (Railway):** https://web-production-1be3.up.railway.app/api/trpc

---

## Testes Necessários

### Após Deploy na Vercel

1. **Teste de Conectividade**
   - Aceder ao frontend na Vercel
   - Verificar se carrega sem erros
   - Abrir console do navegador (F12)

2. **Teste de API**
   - Navegar para "Utentes"
   - Verificar se lista carrega
   - Verificar no Network tab se requests vão para Railway

3. **Teste de CORS**
   - Verificar se não há erros de CORS no console
   - Confirmar que headers estão corretos

4. **Teste de Funcionalidades**
   - Criar novo utente
   - Editar utente
   - Pesquisar utentes
   - Navegar entre páginas

---

## Troubleshooting

### Erro de CORS

**Sintoma:** `Access-Control-Allow-Origin` error no console

**Solução:**
1. Verificar se a URL da Vercel está na lista `allowedOrigins` no backend
2. Fazer push das alterações para Railway
3. Aguardar redeploy automático

### API não responde

**Sintoma:** Requests timeout ou erro 404

**Solução:**
1. Verificar se `VITE_API_URL` está correto no vercel.json
2. Testar API diretamente: https://web-production-1be3.up.railway.app/api/trpc
3. Verificar logs no Railway

### Frontend não carrega

**Sintoma:** Página em branco

**Solução:**
1. Verificar logs de build na Vercel
2. Confirmar que `dist` foi gerado corretamente
3. Fazer hard refresh (Ctrl+Shift+R)

---

## Custos Mensais

| Serviço | Plano | Custo |
|---------|-------|-------|
| Vercel (Frontend) | Hobby | €0/mês |
| Railway (Backend + BD) | Hobby | €5/mês |
| **TOTAL** | - | **€5/mês** |

---

## Próximos Passos

### Fase 1: Deploy Inicial (Atual)
- ✅ Configurar CORS no backend
- ✅ Configurar URL dinâmica no frontend
- ✅ Criar vercel.json
- ⏳ Fazer deploy na Vercel
- ⏳ Testar integração

### Fase 2: Sincronização Local
- ⏳ Implementar IndexedDB
- ⏳ Service Worker para PWA
- ⏳ Sincronização offline/online
- ⏳ Testes de sincronização

### Fase 3: Otimizações
- ⏳ Cache de dados
- ⏳ Lazy loading de componentes
- ⏳ Otimização de imagens
- ⏳ Performance monitoring

---

## Vantagens desta Arquitetura

✅ **Custo baixo:** Apenas €5/mês  
✅ **Performance:** Frontend global via CDN Vercel  
✅ **Escalabilidade:** Fácil de escalar ambos os serviços  
✅ **Manutenção:** Cada serviço independente  
✅ **Desenvolvimento:** Ambiente local idêntico à produção  
✅ **Segurança:** CORS configurado, HTTPS em ambos  

---

**Preparado por:** Manus AI Assistant  
**Data:** 21 de Outubro de 2025  
**Versão:** 1.0

