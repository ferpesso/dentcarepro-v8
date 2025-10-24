import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";

/**
 * Router de Ortodontia
 * Gestão de tratamentos ortodônticos
 */
export const ortodontiaRouter = router({
  /**
   * Listar tratamentos ortodônticos de um utente
   */
  listar: protectedProcedure
    .input(
      z.object({
        utenteId: z.string(),
        status: z.enum(["todos", "planejado", "ativo", "pausado", "concluido", "cancelado"]).optional(),
      })
    )
    .query(async ({ input }) => {
      const { listarTratamentosOrtodontia } = await import("../db");
      return await listarTratamentosOrtodontia(input);
    }),

  /**
   * Obter tratamento ortodôntico por ID
   */
  obter: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { obterTratamentoOrtodontia } = await import("../db");
      return await obterTratamentoOrtodontia(input.id);
    }),

  /**
   * Criar novo tratamento ortodôntico
   */
  criar: protectedProcedure
    .input(
      z.object({
        utenteId: z.string().min(1, "Utente é obrigatório"),
        diagnostico: z.string().min(1, "Diagnóstico é obrigatório"),
        classificacao: z.object({
          angle: z.enum(["classe_I", "classe_II_div1", "classe_II_div2", "classe_III"]),
          overjet: z.number().optional(), // Em mm
          overbite: z.number().optional(), // Em mm ou %
          linhaMedia: z.enum(["centrada", "desviada_direita", "desviada_esquerda"]).optional(),
        }),
        planoTratamento: z.string(),
        tipoAparelho: z.enum([
          "fixo_metalico",
          "fixo_estetico",
          "autoligado",
          "lingual",
          "alinhadores",
          "movel",
          "expansor",
          "outros"
        ]),
        marcaAparelho: z.string().optional(), // Ex: "Invisalign", "Damon", "3M"
        dataInstalacao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        duracaoEstimada: z.number().min(1).max(60), // Em meses
        dataPrevisaoConclusao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        extracoesNecessarias: z.array(
          z.object({
            dente: z.string(),
            realizada: z.boolean().default(false),
            data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
          })
        ).optional(),
        ativacoes: z.array(
          z.object({
            numero: z.number(),
            data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
            procedimentos: z.string(),
            proximaAtivacao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
            observacoes: z.string().optional(),
          })
        ).optional(),
        evolucaoFotografica: z.array(
          z.object({
            data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
            fotos: z.array(z.string()), // URLs ou IDs das imagens
            observacoes: z.string().optional(),
          })
        ).optional(),
        pagamento: z.object({
          valorTotal: z.number(),
          valorPago: z.number().default(0),
          formaPagamento: z.enum(["vista", "parcelado"]),
          numeroParcelas: z.number().optional(),
          valorParcela: z.number().optional(),
          diaVencimento: z.number().min(1).max(31).optional(),
        }).optional(),
        status: z.enum(["planejado", "ativo", "pausado", "concluido", "cancelado"]).default("planejado"),
        observacoes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { criarTratamentoOrtodontia } = await import("../db");
      return await criarTratamentoOrtodontia({
        ...input,
        criadoPor: ctx.user.id,
      });
    }),

  /**
   * Atualizar tratamento ortodôntico
   */
  atualizar: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        dados: z.object({
          diagnostico: z.string().optional(),
          planoTratamento: z.string().optional(),
          duracaoEstimada: z.number().optional(),
          dataPrevisaoConclusao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
          status: z.enum(["planejado", "ativo", "pausado", "concluido", "cancelado"]).optional(),
          observacoes: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const { atualizarTratamentoOrtodontia } = await import("../db");
      return await atualizarTratamentoOrtodontia(input);
    }),

  /**
   * Adicionar ativação/manutenção
   */
  adicionarAtivacao: protectedProcedure
    .input(
      z.object({
        tratamentoId: z.string(),
        ativacao: z.object({
          numero: z.number(),
          data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          procedimentos: z.string(),
          proximaAtivacao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
          observacoes: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const { adicionarAtivacaoOrtodontia } = await import("../db");
      return await adicionarAtivacaoOrtodontia(input);
    }),

  /**
   * Adicionar evolução fotográfica
   */
  adicionarEvolucaoFotografica: protectedProcedure
    .input(
      z.object({
        tratamentoId: z.string(),
        evolucao: z.object({
          data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          fotos: z.array(z.string()),
          observacoes: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const { adicionarEvolucaoFotograficaOrtodontia } = await import("../db");
      return await adicionarEvolucaoFotograficaOrtodontia(input);
    }),

  /**
   * Registrar pagamento
   */
  registrarPagamento: protectedProcedure
    .input(
      z.object({
        tratamentoId: z.string(),
        valor: z.number().min(0.01),
        data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        formaPagamento: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { registrarPagamentoOrtodontia } = await import("../db");
      return await registrarPagamentoOrtodontia(input);
    }),

  /**
   * Deletar tratamento ortodôntico
   */
  deletar: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { deletarTratamentoOrtodontia } = await import("../db");
      return await deletarTratamentoOrtodontia(input.id);
    }),

  /**
   * Obter estatísticas de ortodontia
   */
  estatisticas: protectedProcedure
    .input(
      z.object({
        dataInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        dataFim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      })
    )
    .query(async ({ input }) => {
      const { obterEstatisticasOrtodontia } = await import("../db");
      return await obterEstatisticasOrtodontia(input);
    }),
});

