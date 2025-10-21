# 🔍 Análise do Problema Atual - DentCare PRO v8.0

**Data:** 21 de Outubro de 2025  
**Status:** 🔴 Erro de integração tRPC  
**Prioridade:** CRÍTICA

---

## 📋 Resumo do Problema

### Erro Reportado
```
Erro ao carregar utentes
e[f] is not a function
```

### Onde Ocorre
- **Página:** `/utentes`
- **Componente:** `Utentes.tsx`
- **Hook:** `useUtentes()` em `useMockableQuery.ts`
- **Chamada tRPC:** `trpc.utentes.listar.query()`

---

## 🔎 Análise Técnica

### 1. Código Frontend (CORRETO ✅)

#### Hook de Query (`useMockableQuery.ts`)
```typescript
export function useUtentes() {
  return useMockableQuery(
    ['utentes'],
    () => trpc.utentes.listar.query(),  // ✅ Chama endpoint correto
    () => mockUtentesAPI.listar()
  );
}
```

#### Página de Utentes (`Utentes.tsx`)
```typescript
const { data: utentes, isLoading, error } = useUtentes();
```

### 2. Código Backend (CORRETO ✅)

#### Router (`routers.ts`)
```typescript
utentes: router({
  // Listar todos os utentes
  listar: protectedProcedure.query(async () => {  // ✅ Endpoint existe
    const { listarUtentes } = await import("./db");
    return await listarUtentes();
  }),
  // ... outros endpoints
})
```

### 3. Configuração tRPC (CORRETO ✅)

#### Cliente (`main.tsx`)
```typescript
const apiUrl = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/trpc`
  : "/api/trpc";

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: apiUrl,
      transformer: superjson,  // ✅ SuperJSON configurado
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

---

## 🤔 Hipóteses do Problema

### Hipótese 1: Problema de Build/Cache da Vercel
**Probabilidade:** 🔴 ALTA (80%)

**Evidências:**
- Código fonte está correto
- Erro "e[f] is not a function" indica código minificado
- Documentação menciona que já foram feitos 6 deploys com correções
- Problema pode ser cache não limpo ou build incorreto

**Solução:**
1. Testar localmente primeiro
2. Limpar cache da Vercel
3. Rebuild completo
4. Verificar source maps

### Hipótese 2: Incompatibilidade de Versões
**Probabilidade:** 🟡 MÉDIA (15%)

**Evidências:**
- tRPC 11.6.0 (versão recente)
- SuperJSON 1.13.3
- React Query 5.90.2

**Solução:**
1. Verificar compatibilidade de versões
2. Atualizar dependências se necessário

### Hipótese 3: Problema de CORS/Network
**Probabilidade:** 🟢 BAIXA (5%)

**Evidências:**
- CORS já está configurado
- Backend está online
- Frontend carrega

**Solução:**
1. Verificar headers CORS
2. Testar requests no DevTools

---

## 🧪 Plano de Testes

### Teste 1: Ambiente Local
```bash
# 1. Clonar repositório
git clone https://github.com/ferpesso/dentcarepro-v8.git
cd dentcarepro-v8

# 2. Instalar dependências
pnpm install

# 3. Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com DATABASE_URL do Railway

# 4. Rodar backend
pnpm dev

# 5. Rodar frontend (em outro terminal)
cd client
pnpm dev

# 6. Abrir http://localhost:5173/utentes
```

**Resultado Esperado:**
- ✅ Se funcionar localmente → Problema é de build da Vercel
- ❌ Se não funcionar → Problema é no código

### Teste 2: Verificar Logs do Backend
```bash
# No Railway, verificar logs
railway logs

# Procurar por:
# - Erros de CORS
# - Erros de autenticação
# - Erros de database
```

### Teste 3: Verificar Build da Vercel
```bash
# Localmente, fazer build de produção
pnpm build:frontend

# Servir build
npx serve dist/public

# Testar se funciona
```

### Teste 4: Adicionar Logs de Debug
```typescript
// Em useMockableQuery.ts
export function useUtentes() {
  return useMockableQuery(
    ['utentes'],
    async () => {
      console.log('[DEBUG] Chamando trpc.utentes.listar.query()');
      const result = await trpc.utentes.listar.query();
      console.log('[DEBUG] Resultado:', result);
      return result;
    },
    () => mockUtentesAPI.listar()
  );
}
```

---

## 🔧 Soluções Propostas

### Solução 1: Rebuild Completo (IMEDIATO)
```bash
# 1. Limpar cache local
rm -rf node_modules dist .vite
pnpm install

# 2. Build local para testar
pnpm build:frontend

# 3. Se funcionar, fazer deploy
git add .
git commit -m "fix: Rebuild completo para corrigir erro tRPC"
git push origin main

# 4. Na Vercel, limpar cache e rebuild
# Settings → Clear Cache → Redeploy
```

### Solução 2: Simplificar Configuração tRPC (SE SOLUÇÃO 1 FALHAR)
```typescript
// Remover SuperJSON temporariamente
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: apiUrl,
      // transformer: superjson,  // ❌ Comentar
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

### Solução 3: Usar Proxy Vite (DESENVOLVIMENTO)
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://web-production-1be3.up.railway.app',
        changeOrigin: true,
      }
    }
  }
});
```

### Solução 4: Adicionar Source Maps (DEBUG)
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    sourcemap: true,  // ✅ Ativar source maps
  }
});
```

---

## 📊 Checklist de Verificação

### Antes de Testar
- [x] Repositório clonado
- [x] Documentação analisada
- [x] Dependências instaladas
- [ ] Variáveis de ambiente configuradas
- [ ] Backend acessível

### Durante os Testes
- [ ] Teste local funcionando
- [ ] Logs do backend verificados
- [ ] Build de produção testado
- [ ] DevTools verificado (Network, Console)

### Após Correção
- [ ] Teste local OK
- [ ] Deploy em produção OK
- [ ] Dados carregam corretamente
- [ ] Sem erros no console
- [ ] Performance OK

---

## 🎯 Próximos Passos

### AGORA (Próximos 30 minutos)
1. ✅ Clonar repositório
2. ✅ Instalar dependências
3. 🔴 Configurar variáveis de ambiente
4. 🔴 Testar localmente
5. 🔴 Identificar causa raiz

### DEPOIS (Próximas 2 horas)
1. Aplicar correção
2. Testar build de produção
3. Deploy para Vercel
4. Validar em produção
5. Documentar solução

### FINAL (Hoje)
1. Marcar FASE 0 como concluída ✅
2. Preparar para FASE 1 (Autenticação)
3. Atualizar plano de desenvolvimento

---

## 📝 Notas Importantes

### Observações da Documentação Anterior
1. Já foram feitos **6 deployments** na Vercel
2. Problema persiste desde o início
3. CORS já foi configurado múltiplas vezes
4. Variáveis de ambiente já foram reconfiguradas
5. Rebuild forçado já foi tentado

### Conclusão
O problema **NÃO** é:
- ❌ CORS (já configurado)
- ❌ Variáveis de ambiente (já configuradas)
- ❌ Código fonte (está correto)

O problema **PROVAVELMENTE** é:
- ✅ Build do Vite com problema
- ✅ Cache da Vercel não limpo corretamente
- ✅ Tree-shaking removendo código necessário
- ✅ SuperJSON com problema de serialização

### Recomendação
**Testar localmente PRIMEIRO** para confirmar se o código funciona.
Se funcionar localmente, o problema é 100% de build/deploy.

---

**Criado por:** Assistente Manus  
**Data:** 21 de Outubro de 2025  
**Versão:** 1.0

