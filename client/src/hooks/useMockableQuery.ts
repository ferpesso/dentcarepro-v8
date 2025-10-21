// @ts-nocheck
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { mockUtentesAPI, mockConsultasAPI } from "@/lib/mockData";

// Flag para forçar uso de mock (útil para desenvolvimento)
const FORCE_MOCK = false; // Backend PostgreSQL está rodando na Railway

/**
 * Hook para queries que fallback para mock data quando backend não está disponível
 */
export function useMockableQuery<TData>(
  queryKey: any[],
  queryFn: () => Promise<TData>,
  mockFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      if (FORCE_MOCK) {
        console.log('[useMockableQuery] Usando mock (FORCE_MOCK=true)');
        return mockFn();
      }
      
      try {
        console.log('[useMockableQuery] Chamando backend:', queryKey);
        const result = await queryFn();
        console.log('[useMockableQuery] Sucesso:', queryKey, result);
        return result;
      } catch (error: any) {
        console.error('[useMockableQuery] Erro ao chamar backend:', error);
        console.error('[useMockableQuery] Detalhes do erro:', {
          message: error?.message,
          name: error?.name,
          stack: error?.stack
        });
        
        // Se erro de rede ou parsing, usa mock
        if (error?.message?.includes('JSON') || 
            error?.message?.includes('fetch') ||
            error?.message?.includes('network') ||
            error?.message?.includes('Failed to fetch')) {
          console.warn('[useMockableQuery] Backend indisponível, usando dados mock');
          return mockFn();
        }
        throw error;
      }
    },
    ...options,
  });
}

/**
 * Hook para mutations que fallback para mock quando backend não está disponível
 */
export function useMockableMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  mockFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, Error, TVariables>
) {
  return useMutation({
    mutationFn: async (variables: TVariables) => {
      if (FORCE_MOCK) {
        console.log('[useMockableMutation] Usando mock (FORCE_MOCK=true)');
        return mockFn(variables);
      }
      
      try {
        console.log('[useMockableMutation] Chamando backend');
        const result = await mutationFn(variables);
        console.log('[useMockableMutation] Sucesso');
        return result;
      } catch (error: any) {
        console.error('[useMockableMutation] Erro:', error);
        
        if (error?.message?.includes('JSON') || 
            error?.message?.includes('fetch') ||
            error?.message?.includes('network') ||
            error?.message?.includes('Failed to fetch')) {
          console.warn('[useMockableMutation] Backend indisponível, usando operação mock');
          return mockFn(variables);
        }
        throw error;
      }
    },
    ...options,
  });
}

// Hooks específicos para Utentes
export function useUtentes() {
  return useMockableQuery(
    ['utentes'],
    () => {
      console.log('[useUtentes] Iniciando query');
      try {
        const result = trpc.utentes.listar.query();
        console.log('[useUtentes] Query criada');
        return result;
      } catch (error) {
        console.error('[useUtentes] Erro ao criar query:', error);
        throw error;
      }
    },
    () => mockUtentesAPI.listar()
  );
}

export function useUtente(id: string) {
  return useMockableQuery(
    ['utente', id],
    () => trpc.utentes.obter.query({ id }),
    () => mockUtentesAPI.obter(id)
  );
}

export function useUtentesStats() {
  return useMockableQuery(
    ['utentes-stats'],
    () => trpc.utentes.estatisticas.query(),
    () => mockUtentesAPI.estatisticas()
  );
}

export function useCriarUtente() {
  return useMockableMutation(
    (dados: any) => trpc.utentes.criar.mutate(dados),
    (dados: any) => mockUtentesAPI.criar(dados)
  );
}

export function useAtualizarUtente() {
  return useMockableMutation(
    ({ id, dados }: { id: string; dados: any }) => 
      trpc.utentes.atualizar.mutate({ id, dados }),
    ({ id, dados }: { id: string; dados: any }) => 
      mockUtentesAPI.atualizar(id, dados)
  );
}

export function useRemoverUtente() {
  return useMockableMutation(
    ({ id }: { id: string }) => trpc.utentes.remover.mutate({ id }),
    ({ id }: { id: string }) => mockUtentesAPI.remover(id)
  );
}

// Hooks específicos para Consultas
export function useConsultas() {
  return useMockableQuery(
    ['consultas'],
    () => trpc.consultas.listar.query(),
    () => mockConsultasAPI.listar()
  );
}

export function useConsultasPorPeriodo(dataInicio: string, dataFim: string) {
  return useMockableQuery(
    ['consultas', dataInicio, dataFim],
    () => trpc.consultas.listarPorPeriodo.query({ dataInicio, dataFim }),
    () => mockConsultasAPI.listarPorPeriodo(dataInicio, dataFim)
  );
}

export function useConsultasStats() {
  return useMockableQuery(
    ['consultas-stats'],
    () => trpc.consultas.estatisticas.query(),
    () => mockConsultasAPI.estatisticas()
  );
}

export function useCriarConsulta() {
  return useMockableMutation(
    (dados: any) => trpc.consultas.criar.mutate(dados),
    (dados: any) => mockConsultasAPI.criar(dados)
  );
}

export function useAtualizarConsulta() {
  return useMockableMutation(
    ({ id, dados }: { id: string; dados: any }) => 
      trpc.consultas.atualizar.mutate({ id, ...dados }),
    ({ id, dados }: { id: string; dados: any }) => 
      mockConsultasAPI.atualizar(id, dados)
  );
}

export function useRemoverConsulta() {
  return useMockableMutation(
    ({ id }: { id: string }) => trpc.consultas.remover.mutate({ id }),
    ({ id }: { id: string }) => mockConsultasAPI.remover(id)
  );
}

