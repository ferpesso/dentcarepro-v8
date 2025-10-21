/**
 * Hooks para gestão de Consultas
 * Usa tRPC Vanilla Client para chamadas diretas à API
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpcVanilla } from "@/lib/trpc-vanilla";

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Hook para listar todas as consultas
 */
export function useConsultas() {
  return useQuery({
    queryKey: ['consultas'],
    queryFn: () => trpcVanilla.consultas.listar.query(),
  });
}

/**
 * Hook para listar consultas por período
 */
export function useConsultasPorPeriodo(dataInicio: string, dataFim: string) {
  return useQuery({
    queryKey: ['consultas', dataInicio, dataFim],
    queryFn: () => trpcVanilla.consultas.listarPorPeriodo.query({ dataInicio, dataFim }),
    enabled: !!dataInicio && !!dataFim, // Só executa se tiver as datas
  });
}

/**
 * Hook para obter estatísticas das consultas
 */
export function useConsultasStats() {
  return useQuery({
    queryKey: ['consultas-stats'],
    queryFn: () => trpcVanilla.consultas.estatisticas.query(),
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Hook para criar uma nova consulta
 */
export function useCriarConsulta() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (dados: any) => trpcVanilla.consultas.criar.mutate(dados),
    onSuccess: () => {
      // Invalidar queries para recarregar dados
      queryClient.invalidateQueries({ queryKey: ['consultas'] });
      queryClient.invalidateQueries({ queryKey: ['consultas-stats'] });
    },
  });
}

/**
 * Hook para atualizar uma consulta existente
 */
export function useAtualizarConsulta() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, dados }: { id: string; dados: any }) => 
      trpcVanilla.consultas.atualizar.mutate({ id, ...dados }),
    onSuccess: () => {
      // Invalidar queries para recarregar dados
      queryClient.invalidateQueries({ queryKey: ['consultas'] });
      queryClient.invalidateQueries({ queryKey: ['consultas-stats'] });
    },
  });
}

/**
 * Hook para remover uma consulta
 */
export function useRemoverConsulta() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id }: { id: string }) => 
      trpcVanilla.consultas.remover.mutate({ id }),
    onSuccess: () => {
      // Invalidar queries para recarregar dados
      queryClient.invalidateQueries({ queryKey: ['consultas'] });
      queryClient.invalidateQueries({ queryKey: ['consultas-stats'] });
    },
  });
}

