import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";

/**
 * Router de Bloqueios de Agenda
 * Gestão de períodos bloqueados na agenda (almoço, reuniões, férias, etc)
 */
export const bloqueiosAgendaRouter = router({
  /**
   * Listar bloqueios num período
   */
  listar: protectedProcedure
    .input(
      z.object({
        dataInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida (use YYYY-MM-DD)"),
        dataFim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida (use YYYY-MM-DD)"),
        dentistaId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { listarBloqueios } = await import("../db");
      return await listarBloqueios(input.dataInicio, input.dataFim, input.dentistaId);
    }),

  /**
   * Criar novo bloqueio
   */
  criar: protectedProcedure
    .input(
      z.object({
        dentistaId: z.string().min(1, "Dentista é obrigatório"),
        dataHoraInicio: z.string().regex(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
          "Data/hora inválida (use YYYY-MM-DDTHH:MM)"
        ),
        dataHoraFim: z.string().regex(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
          "Data/hora inválida (use YYYY-MM-DDTHH:MM)"
        ),
        motivo: z.string().optional(),
        tipo: z.enum(["almoco", "reuniao", "folga", "ferias", "outro"]),
        observacoes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { criarBloqueio } = await import("../db");
      return await criarBloqueio({
        ...input,
        criadoPor: ctx.user.id,
      });
    }),

  /**
   * Atualizar bloqueio existente
   */
  atualizar: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        dataHoraInicio: z.string().optional(),
        dataHoraFim: z.string().optional(),
        motivo: z.string().optional(),
        tipo: z.enum(["almoco", "reuniao", "folga", "ferias", "outro"]).optional(),
        observacoes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { atualizarBloqueio } = await import("../db");
      return await atualizarBloqueio({
        ...input,
        atualizadoPor: ctx.user.id,
      });
    }),

  /**
   * Remover bloqueio
   */
  remover: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { removerBloqueio } = await import("../db");
      return await removerBloqueio(input.id);
    }),

  /**
   * Verificar conflitos de horário
   */
  verificarConflitos: protectedProcedure
    .input(
      z.object({
        dentistaId: z.string(),
        dataHoraInicio: z.string(),
        dataHoraFim: z.string(),
        excluirBloqueioId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { verificarConflitosAgenda } = await import("../db");
      return await verificarConflitosAgenda(input);
    }),
});

