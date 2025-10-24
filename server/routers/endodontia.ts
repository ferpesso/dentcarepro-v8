import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";

/**
 * Router de Endodontia
 * Gestão de tratamentos endodônticos (canal)
 */
export const endodontiaRouter = router({
  /**
   * Listar tratamentos endodônticos de um utente
   */
  listar: protectedProcedure
    .input(
      z.object({
        utenteId: z.string(),
        status: z.enum(["todos", "planejado", "em_andamento", "concluido", "cancelado"]).optional(),
      })
    )
    .query(async ({ input }) => {
      const { listarTratamentosEndodonticos } = await import("../db");
      return await listarTratamentosEndodonticos(input);
    }),

  /**
   * Obter tratamento endodôntico por ID
   */
  obter: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { obterTratamentoEndodontico } = await import("../db");
      return await obterTratamentoEndodontico(input.id);
    }),

  /**
   * Criar novo tratamento endodôntico
   */
  criar: protectedProcedure
    .input(
      z.object({
        utenteId: z.string().min(1, "Utente é obrigatório"),
        dente: z.string().min(1, "Dente é obrigatório"), // Ex: "11", "21"
        diagnostico: z.string().min(1, "Diagnóstico é obrigatório"),
        sintomas: z.array(z.string()).optional(),
        testesVitalidade: z.object({
          frio: z.enum(["positivo", "negativo", "nao_realizado"]).optional(),
          calor: z.enum(["positivo", "negativo", "nao_realizado"]).optional(),
          percussao: z.enum(["positivo", "negativo", "nao_realizado"]).optional(),
          palpacao: z.enum(["positivo", "negativo", "nao_realizado"]).optional(),
        }).optional(),
        numeroCanais: z.number().min(1).max(6),
        comprimentoTrabalho: z.array(
          z.object({
            canal: z.string(), // Ex: "MV", "DV", "P"
            comprimento: z.number(), // Em mm
          })
        ),
        instrumentacao: z.object({
          tecnica: z.enum(["manual", "rotatoria", "reciprocante", "hibrida"]),
          instrumentos: z.array(z.string()), // Ex: ["K-file #15", "ProTaper F1"]
          irrigacao: z.array(z.string()), // Ex: ["NaOCl 2.5%", "EDTA 17%"]
        }).optional(),
        medicacaoIntracanal: z.string().optional(),
        obturacao: z.object({
          tecnica: z.enum(["condensacao_lateral", "condensacao_vertical", "onda_continua", "sistema_carrier"]).optional(),
          cimento: z.string().optional(), // Ex: "AH Plus", "Sealer 26"
          data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        }).optional(),
        sessoes: z.array(
          z.object({
            numero: z.number(),
            data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
            procedimentos: z.string(),
            observacoes: z.string().optional(),
          })
        ).optional(),
        status: z.enum(["planejado", "em_andamento", "concluido", "cancelado"]).default("planejado"),
        observacoes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { criarTratamentoEndodontico } = await import("../db");
      return await criarTratamentoEndodontico({
        ...input,
        criadoPor: ctx.user.id,
      });
    }),

  /**
   * Atualizar tratamento endodôntico
   */
  atualizar: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        dados: z.object({
          diagnostico: z.string().optional(),
          sintomas: z.array(z.string()).optional(),
          numeroCanais: z.number().optional(),
          comprimentoTrabalho: z.array(
            z.object({
              canal: z.string(),
              comprimento: z.number(),
            })
          ).optional(),
          instrumentacao: z.object({
            tecnica: z.enum(["manual", "rotatoria", "reciprocante", "hibrida"]),
            instrumentos: z.array(z.string()),
            irrigacao: z.array(z.string()),
          }).optional(),
          medicacaoIntracanal: z.string().optional(),
          obturacao: z.object({
            tecnica: z.enum(["condensacao_lateral", "condensacao_vertical", "onda_continua", "sistema_carrier"]).optional(),
            cimento: z.string().optional(),
            data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
          }).optional(),
          status: z.enum(["planejado", "em_andamento", "concluido", "cancelado"]).optional(),
          observacoes: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const { atualizarTratamentoEndodontico } = await import("../db");
      return await atualizarTratamentoEndodontico(input);
    }),

  /**
   * Adicionar sessão ao tratamento
   */
  adicionarSessao: protectedProcedure
    .input(
      z.object({
        tratamentoId: z.string(),
        sessao: z.object({
          numero: z.number(),
          data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          procedimentos: z.string(),
          observacoes: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const { adicionarSessaoEndodontia } = await import("../db");
      return await adicionarSessaoEndodontia(input);
    }),

  /**
   * Deletar tratamento endodôntico
   */
  deletar: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { deletarTratamentoEndodontico } = await import("../db");
      return await deletarTratamentoEndodontico(input.id);
    }),

  /**
   * Obter estatísticas de endodontia
   */
  estatisticas: protectedProcedure
    .input(
      z.object({
        dataInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        dataFim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      })
    )
    .query(async ({ input }) => {
      const { obterEstatisticasEndodontia } = await import("../db");
      return await obterEstatisticasEndodontia(input);
    }),
});

