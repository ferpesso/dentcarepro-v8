import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
// import superjson from "superjson"; // ❌ REMOVIDO TEMPORARIAMENTE
import App from "./App";
// getLoginUrl removido - OAuth desativado
import "./index.css";

const queryClient = new QueryClient();

// OAuth removido - não redireciona para login
const redirectToLoginIfUnauthorized = (error: unknown) => {
  // Sistema usa autenticação simplificada, não precisa de redirect
  return;
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

// Configuração da URL da API
// Em desenvolvimento: usa proxy local (/api/trpc)
// Em produção: usa URL do Railway (variável de ambiente)
const apiUrl = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/trpc`
  : "/api/trpc";

console.log('[tRPC] Configuração da API:', {
  apiUrl,
  env: import.meta.env.MODE,
  VITE_API_URL: import.meta.env.VITE_API_URL
});

// Custom fetch com configuração específica para evitar ERR_HTTP2_PROTOCOL_ERROR
const customFetch: typeof fetch = (input, init) => {
  console.log('[tRPC] Custom fetch request:', input);
  
  // Garantir que headers estão definidos
  const headers = new Headers(init?.headers || {});
  
  // Forçar HTTP/1.1 e adicionar headers necessários
  headers.set('Accept', 'application/json');
  headers.set('Content-Type', 'application/json');
  
  // Fazer a requisição com configuração customizada
  return fetch(input, {
    ...init,
    headers,
    credentials: 'include',
    // Forçar keep-alive para evitar problemas de conexão
    keepalive: true,
  }).then(response => {
    console.log('[tRPC] Custom fetch response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    if (!response.ok) {
      console.error('[tRPC] Response not OK:', response);
    }
    
    return response;
  }).catch(error => {
    console.error('[tRPC] Custom fetch error:', error);
    throw error;
  });
};

const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: apiUrl,
      // transformer: superjson, // ❌ REMOVIDO TEMPORARIAMENTE
      fetch: customFetch,
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);

