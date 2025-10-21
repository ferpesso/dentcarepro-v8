import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../server/routers';
import superjson from 'superjson';

// Configuração da URL da API
// Em desenvolvimento: usa proxy local (/api/trpc)
// Em produção: usa URL do Railway (variável de ambiente)
const apiUrl = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/trpc`
  : "/api/trpc";

/**
 * Cliente tRPC Vanilla (não-React) para uso em funções assíncronas
 * 
 * Este cliente é usado dentro do hook useMockableQuery para fazer
 * chamadas à API de forma programática, com fallback para dados mock.
 * 
 * Para uso em componentes React, use o cliente React do @/lib/trpc
 */
export const trpcVanilla = createTRPCProxyClient<AppRouter>({
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

