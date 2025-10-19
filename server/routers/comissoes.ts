// @ts-nocheck
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const comissoesRouter = router({
  // Listar comissões de um dentista
  listar: protectedProcedure
    .input(
      z.object({
        dentistaId: z.string(),
        mes: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      return await db.listarComissoesDentista(input.dentistaId, input.mes);
    }),

  // Obter resumo de comissões
  resumo: protectedProcedure
    .input(z.object({ dentistaId: z.string() }))
    .query(async ({ input }) => {
      const comissoes = await db.listarComissoesDentista(input.dentistaId);
      
      const resumo = {
        totalPendente: 0,
        totalPago: 0,
        totalCancelado: 0,
        quantidadePendente: 0,
        quantidadePago: 0,
        quantidadeCancelado: 0,
      };

      comissoes.forEach((c: any) => {
        if (c.status === "pendente") {
          resumo.totalPendente += parseFloat(c.valor || 0);
          resumo.quantidadePendente++;
        } else if (c.status === "pago") {
          resumo.totalPago += parseFloat(c.valor || 0);
          resumo.quantidadePago++;
        } else if (c.status === "cancelado") {
          resumo.totalCancelado += parseFloat(c.valor || 0);
          resumo.quantidadeCancelado++;
        }
      });

      return resumo;
    }),

  // Criar comissão
  criar: protectedProcedure
    .input(
      z.object({
        dentistaId: z.string(),
        faturaId: z.string(),
        valor: z.number(),
        percentagem: z.number().optional(),
        mes: z.string(),
        observacoes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await db.criarComissao(input);
    }),

  // Marcar comissão como paga
  pagar: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        formaPagamento: z.string(),
        referencia: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await db.pagarComissao(input.id, input.formaPagamento, input.referencia);
    }),

  // Obter configuração de comissão do dentista
  obterConfig: protectedProcedure
    .input(z.object({ dentistaId: z.string() }))
    .query(async ({ input }) => {
      return await db.obterConfigComissao(input.dentistaId);
    }),

  // Salvar configuração de comissão
  salvarConfig: protectedProcedure
    .input(
      z.object({
        dentistaId: z.string(),
        tipo: z.enum(["percentagem", "fixo", "misto"]),
        percentagem: z.number().optional(),
        valorFixo: z.number().optional(),
        valorMinimo: z.number().optional(),
        valorMaximo: z.number().optional(),
        observacoes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await db.salvarConfigComissao(input);
    }),
});

