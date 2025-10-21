import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
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

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: apiUrl,
      transformer: superjson,
      fetch(input, init) {
        console.log('[tRPC] Fetch request:', input);
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        }).then(response => {
          console.log('[tRPC] Fetch response:', response.status, response.statusText);
          return response;
        }).catch(error => {
          console.error('[tRPC] Fetch error:', error);
          throw error;
        });
      },
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

