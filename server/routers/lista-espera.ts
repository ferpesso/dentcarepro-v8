import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";

/**
 * Router de Lista de Espera
 * Gestão de pacientes aguardando vaga na agenda
 */
export const listaEsperaRouter = router({
  /**
   * Listar todos os pacientes na lista de espera
   */
  listar: protectedProcedure
    .input(
      z
        .object({
          status: z.enum(["pendente", "notificado", "agendado", "cancelado"]).optional(),
          prioridade: z.enum(["baixa", "media", "alta", "urgente"]).optional(),
          dentistaId: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const { listarListaEspera } = await import("../db");
      return await listarListaEspera(input);
    }),

  /**
   * Adicionar paciente à lista de espera
   */
  adicionar: protectedProcedure
    .input(
      z.object({
        utenteId: z.string().min(1, "Utente é obrigatório"),
        dentistaId: z.string().optional(),
        tipoConsulta: z.string().optional(),
        dataPreferida: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        periodoPreferido: z.enum(["manha", "tarde", "qualquer"]).default("qualquer"),
        prioridade: z.enum(["baixa", "media", "alta", "urgente"]).default("media"),
        observacoes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { adicionarListaEspera } = await import("../db");
      return await adicionarListaEspera({
        ...input,
        criadoPor: ctx.user.id,
      });
    }),

  /**
   * Marcar paciente como notificado
   */
  marcarNotificado: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        dataNotificacao: z.string().optional(),
        observacoes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { marcarNotificado } = await import("../db");
      return await marcarNotificado({
        ...input,
        notificadoPor: ctx.user.id,
      });
    }),

  /**
   * Marcar paciente como agendado (sai da lista)
   */
  marcarAgendado: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        consultaId: z.string(),
        dataAgendamento: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { marcarAgendado } = await import("../db");
      return await marcarAgendado({
        ...input,
        agendadoPor: ctx.user.id,
      });
    }),

  /**
   * Cancelar entrada na lista de espera
   */
  cancelar: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        motivoCancelamento: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { cancelarListaEspera } = await import("../db");
      return await cancelarListaEspera({
        ...input,
        canceladoPor: ctx.user.id,
      });
    }),

  /**
   * Atualizar prioridade
   */
  atualizarPrioridade: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        prioridade: z.enum(["baixa", "media", "alta", "urgente"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { atualizarPrioridadeListaEspera } = await import("../db");
      return await atualizarPrioridadeListaEspera({
        ...input,
        atualizadoPor: ctx.user.id,
      });
    }),

  /**
   * Obter estatísticas da lista de espera
   */
  estatisticas: protectedProcedure.query(async () => {
    const { obterEstatisticasListaEspera } = await import("../db");
    return await obterEstatisticasListaEspera();
  }),

  /**
   * Sugerir próximos pacientes para agendar
   */
  sugerirProximos: protectedProcedure
    .input(
      z.object({
        dentistaId: z.string().optional(),
        data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        periodo: z.enum(["manha", "tarde", "qualquer"]).optional(),
        limite: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ input }) => {
      const { sugerirProximosListaEspera } = await import("../db");
      return await sugerirProximosListaEspera(input);
    }),
});

