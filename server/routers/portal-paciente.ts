import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";

/**
 * Router do Portal do Paciente
 * Sistema de autoatendimento para pacientes
 */
export const portalPacienteRouter = router({
  /**
   * Obter dashboard do paciente (resumo geral)
   */
  dashboard: protectedProcedure
    .input(z.object({ utenteId: z.string() }))
    .query(async ({ input }) => {
      const { obterDashboardPaciente } = await import("../db");
      return await obterDashboardPaciente(input.utenteId);
    }),

  /**
   * Listar consultas do paciente
   */
  consultas: router({
    listar: protectedProcedure
      .input(
        z.object({
          utenteId: z.string(),
          status: z.enum(["todas", "agendadas", "realizadas", "canceladas"]).optional(),
          dataInicio: z.string().optional(),
          dataFim: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const { listarConsultasPaciente } = await import("../db");
        return await listarConsultasPaciente(input);
      }),

    cancelar: protectedProcedure
      .input(
        z.object({
          consultaId: z.string(),
          motivoCancelamento: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { cancelarConsultaPaciente } = await import("../db");
        return await cancelarConsultaPaciente({
          ...input,
          canceladoPor: ctx.user.id,
        });
      }),
  }),

  /**
   * Listar faturas do paciente
   */
  faturas: router({
    listar: protectedProcedure
      .input(
        z.object({
          utenteId: z.string(),
          status: z.enum(["todas", "pendentes", "pagas", "vencidas"]).optional(),
        })
      )
      .query(async ({ input }) => {
        const { listarFaturasPaciente } = await import("../db");
        return await listarFaturasPaciente(input);
      }),

    obter: protectedProcedure
      .input(z.object({ faturaId: z.string() }))
      .query(async ({ input }) => {
        const { obterFaturaPaciente } = await import("../db");
        return await obterFaturaPaciente(input.faturaId);
      }),
  }),

  /**
   * Sistema de mensagens
   */
  mensagens: router({
    listar: protectedProcedure
      .input(
        z.object({
          utenteId: z.string(),
          lidas: z.boolean().optional(),
        })
      )
      .query(async ({ input }) => {
        const { listarMensagensPaciente } = await import("../db");
        return await listarMensagensPaciente(input);
      }),

    enviar: protectedProcedure
      .input(
        z.object({
          utenteId: z.string(),
          assunto: z.string().min(1, "Assunto é obrigatório"),
          mensagem: z.string().min(1, "Mensagem é obrigatória"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { enviarMensagemPaciente } = await import("../db");
        return await enviarMensagemPaciente({
          ...input,
          remetenteId: ctx.user.id,
        });
      }),

    marcarLida: protectedProcedure
      .input(z.object({ mensagemId: z.string() }))
      .mutation(async ({ input }) => {
        const { marcarMensagemLida } = await import("../db");
        return await marcarMensagemLida(input.mensagemId);
      }),
  }),

  /**
   * Documentos clínicos
   */
  documentos: router({
    listar: protectedProcedure
      .input(
        z.object({
          utenteId: z.string(),
          tipo: z.enum(["todos", "prescricoes", "exames", "relatorios", "outros"]).optional(),
        })
      )
      .query(async ({ input }) => {
        const { listarDocumentosPaciente } = await import("../db");
        return await listarDocumentosPaciente(input);
      }),

    obter: protectedProcedure
      .input(z.object({ documentoId: z.string() }))
      .query(async ({ input }) => {
        const { obterDocumentoPaciente } = await import("../db");
        return await obterDocumentoPaciente(input.documentoId);
      }),
  }),

  /**
   * Histórico clínico resumido
   */
  historico: protectedProcedure
    .input(z.object({ utenteId: z.string() }))
    .query(async ({ input }) => {
      const { obterHistoricoClinicoPaciente } = await import("../db");
      return await obterHistoricoClinicoPaciente(input.utenteId);
    }),
});

