import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";

/**
 * Schema de medição periodontal de um dente
 */
const medicaoPeriodontaSchema = z.object({
  numeroDente: z.string().regex(/^[1-4][1-8]$/, "Número de dente inválido (use notação FDI)"),
  // Profundidade de sondagem (6 pontos por dente)
  profundidadeSondagem: z.object({
    mesioVestibular: z.number().min(0).max(20),
    vestibular: z.number().min(0).max(20),
    distoVestibular: z.number().min(0).max(20),
    mesioLingual: z.number().min(0).max(20),
    lingual: z.number().min(0).max(20),
    distoLingual: z.number().min(0).max(20),
  }),
  // Nível de inserção clínica (6 pontos)
  nivelInsercao: z.object({
    mesioVestibular: z.number().min(0).max(20),
    vestibular: z.number().min(0).max(20),
    distoVestibular: z.number().min(0).max(20),
    mesioLingual: z.number().min(0).max(20),
    lingual: z.number().min(0).max(20),
    distoLingual: z.number().min(0).max(20),
  }),
  // Sangramento à sondagem
  sangramento: z.object({
    mesioVestibular: z.boolean(),
    vestibular: z.boolean(),
    distoVestibular: z.boolean(),
    mesioLingual: z.boolean(),
    lingual: z.boolean(),
    distoLingual: z.boolean(),
  }),
  // Mobilidade dentária (0-3)
  mobilidade: z.number().min(0).max(3).default(0),
  // Furca (0-3)
  furca: z.number().min(0).max(3).default(0),
  observacoes: z.string().optional(),
});

/**
 * Router de Periodontograma
 * Gestão de medições periodontais e evolução
 */
export const periodontogramaRouter = router({
  /**
   * Obter periodontograma atual de um utente
   */
  obter: protectedProcedure
    .input(z.object({ utenteId: z.string() }))
    .query(async ({ input }) => {
      const { obterPeriodontograma } = await import("../db");
      return await obterPeriodontograma(input.utenteId);
    }),

  /**
   * Obter histórico de periodontogramas (evolução)
   */
  obterHistorico: protectedProcedure
    .input(z.object({ utenteId: z.string() }))
    .query(async ({ input }) => {
      const { obterHistoricoPeriodontograma } = await import("../db");
      return await obterHistoricoPeriodontograma(input.utenteId);
    }),

  /**
   * Salvar novo periodontograma completo
   */
  salvar: protectedProcedure
    .input(
      z.object({
        utenteId: z.string().min(1, "Utente é obrigatório"),
        data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida (use YYYY-MM-DD)"),
        medicoes: z.array(medicaoPeriodontaSchema).min(1, "Adicione pelo menos uma medição"),
        observacoesGerais: z.string().optional(),
        diagnostico: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { salvarPeriodontograma } = await import("../db");
      return await salvarPeriodontograma({
        ...input,
        criadoPor: ctx.user.id,
      });
    }),

  /**
   * Atualizar medição de um dente específico
   */
  atualizarDente: protectedProcedure
    .input(
      z.object({
        periodontogramaId: z.string(),
        medicao: medicaoPeriodontaSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { atualizarDentePeriodontograma } = await import("../db");
      return await atualizarDentePeriodontograma({
        periodontogramaId: input.periodontogramaId,
        medicao: input.medicao,
        atualizadoPor: ctx.user.id,
      });
    }),

  /**
   * Obter estatísticas e análise periodontal
   */
  estatisticas: protectedProcedure
    .input(z.object({ utenteId: z.string() }))
    .query(async ({ input }) => {
      const { obterEstatisticasPeriodontograma } = await import("../db");
      return await obterEstatisticasPeriodontograma(input.utenteId);
    }),

  /**
   * Comparar dois periodontogramas (evolução)
   */
  comparar: protectedProcedure
    .input(
      z.object({
        periodontogramaId1: z.string(),
        periodontogramaId2: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { compararPeriodontogramas } = await import("../db");
      return await compararPeriodontogramas(
        input.periodontogramaId1,
        input.periodontogramaId2
      );
    }),
});

