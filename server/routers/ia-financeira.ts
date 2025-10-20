/**
 * Router tRPC para IA Financeira
 * DentCare PRO - Assistente Inteligente
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import * as iaFinanceira from "../services/ia-financeira";
import * as db from "../db";

export const iaFinanceiraRouter = router({
  /**
   * Assistente Financeiro - Chatbot conversacional
   */
  perguntarAssistente: publicProcedure
    .input(
      z.object({
        pergunta: z.string().min(1, "Pergunta é obrigatória"),
        periodo: z
          .object({
            inicio: z.string(),
            fim: z.string(),
          })
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Buscar dados financeiros do período
      const receitas: any[] = []; // TODO: buscar do banco
      const despesas = await db.listarContasPagar();
      
      const dadosFinanceiros = {
        receitas,
        despesas,
        contasPagar: despesas,
        contasReceber: [],
        comissoes: [],
        periodo: input.periodo,
      };

      const resposta = await iaFinanceira.assistenteFinanceiro(
        input.pergunta,
        dadosFinanceiros
      );

      return {
        pergunta: input.pergunta,
        resposta,
        timestamp: new Date().toISOString(),
      };
    }),

  /**
   * Gerar Insights Automáticos
   */
  gerarInsights: publicProcedure
    .input(
      z
        .object({
          periodo: z.object({
            inicio: z.string(),
            fim: z.string(),
          }),
        })
        .optional()
    )
    .query(async ({ input }) => {
      // Buscar dados financeiros
      const despesas = await db.listarContasPagar();
      const estatisticasDespesas: any = {}; // TODO: implementar estatísticas

      const dadosFinanceiros = {
        receitas: [],
        despesas,
        contasPagar: despesas,
        contasReceber: [],
        comissoes: [],
        periodo: input?.periodo,
      };

      const insights = await iaFinanceira.gerarInsightsFinanceiros(dadosFinanceiros);

      return {
        ...insights,
        estatisticas: estatisticasDespesas,
        geradoEm: new Date().toISOString(),
      };
    }),

  /**
   * Categorizar Despesa Automaticamente
   */
  categorizarDespesa: publicProcedure
    .input(
      z.object({
        descricao: z.string(),
        valor: z.number(),
        fornecedor: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Buscar histórico de categorizações (últimas 50)
      const despesas = await db.listarContasPagar();
      const historicoCategorizacoes = despesas.slice(0, 50).map((d) => ({
        descricao: d.descricao,
        categoria: d.categoriaId || "Outras Despesas",
        fornecedor: d.fornecedorId,
      }));

      const resultado = await iaFinanceira.categorizarDespesa(
        input.descricao,
        input.valor,
        input.fornecedor,
        historicoCategorizacoes
      );

      return resultado;
    }),

  /**
   * Analisar Tendências
   */
  analisarTendencias: publicProcedure
    .input(
      z.object({
        meses: z.number().min(3).max(24).default(6),
      })
    )
    .query(async ({ input }) => {
      // Buscar dados históricos dos últimos N meses
      const dadosHistoricos = [];
      const hoje = new Date();

      for (let i = input.meses - 1; i >= 0; i--) {
        const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
        const mesAno = data.toISOString().substring(0, 7);
        
        const despesas = await db.listarContasPagar();

        const totalDespesas = despesas.reduce(
          (sum, d) => sum + parseFloat((d as any).valor || 0),
          0
        );

        dadosHistoricos.push({
          periodo: mesAno,
          receitas: 0, // TODO: buscar receitas
          despesas: totalDespesas,
          lucro: 0 - totalDespesas,
        });
      }

      const analise = await iaFinanceira.analisarTendencias(dadosHistoricos);

      return {
        ...analise,
        dadosHistoricos,
        geradoEm: new Date().toISOString(),
      };
    }),

  /**
   * Sugerir Economias
   */
  sugerirEconomias: publicProcedure
    .input(
      z.object({
        periodo: z.object({
          inicio: z.string(),
          fim: z.string(),
        }),
      })
    )
    .query(async ({ input }) => {
      const despesas = await db.listarContasPagar();

      const sugestoes = await iaFinanceira.sugerirEconomias(
        despesas,
        input.periodo
      );

      return {
        ...sugestoes,
        periodo: input.periodo,
        geradoEm: new Date().toISOString(),
      };
    }),
});

