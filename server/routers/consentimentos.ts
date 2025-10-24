import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";

/**
 * Router de Consentimentos Informados
 * Gestão de termos de consentimento e assinaturas digitais
 */
export const consentimentosRouter = router({
  /**
   * Listar templates de consentimento
   */
  listarTemplates: protectedProcedure.query(async () => {
    const { listarTemplatesConsentimento } = await import("../db");
    return await listarTemplatesConsentimento();
  }),

  /**
   * Criar template de consentimento
   */
  criarTemplate: protectedProcedure
    .input(
      z.object({
        titulo: z.string().min(1, "Título é obrigatório"),
        categoria: z.enum([
          "tratamento_geral",
          "cirurgia",
          "implante",
          "ortodontia",
          "endodontia",
          "estetica",
          "anestesia",
          "radiografia",
          "outros"
        ]),
        conteudo: z.string().min(1, "Conteúdo é obrigatório"),
        ativo: z.boolean().default(true),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { criarTemplateConsentimento } = await import("../db");
      return await criarTemplateConsentimento({
        ...input,
        criadoPor: ctx.user.id,
      });
    }),

  /**
   * Atualizar template
   */
  atualizarTemplate: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        dados: z.object({
          titulo: z.string().optional(),
          conteudo: z.string().optional(),
          ativo: z.boolean().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const { atualizarTemplateConsentimento } = await import("../db");
      return await atualizarTemplateConsentimento(input);
    }),

  /**
   * Listar consentimentos de um utente
   */
  listar: protectedProcedure
    .input(
      z.object({
        utenteId: z.string(),
        status: z.enum(["todos", "pendente", "assinado", "recusado"]).optional(),
      })
    )
    .query(async ({ input }) => {
      const { listarConsentimentos } = await import("../db");
      return await listarConsentimentos(input);
    }),

  /**
   * Obter consentimento por ID
   */
  obter: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { obterConsentimento } = await import("../db");
      return await obterConsentimento(input.id);
    }),

  /**
   * Gerar consentimento para utente
   */
  gerar: protectedProcedure
    .input(
      z.object({
        utenteId: z.string().min(1, "Utente é obrigatório"),
        templateId: z.string().min(1, "Template é obrigatório"),
        procedimento: z.string().optional(),
        observacoes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { gerarConsentimento } = await import("../db");
      return await gerarConsentimento({
        ...input,
        geradoPor: ctx.user.id,
      });
    }),

  /**
   * Assinar consentimento
   */
  assinar: protectedProcedure
    .input(
      z.object({
        consentimentoId: z.string(),
        assinatura: z.string(), // Base64 da assinatura digital
        ip: z.string().optional(),
        localizacao: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { assinarConsentimento } = await import("../db");
      return await assinarConsentimento(input);
    }),

  /**
   * Recusar consentimento
   */
  recusar: protectedProcedure
    .input(
      z.object({
        consentimentoId: z.string(),
        motivo: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { recusarConsentimento } = await import("../db");
      return await recusarConsentimento(input);
    }),

  /**
   * Deletar consentimento
   */
  deletar: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { deletarConsentimento } = await import("../db");
      return await deletarConsentimento(input.id);
    }),

  /**
   * Obter estatísticas de consentimentos
   */
  estatisticas: protectedProcedure.query(async () => {
    const { obterEstatisticasConsentimentos } = await import("../db");
    return await obterEstatisticasConsentimentos();
  }),
});

