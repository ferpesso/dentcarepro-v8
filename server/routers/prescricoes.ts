import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";

/**
 * Schema de medicamento na prescrição
 */
const medicamentoSchema = z.object({
  medicamento: z.string().min(1, "Nome do medicamento é obrigatório"),
  posologia: z.string().min(1, "Posologia é obrigatória"),
  duracao: z.string().min(1, "Duração é obrigatória"),
  quantidade: z.string().optional(),
});

/**
 * Router de Prescrições
 * Gestão de prescrições médicas digitais
 */
export const prescricoesRouter = router({
  /**
   * Listar prescrições de um utente
   */
  listar: protectedProcedure
    .input(z.object({ utenteId: z.string() }))
    .query(async ({ input }) => {
      const { listarPrescricoes } = await import("../db");
      return await listarPrescricoes(input.utenteId);
    }),

  /**
   * Listar todas as prescrições com paginação
   */
  listarPaginado: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(20),
        utenteId: z.string().optional(),
        dataInicio: z.string().optional(),
        dataFim: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { listarPrescricoesPaginado } = await import("../db");
      return await listarPrescricoesPaginado(input);
    }),

  /**
   * Obter prescrição por ID
   */
  obter: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { obterPrescricao } = await import("../db");
      const prescricao = await obterPrescricao(input.id);
      if (!prescricao) {
        throw new Error("Prescrição não encontrada");
      }
      return prescricao;
    }),

  /**
   * Criar nova prescrição
   */
  criar: protectedProcedure
    .input(
      z.object({
        utenteId: z.string().min(1, "Utente é obrigatório"),
        data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida (use YYYY-MM-DD)"),
        medicamentos: z.array(medicamentoSchema).min(1, "Adicione pelo menos um medicamento"),
        observacoes: z.string().optional().nullable(),
        diagnostico: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { criarPrescricao } = await import("../db");
      return await criarPrescricao({
        ...input,
        criadoPor: ctx.user.id,
      });
    }),

  /**
   * Atualizar prescrição
   */
  atualizar: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        dados: z.object({
          data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
          medicamentos: z.array(medicamentoSchema).optional(),
          observacoes: z.string().optional().nullable(),
          diagnostico: z.string().optional().nullable(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { atualizarPrescricao } = await import("../db");
      const prescricao = await atualizarPrescricao(input.id, {
        ...input.dados,
        atualizadoPor: ctx.user.id,
      });
      if (!prescricao) {
        throw new Error("Prescrição não encontrada");
      }
      return prescricao;
    }),

  /**
   * Eliminar prescrição
   */
  eliminar: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { eliminarPrescricao } = await import("../db");
      const sucesso = await eliminarPrescricao(input.id);
      if (!sucesso) {
        throw new Error("Erro ao eliminar prescrição");
      }
      return { success: true };
    }),

  /**
   * Gerar PDF da prescrição
   */
  gerarPdf: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { gerarPdfPrescricao } = await import("../db");
      return await gerarPdfPrescricao(input.id);
    }),
});

/**
 * Router de Medicamentos
 * Base de dados de medicamentos para prescrições
 */
export const medicamentosRouter = router({
  /**
   * Buscar medicamentos por nome
   */
  buscar: protectedProcedure
    .input(z.object({ termo: z.string().min(2, "Digite pelo menos 2 caracteres") }))
    .query(async ({ input }) => {
      const { buscarMedicamentos } = await import("../db");
      return await buscarMedicamentos(input.termo);
    }),

  /**
   * Listar medicamentos mais usados
   */
  maisUsados: protectedProcedure
    .input(z.object({ limite: z.number().min(1).max(50).default(10) }))
    .query(async ({ input }) => {
      const { listarMedicamentosMaisUsados } = await import("../db");
      return await listarMedicamentosMaisUsados(input.limite);
    }),

  /**
   * Obter informações de um medicamento
   */
  obter: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { obterMedicamento } = await import("../db");
      return await obterMedicamento(input.id);
    }),
});

