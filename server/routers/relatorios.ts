import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";

/**
 * Router de Relatórios
 * Geração de relatórios gerenciais e clínicos
 */
export const relatoriosRouter = router({
  /**
   * Relatório de consultas
   */
  consultas: protectedProcedure
    .input(
      z.object({
        dataInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        dataFim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        dentistaId: z.string().optional(),
        status: z.enum(["todas", "realizadas", "canceladas", "faltou"]).optional(),
      })
    )
    .query(async ({ input }) => {
      const { gerarRelatorioConsultas } = await import("../db");
      return await gerarRelatorioConsultas(input);
    }),

  /**
   * Relatório financeiro
   */
  financeiro: protectedProcedure
    .input(
      z.object({
        dataInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        dataFim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        tipo: z.enum(["resumo", "detalhado", "por_dentista", "por_tratamento"]).optional(),
      })
    )
    .query(async ({ input }) => {
      const { gerarRelatorioFinanceiro } = await import("../db");
      return await gerarRelatorioFinanceiro(input);
    }),

  /**
   * Relatório de tratamentos
   */
  tratamentos: protectedProcedure
    .input(
      z.object({
        dataInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        dataFim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        dentistaId: z.string().optional(),
        status: z.enum(["todos", "planeado", "em_curso", "concluido", "cancelado"]).optional(),
      })
    )
    .query(async ({ input }) => {
      const { gerarRelatorioTratamentos } = await import("../db");
      return await gerarRelatorioTratamentos(input);
    }),

  /**
   * Relatório de pacientes
   */
  pacientes: protectedProcedure
    .input(
      z.object({
        tipo: z.enum(["novos", "ativos", "inativos", "aniversariantes"]),
        dataInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        dataFim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        mes: z.number().min(1).max(12).optional(), // Para aniversariantes
      })
    )
    .query(async ({ input }) => {
      const { gerarRelatorioPacientes } = await import("../db");
      return await gerarRelatorioPacientes(input);
    }),

  /**
   * Relatório de produtividade
   */
  produtividade: protectedProcedure
    .input(
      z.object({
        dataInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        dataFim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        dentistaId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { gerarRelatorioProdutividade } = await import("../db");
      return await gerarRelatorioProdutividade(input);
    }),

  /**
   * Dashboard executivo (KPIs principais)
   */
  dashboard: protectedProcedure
    .input(
      z.object({
        periodo: z.enum(["hoje", "semana", "mes", "trimestre", "ano"]).default("mes"),
        dataReferencia: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      })
    )
    .query(async ({ input }) => {
      const { gerarDashboardExecutivo } = await import("../db");
      return await gerarDashboardExecutivo(input);
    }),

  /**
   * Exportar relatório (PDF/Excel)
   */
  exportar: protectedProcedure
    .input(
      z.object({
        tipo: z.enum(["consultas", "financeiro", "tratamentos", "pacientes", "produtividade"]),
        formato: z.enum(["pdf", "excel"]),
        parametros: z.record(z.string(), z.any()),
      })
    )
    .mutation(async ({ input }) => {
      const { exportarRelatorio } = await import("../db");
      return await exportarRelatorio(input);
    }),
});

