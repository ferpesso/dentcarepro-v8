import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";

/**
 * Router de Implantes
 * Gestão de implantes dentários
 */
export const implantesRouter = router({
  /**
   * Listar implantes de um utente
   */
  listar: protectedProcedure
    .input(
      z.object({
        utenteId: z.string(),
        status: z.enum(["todos", "planejado", "colocado", "osseointegrado", "protese_instalada", "complicacao"]).optional(),
      })
    )
    .query(async ({ input }) => {
      const { listarImplantes } = await import("../db");
      return await listarImplantes(input);
    }),

  /**
   * Obter implante por ID
   */
  obter: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { obterImplante } = await import("../db");
      return await obterImplante(input.id);
    }),

  /**
   * Criar novo implante
   */
  criar: protectedProcedure
    .input(
      z.object({
        utenteId: z.string().min(1, "Utente é obrigatório"),
        dente: z.string().min(1, "Posição do dente é obrigatória"), // Ex: "11", "21"
        marca: z.string().min(1, "Marca é obrigatória"), // Ex: "Straumann", "Nobel Biocare"
        modelo: z.string().min(1, "Modelo é obrigatório"), // Ex: "BLT", "Active"
        diametro: z.number().min(2).max(7), // Em mm
        comprimento: z.number().min(6).max(18), // Em mm
        lote: z.string().optional(),
        numeroSerie: z.string().optional(),
        dataColocacao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        cirurgiao: z.string(),
        tipoCircurgia: z.enum(["convencional", "carga_imediata", "guiada"]),
        enxerto: z.object({
          realizado: z.boolean(),
          tipo: z.enum(["autologo", "xenoenxerto", "aloenxerto", "sintetico"]).optional(),
          material: z.string().optional(),
        }).optional(),
        torqueInsercao: z.number().optional(), // Em Ncm
        estabilidadePrimaria: z.enum(["excelente", "boa", "regular", "ruim"]).optional(),
        medicacao: z.object({
          antibiotico: z.string().optional(),
          analgesico: z.string().optional(),
          antiinflamatorio: z.string().optional(),
        }).optional(),
        acompanhamento: z.array(
          z.object({
            data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
            avaliacao: z.string(),
            observacoes: z.string().optional(),
          })
        ).optional(),
        protese: z.object({
          tipo: z.enum(["unitaria", "multipla", "protocolo", "overdenture"]).optional(),
          dataInstalacao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
          material: z.string().optional(), // Ex: "Zircônia", "Metalocerâmica"
        }).optional(),
        garantia: z.object({
          fabricante: z.boolean().default(false),
          dataInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
          dataFim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
          observacoes: z.string().optional(),
        }).optional(),
        status: z.enum(["planejado", "colocado", "osseointegrado", "protese_instalada", "complicacao"]).default("planejado"),
        complicacoes: z.array(
          z.object({
            data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
            tipo: z.enum(["infeccao", "mobilidade", "perda", "fratura", "periimplantite", "outros"]),
            descricao: z.string(),
            tratamento: z.string().optional(),
          })
        ).optional(),
        observacoes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { criarImplante } = await import("../db");
      return await criarImplante({
        ...input,
        criadoPor: ctx.user.id,
      });
    }),

  /**
   * Atualizar implante
   */
  atualizar: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        dados: z.object({
          torqueInsercao: z.number().optional(),
          estabilidadePrimaria: z.enum(["excelente", "boa", "regular", "ruim"]).optional(),
          protese: z.object({
            tipo: z.enum(["unitaria", "multipla", "protocolo", "overdenture"]).optional(),
            dataInstalacao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
            material: z.string().optional(),
          }).optional(),
          status: z.enum(["planejado", "colocado", "osseointegrado", "protese_instalada", "complicacao"]).optional(),
          observacoes: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const { atualizarImplante } = await import("../db");
      return await atualizarImplante(input);
    }),

  /**
   * Adicionar acompanhamento
   */
  adicionarAcompanhamento: protectedProcedure
    .input(
      z.object({
        implanteId: z.string(),
        acompanhamento: z.object({
          data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          avaliacao: z.string(),
          observacoes: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const { adicionarAcompanhamentoImplante } = await import("../db");
      return await adicionarAcompanhamentoImplante(input);
    }),

  /**
   * Registrar complicação
   */
  registrarComplicacao: protectedProcedure
    .input(
      z.object({
        implanteId: z.string(),
        complicacao: z.object({
          data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          tipo: z.enum(["infeccao", "mobilidade", "perda", "fratura", "periimplantite", "outros"]),
          descricao: z.string(),
          tratamento: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const { registrarComplicacaoImplante } = await import("../db");
      return await registrarComplicacaoImplante(input);
    }),

  /**
   * Deletar implante
   */
  deletar: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { deletarImplante } = await import("../db");
      return await deletarImplante(input.id);
    }),

  /**
   * Obter estatísticas de implantes
   */
  estatisticas: protectedProcedure
    .input(
      z.object({
        dataInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        dataFim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      })
    )
    .query(async ({ input }) => {
      const { obterEstatisticasImplantes } = await import("../db");
      return await obterEstatisticasImplantes(input);
    }),
});

