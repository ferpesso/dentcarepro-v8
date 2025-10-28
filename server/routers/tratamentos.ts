import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";

/**
 * Router de Tratamentos
 * Gestão completa de tratamentos dentários
 */
export const tratamentosRouter = router({
  /**
   * Listar todos os tratamentos
   */
  listar: protectedProcedure.query(async () => {
    const { listarTratamentos } = await import("../db");
    return await listarTratamentos();
  }),

  /**
   * Listar tratamentos de um utente específico
   */
  listarPorUtente: protectedProcedure
    .input(z.object({ utenteId: z.string() }))
    .query(async ({ input }) => {
      const { listarTratamentosUtente } = await import("../db");
      return await listarTratamentosUtente(input.utenteId);
    }),

  /**
   * Listar tratamentos com paginação e filtros
   */
  listarPaginado: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(20),
        utenteId: z.string().optional(),
        status: z
          .enum(["planeado", "em_andamento", "concluido", "cancelado"])
          .optional(),
        dentistaId: z.string().optional(),
        dataInicio: z.string().optional(),
        dataFim: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { listarTratamentosPaginado } = await import("../db");
      return await listarTratamentosPaginado(input);
    }),

  /**
   * Obter tratamento por ID
   */
  obter: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { obterTratamento } = await import("../db");
      const tratamento = await obterTratamento(input.id);
      if (!tratamento) {
        throw new Error("Tratamento não encontrado");
      }
      return tratamento;
    }),

  /**
   * Criar novo tratamento
   */
  criar: protectedProcedure
    .input(
      z.object({
        utenteId: z.string().min(1, "Utente é obrigatório"),
        consultaId: z.string().optional().nullable(),
        dentistaId: z.string().optional(),
        data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida (use YYYY-MM-DD)"),
        dente: z.string().optional().nullable(),
        procedimento: z.string().min(1, "Procedimento é obrigatório"),
        descricao: z.string().optional().nullable(),
        valor: z.number().min(0, "Valor não pode ser negativo").default(0),
        valorPago: z.number().min(0, "Valor pago não pode ser negativo").default(0),
        status: z
          .enum(["planeado", "em_andamento", "concluido", "cancelado"])
          .default("planeado"),
        observacoes: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { criarTratamento } = await import("../db");
      if (!ctx.user) throw new Error('Usuário não autenticado');
      return await criarTratamento({
        ...input,
        criadoPor: ctx.user.id,
      });
    }),

  /**
   * Atualizar tratamento
   */
  atualizar: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        dados: z.object({
          consultaId: z.string().optional().nullable(),
          dentistaId: z.string().optional(),
          data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
          dente: z.string().optional().nullable(),
          procedimento: z.string().optional(),
          descricao: z.string().optional().nullable(),
          valor: z.number().min(0).optional(),
          valorPago: z.number().min(0).optional(),
          status: z
            .enum(["planeado", "em_andamento", "concluido", "cancelado"])
            .optional(),
          observacoes: z.string().optional().nullable(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { atualizarTratamento } = await import("../db");
      if (!ctx.user) throw new Error('Usuário não autenticado');
      const tratamento = await atualizarTratamento(input.id, {
        ...input.dados,
        atualizadoPor: ctx.user.id,
      });
      if (!tratamento) {
        throw new Error("Tratamento não encontrado");
      }
      return tratamento;
    }),

  /**
   * Deletar tratamento
   */
  deletar: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { deletarTratamento } = await import("../db");
      const success = await deletarTratamento(input.id);
      if (!success) {
        throw new Error("Erro ao deletar tratamento");
      }
      return { success };
    }),

  /**
   * Obter estatísticas de tratamentos
   */
  estatisticas: protectedProcedure
    .input(
      z.object({
        utenteId: z.string().optional(),
        dentistaId: z.string().optional(),
        dataInicio: z.string().optional(),
        dataFim: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { obterEstatisticasTratamentos } = await import("../db");
      return await obterEstatisticasTratamentos(input);
    }),

  /**
   * Exportar tratamentos para Excel
   */
  exportar: protectedProcedure
    .input(
      z.object({
        utenteId: z.string().optional(),
        status: z
          .enum(["planeado", "em_andamento", "concluido", "cancelado"])
          .optional(),
        dataInicio: z.string().optional(),
        dataFim: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { exportarTratamentos } = await import("../db");
      return await exportarTratamentos(input);
    }),
});

