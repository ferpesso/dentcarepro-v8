/**
 * Router tRPC para Contas a Pagar
 * DentCare PRO - Módulo Financeiro
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const contasPagarRouter = router({
  /**
   * Listar contas a pagar
   */
  listar: publicProcedure
    .input(
      z
        .object({
          status: z.string().optional(),
          categoriaId: z.string().optional(),
          fornecedorId: z.string().optional(),
          dataInicio: z.string().optional(),
          dataFim: z.string().optional(),
          vencimentoInicio: z.string().optional(),
          vencimentoFim: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      return await db.listarContasPagar(input);
    }),

  /**
   * Obter conta por ID
   */
  obter: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const conta = await db.obterContaPagar(input.id);
      if (!conta) {
        throw new Error("Conta não encontrada");
      }
      return conta;
    }),

  /**
   * Criar nova conta a pagar
   */
  criar: publicProcedure
    .input(
      z.object({
        categoriaId: z.string().min(1, "Categoria é obrigatória"),
        fornecedorId: z.string().optional(),
        laboratorioId: z.string().optional(),
        dentistaId: z.string().optional(),
        descricao: z.string().min(1, "Descrição é obrigatória"),
        numeroDocumento: z.string().optional(),
        dataEmissao: z.string().min(1, "Data de emissão é obrigatória"),
        dataVencimento: z.string().min(1, "Data de vencimento é obrigatória"),
        valorTotal: z.number().min(0.01, "Valor deve ser maior que zero"),
        valorPago: z.number().default(0),
        formaPagamento: z.string().optional(),
        observacoes: z.string().optional(),
        anexos: z.string().optional(), // JSON array
        recorrente: z.boolean().default(false),
        frequenciaRecorrencia: z.string().optional(),
        status: z
          .enum(["pendente", "pago_parcial", "pago", "vencido", "cancelado"])
          .default("pendente"),
        criadoPor: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await db.criarContaPagar({
        ...input,
        valorTotal: input.valorTotal.toString(),
        valorPago: input.valorPago.toString(),
      });
    }),

  /**
   * Atualizar conta a pagar
   */
  atualizar: publicProcedure
    .input(
      z.object({
        id: z.string(),
        categoriaId: z.string().optional(),
        fornecedorId: z.string().optional(),
        laboratorioId: z.string().optional(),
        dentistaId: z.string().optional(),
        descricao: z.string().optional(),
        numeroDocumento: z.string().optional(),
        dataEmissao: z.string().optional(),
        dataVencimento: z.string().optional(),
        valorTotal: z.number().optional(),
        valorPago: z.number().optional(),
        formaPagamento: z.string().optional(),
        observacoes: z.string().optional(),
        anexos: z.string().optional(),
        recorrente: z.boolean().optional(),
        frequenciaRecorrencia: z.string().optional(),
        status: z
          .enum(["pendente", "pago_parcial", "pago", "vencido", "cancelado"])
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      
      const updateData: any = { ...data };
      if (data.valorTotal !== undefined) {
        updateData.valorTotal = data.valorTotal.toString();
      }
      if (data.valorPago !== undefined) {
        updateData.valorPago = data.valorPago.toString();
      }

      return await db.atualizarContaPagar(id, updateData);
    }),

  /**
   * Excluir conta a pagar
   */
  excluir: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.excluirContaPagar(input.id);
      return { success: true };
    }),

  /**
   * Registrar pagamento
   */
  registrarPagamento: publicProcedure
    .input(
      z.object({
        contaPagarId: z.string(),
        dataPagamento: z.string(),
        valorPago: z.number().min(0.01, "Valor deve ser maior que zero"),
        formaPagamento: z.string().min(1, "Forma de pagamento é obrigatória"),
        observacoes: z.string().optional(),
        comprovante: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await db.registrarPagamentoConta({
        ...input,
        valorPago: input.valorPago.toString(),
      });
    }),

  /**
   * Listar pagamentos de uma conta
   */
  listarPagamentos: publicProcedure
    .input(z.object({ contaPagarId: z.string() }))
    .query(async ({ input }) => {
      return await db.listarPagamentosConta(input.contaPagarId);
    }),

  /**
   * Obter estatísticas
   */
  estatisticas: publicProcedure
    .input(
      z
        .object({
          dataInicio: z.string().optional(),
          dataFim: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      return await db.obterEstatisticasContasPagar(input);
    }),

  /**
   * Marcar como pago
   */
  marcarComoPago: publicProcedure
    .input(
      z.object({
        id: z.string(),
        dataPagamento: z.string(),
        formaPagamento: z.string(),
        observacoes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const conta = await db.obterContaPagar(input.id);
      if (!conta) {
        throw new Error("Conta não encontrada");
      }

      // Registrar pagamento do saldo restante
      const valorTotal = Number(conta.valorTotal);
      const valorPago = Number(conta.valorPago || 0);
      const saldo = valorTotal - valorPago;

      if (saldo > 0) {
        await db.registrarPagamentoConta({
          contaPagarId: input.id,
          dataPagamento: input.dataPagamento,
          valorPago: saldo.toString(),
          formaPagamento: input.formaPagamento,
          observacoes: input.observacoes,
        });
      }

      return { success: true };
    }),
});

