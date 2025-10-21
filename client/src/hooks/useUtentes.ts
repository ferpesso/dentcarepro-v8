/**
 * Hooks para gestão de Utentes
 * Usa tRPC Vanilla Client para chamadas diretas à API
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpcVanilla } from "@/lib/trpc-vanilla";

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Hook para listar todos os utentes
 */
export function useUtentes() {
  return useQuery({
    queryKey: ['utentes'],
    queryFn: () => trpcVanilla.utentes.listar.query(),
  });
}

/**
 * Hook para obter um utente específico por ID
 */
export function useUtente(id: string) {
  return useQuery({
    queryKey: ['utente', id],
    queryFn: () => trpcVanilla.utentes.obter.query({ id }),
    enabled: !!id, // Só executa se tiver ID
  });
}

/**
 * Hook para obter estatísticas dos utentes
 */
export function useUtentesStats() {
  return useQuery({
    queryKey: ['utentes-stats'],
    queryFn: () => trpcVanilla.utentes.estatisticas.query(),
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Hook para criar um novo utente
 */
export function useCriarUtente() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (dados: any) => trpcVanilla.utentes.criar.mutate(dados),
    onSuccess: () => {
      // Invalidar queries para recarregar dados
      queryClient.invalidateQueries({ queryKey: ['utentes'] });
      queryClient.invalidateQueries({ queryKey: ['utentes-stats'] });
    },
  });
}

/**
 * Hook para atualizar um utente existente
 */
export function useAtualizarUtente() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, dados }: { id: string; dados: any }) => 
      trpcVanilla.utentes.atualizar.mutate({ id, dados }),
    onSuccess: (_, variables) => {
      // Invalidar queries para recarregar dados
      queryClient.invalidateQueries({ queryKey: ['utentes'] });
      queryClient.invalidateQueries({ queryKey: ['utente', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['utentes-stats'] });
    },
  });
}

/**
 * Hook para remover um utente
 */
export function useRemoverUtente() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id }: { id: string }) => 
      trpcVanilla.utentes.remover.mutate({ id }),
    onSuccess: () => {
      // Invalidar queries para recarregar dados
      queryClient.invalidateQueries({ queryKey: ['utentes'] });
      queryClient.invalidateQueries({ queryKey: ['utentes-stats'] });
    },
  });
}

