import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";

/**
 * Schema de estado de dente
 */
const denteEstadoSchema = z.object({
  numeroDente: z.string().regex(/^[1-4][1-8]$/, "Número de dente inválido (use notação FDI)"),
  estado: z.enum([
    "saudavel",
    "carie",
    "restauracao",
    "coroa",
    "ponte",
    "implante",
    "extraido",
    "ausente",
    "tratamento_canal",
  ]),
  observacoes: z.string().optional(),
});

/**
 * Router de Odontograma
 * Gestão de estados dentários e histórico
 */
export const odontogramaRouter = router({
  /**
   * Obter odontograma atual de um utente
   */
  obter: protectedProcedure
    .input(z.object({ utenteId: z.string() }))
    .query(async ({ input }) => {
      const { obterOdontograma } = await import("../db");
      return await obterOdontograma(input.utenteId);
    }),

  /**
   * Obter histórico de alterações do odontograma
   */
  obterHistorico: protectedProcedure
    .input(z.object({ utenteId: z.string() }))
    .query(async ({ input }) => {
      const { obterHistoricoOdontograma } = await import("../db");
      return await obterHistoricoOdontograma(input.utenteId);
    }),

  /**
   * Salvar/atualizar odontograma completo
   */
  salvar: protectedProcedure
    .input(
      z.object({
        utenteId: z.string().min(1, "Utente é obrigatório"),
        dentes: z.array(denteEstadoSchema).min(1, "Adicione pelo menos um dente"),
        observacoesGerais: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { salvarOdontograma } = await import("../db");
      return await salvarOdontograma({
        ...input,
        atualizadoPor: ctx.user.id,
      });
    }),

  /**
   * Atualizar estado de um dente específico
   */
  atualizarDente: protectedProcedure
    .input(
      z.object({
        utenteId: z.string(),
        dente: denteEstadoSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { atualizarDenteOdontograma } = await import("../db");
      return await atualizarDenteOdontograma({
        utenteId: input.utenteId,
        dente: input.dente,
        atualizadoPor: ctx.user.id,
      });
    }),

  /**
   * Obter estatísticas do odontograma
   */
  estatisticas: protectedProcedure
    .input(z.object({ utenteId: z.string() }))
    .query(async ({ input }) => {
      const { obterEstatisticasOdontograma } = await import("../db");
      return await obterEstatisticasOdontograma(input.utenteId);
    }),
});

