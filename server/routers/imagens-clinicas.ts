import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";

/**
 * Router de Imagens Clínicas
 * Gestão de imagens radiográficas e fotográficas com análise por IA
 */
export const imagensClinicasRouter = router({
  /**
   * Listar imagens de um utente
   */
  listar: protectedProcedure
    .input(
      z.object({
        utenteId: z.string(),
        tipo: z.enum(["todas", "raio-x", "foto-intraoral", "foto-facial", "tomografia", "outros"]).optional(),
        dataInicio: z.string().optional(),
        dataFim: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { listarImagensClinicas } = await import("../db");
      return await listarImagensClinicas(input);
    }),

  /**
   * Obter imagem por ID
   */
  obter: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { obterImagemClinica } = await import("../db");
      return await obterImagemClinica(input.id);
    }),

  /**
   * Upload de nova imagem
   */
  upload: protectedProcedure
    .input(
      z.object({
        utenteId: z.string().min(1, "Utente é obrigatório"),
        tipo: z.enum(["raio-x", "foto-intraoral", "foto-facial", "tomografia", "outros"]),
        titulo: z.string().min(1, "Título é obrigatório"),
        descricao: z.string().optional(),
        dente: z.string().optional(), // Ex: "11", "21", etc
        regiao: z.string().optional(), // Ex: "superior", "inferior", "anterior"
        arquivo: z.string().min(1, "Arquivo é obrigatório"), // Base64 ou URL
        dataExame: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        analisarComIA: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { uploadImagemClinica } = await import("../db");
      return await uploadImagemClinica({
        ...input,
        uploadPor: ctx.user.id,
      });
    }),

  /**
   * Atualizar metadados da imagem
   */
  atualizar: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        titulo: z.string().optional(),
        descricao: z.string().optional(),
        dente: z.string().optional(),
        regiao: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { atualizarImagemClinica } = await import("../db");
      return await atualizarImagemClinica(input);
    }),

  /**
   * Deletar imagem
   */
  deletar: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { deletarImagemClinica } = await import("../db");
      return await deletarImagemClinica(input.id);
    }),

  /**
   * Adicionar anotação na imagem
   */
  adicionarAnotacao: protectedProcedure
    .input(
      z.object({
        imagemId: z.string(),
        tipo: z.enum(["texto", "seta", "circulo", "retangulo", "marcador"]),
        conteudo: z.string(),
        posicao: z.object({
          x: z.number(),
          y: z.number(),
          largura: z.number().optional(),
          altura: z.number().optional(),
        }),
        cor: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { adicionarAnotacaoImagem } = await import("../db");
      return await adicionarAnotacaoImagem({
        ...input,
        criadoPor: ctx.user.id,
      });
    }),

  /**
   * Analisar imagem com IA
   */
  analisarComIA: protectedProcedure
    .input(
      z.object({
        imagemId: z.string(),
        tipoAnalise: z.enum(["deteccao-caries", "deteccao-fraturas", "analise-geral", "comparacao"]),
        imagemComparacaoId: z.string().optional(), // Para comparação
      })
    )
    .mutation(async ({ input }) => {
      const { analisarImagemComIA } = await import("../db");
      return await analisarImagemComIA(input);
    }),

  /**
   * Obter análises de IA de uma imagem
   */
  obterAnalisesIA: protectedProcedure
    .input(z.object({ imagemId: z.string() }))
    .query(async ({ input }) => {
      const { obterAnalisesIAImagem } = await import("../db");
      return await obterAnalisesIAImagem(input.imagemId);
    }),

  /**
   * Comparar duas imagens
   */
  comparar: protectedProcedure
    .input(
      z.object({
        imagemId1: z.string(),
        imagemId2: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { compararImagens } = await import("../db");
      return await compararImagens(input.imagemId1, input.imagemId2);
    }),

  /**
   * Obter estatísticas de imagens
   */
  estatisticas: protectedProcedure
    .input(z.object({ utenteId: z.string() }))
    .query(async ({ input }) => {
      const { obterEstatisticasImagens } = await import("../db");
      return await obterEstatisticasImagens(input.utenteId);
    }),
});

