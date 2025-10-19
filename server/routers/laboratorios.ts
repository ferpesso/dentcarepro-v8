/**
 * Router tRPC para Gestão de Laboratórios
 * DentCare PRO - Módulo Financeiro
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const laboratoriosRouter = router({
  // ========================================
  // CADASTRO DE LABORATÓRIOS
  // ========================================

  /**
   * Listar laboratórios
   */
  listar: publicProcedure
    .input(
      z
        .object({
          status: z.enum(["ativo", "inativo"]).optional(),
          pesquisa: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      return await db.listarLaboratorios(input);
    }),

  /**
   * Obter laboratório por ID
   */
  obter: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const laboratorio = await db.obterLaboratorio(input.id);
      if (!laboratorio) {
        throw new Error("Laboratório não encontrado");
      }
      return laboratorio;
    }),

  /**
   * Criar novo laboratório
   */
  criar: publicProcedure
    .input(
      z.object({
        nome: z.string().min(1, "Nome é obrigatório"),
        razaoSocial: z.string().optional(),
        nif: z.string().optional(),
        telefone: z.string().optional(),
        telemovel: z.string().min(1, "Telemóvel/WhatsApp é obrigatório"),
        email: z.string().email().optional(),
        website: z.string().url().optional().or(z.literal("")),
        morada: z.string().optional(),
        cidade: z.string().optional(),
        codigoPostal: z.string().optional(),
        pais: z.string().default("Portugal"),
        responsavelTecnico: z.string().optional(),
        especialidades: z.string().optional(), // JSON array
        prazoMedioEntrega: z.number().default(7),
        formasPagamentoAceitas: z.string().optional(), // JSON array
        condicoesPagamento: z.string().optional(),
        status: z.enum(["ativo", "inativo"]).default("ativo"),
        avaliacaoQualidade: z.number().min(1).max(5).default(5),
        observacoes: z.string().optional(),
        criadoPor: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await db.criarLaboratorio(input);
    }),

  /**
   * Atualizar laboratório
   */
  atualizar: publicProcedure
    .input(
      z.object({
        id: z.string(),
        nome: z.string().optional(),
        razaoSocial: z.string().optional(),
        nif: z.string().optional(),
        telefone: z.string().optional(),
        telemovel: z.string().optional(),
        email: z.string().email().optional(),
        website: z.string().url().optional().or(z.literal("")),
        morada: z.string().optional(),
        cidade: z.string().optional(),
        codigoPostal: z.string().optional(),
        pais: z.string().optional(),
        responsavelTecnico: z.string().optional(),
        especialidades: z.string().optional(),
        prazoMedioEntrega: z.number().optional(),
        formasPagamentoAceitas: z.string().optional(),
        condicoesPagamento: z.string().optional(),
        status: z.enum(["ativo", "inativo"]).optional(),
        avaliacaoQualidade: z.number().min(1).max(5).optional(),
        observacoes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await db.atualizarLaboratorio(id, data);
    }),

  /**
   * Excluir laboratório (soft delete)
   */
  excluir: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.excluirLaboratorio(input.id);
      return { success: true };
    }),

  // ========================================
  // TRABALHOS DE LABORATÓRIO
  // ========================================

  /**
   * Listar trabalhos de laboratório
   */
  listarTrabalhos: publicProcedure
    .input(
      z
        .object({
          laboratorioId: z.string().optional(),
          utenteId: z.string().optional(),
          dentistaId: z.string().optional(),
          status: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      return await db.listarTrabalhosLaboratorio(input);
    }),

  /**
   * Obter trabalho por ID
   */
  obterTrabalho: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const trabalho = await db.obterTrabalhoLaboratorio(input.id);
      if (!trabalho) {
        throw new Error("Trabalho não encontrado");
      }
      return trabalho;
    }),

  /**
   * Criar novo trabalho de laboratório
   */
  criarTrabalho: publicProcedure
    .input(
      z.object({
        laboratorioId: z.string(),
        utenteId: z.string(),
        dentistaId: z.string(),
        consultaId: z.string().optional(),
        tipoTrabalho: z.string().min(1, "Tipo de trabalho é obrigatório"),
        descricao: z.string().min(1, "Descrição é obrigatória"),
        dentes: z.string().optional(),
        cor: z.string().optional(),
        material: z.string().optional(),
        dataEnvio: z.string().optional(),
        dataPrevisaoEntrega: z.string().optional(),
        dataEntregaReal: z.string().optional(),
        dataInstalacao: z.string().optional(),
        custoLaboratorio: z.number().min(0, "Custo deve ser maior que zero"),
        valorCobradoUtente: z.number().optional(),
        status: z
          .enum([
            "orcamento",
            "enviado",
            "em_producao",
            "recebido",
            "instalado",
            "ajuste_necessario",
            "cancelado",
          ])
          .default("orcamento"),
        observacoes: z.string().optional(),
        observacoesInternas: z.string().optional(),
        criadoPor: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await db.criarTrabalhoLaboratorio(input);
    }),

  /**
   * Atualizar trabalho de laboratório
   */
  atualizarTrabalho: publicProcedure
    .input(
      z.object({
        id: z.string(),
        laboratorioId: z.string().optional(),
        tipoTrabalho: z.string().optional(),
        descricao: z.string().optional(),
        dentes: z.string().optional(),
        cor: z.string().optional(),
        material: z.string().optional(),
        dataEnvio: z.string().optional(),
        dataPrevisaoEntrega: z.string().optional(),
        dataEntregaReal: z.string().optional(),
        dataInstalacao: z.string().optional(),
        custoLaboratorio: z.number().optional(),
        valorCobradoUtente: z.number().optional(),
        status: z
          .enum([
            "orcamento",
            "enviado",
            "em_producao",
            "recebido",
            "instalado",
            "ajuste_necessario",
            "cancelado",
          ])
          .optional(),
        avaliacaoQualidade: z.number().min(1).max(5).optional(),
        necessitouAjuste: z.boolean().optional(),
        observacoes: z.string().optional(),
        observacoesInternas: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await db.atualizarTrabalhoLaboratorio(id, data);
    }),

  /**
   * Excluir trabalho de laboratório
   */
  excluirTrabalho: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.excluirTrabalhoLaboratorio(input.id);
      return { success: true };
    }),

  /**
   * Estatísticas de laboratório
   */
  estatisticas: publicProcedure
    .input(z.object({ laboratorioId: z.string() }))
    .query(async ({ input }) => {
      const trabalhos = await db.listarTrabalhosLaboratorio({
        laboratorioId: input.laboratorioId,
      });

      const totalTrabalhos = trabalhos.length;
      const trabalhosEmAndamento = trabalhos.filter(
        (t) => t.status === "enviado" || t.status === "em_producao"
      ).length;
      const trabalhosFinalizados = trabalhos.filter(
        (t) => t.status === "instalado"
      ).length;
      const trabalhosCancelados = trabalhos.filter(
        (t) => t.status === "cancelado"
      ).length;

      const custoTotal = trabalhos.reduce(
        (acc, t) => acc + (Number(t.custoLaboratorio) || 0),
        0
      );
      const receitaTotal = trabalhos.reduce(
        (acc, t) => acc + (Number(t.valorCobradoUtente) || 0),
        0
      );
      const margemTotal = receitaTotal - custoTotal;

      const avaliacaoMedia =
        trabalhos
          .filter((t) => t.avaliacaoQualidade)
          .reduce((acc, t) => acc + (t.avaliacaoQualidade || 0), 0) /
        trabalhos.filter((t) => t.avaliacaoQualidade).length;

      const necessitaramAjuste = trabalhos.filter(
        (t) => t.necessitouAjuste
      ).length;

      return {
        totalTrabalhos,
        trabalhosEmAndamento,
        trabalhosFinalizados,
        trabalhosCancelados,
        custoTotal,
        receitaTotal,
        margemTotal,
        avaliacaoMedia: isNaN(avaliacaoMedia) ? 0 : avaliacaoMedia,
        percentualAjustes:
          totalTrabalhos > 0 ? (necessitaramAjuste / totalTrabalhos) * 100 : 0,
      };
    }),
});

