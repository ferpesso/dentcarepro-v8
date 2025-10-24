import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";

/**
 * Router de Lembretes e Notificações
 * Sistema de lembretes automáticos (WhatsApp/SMS/Email)
 */
export const lembretesRouter = router({
  /**
   * Listar lembretes
   */
  listar: protectedProcedure
    .input(
      z.object({
        status: z.enum(["todos", "pendente", "enviado", "falhado", "cancelado"]).optional(),
        tipo: z.enum(["todos", "consulta", "retorno", "aniversario", "pagamento", "personalizado"]).optional(),
        dataInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        dataFim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      })
    )
    .query(async ({ input }) => {
      const { listarLembretes } = await import("../db");
      return await listarLembretes(input);
    }),

  /**
   * Criar lembrete manual
   */
  criar: protectedProcedure
    .input(
      z.object({
        utenteId: z.string().min(1, "Utente é obrigatório"),
        tipo: z.enum(["consulta", "retorno", "aniversario", "pagamento", "personalizado"]),
        canal: z.enum(["whatsapp", "sms", "email", "todos"]),
        mensagem: z.string().min(1, "Mensagem é obrigatória"),
        dataEnvio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        horaEnvio: z.string().regex(/^\d{2}:\d{2}$/),
        consultaId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { criarLembrete } = await import("../db");
      return await criarLembrete({
        ...input,
        criadoPor: ctx.user.id,
      });
    }),

  /**
   * Cancelar lembrete
   */
  cancelar: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { cancelarLembrete } = await import("../db");
      return await cancelarLembrete(input.id);
    }),

  /**
   * Reenviar lembrete
   */
  reenviar: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { reenviarLembrete } = await import("../db");
      return await reenviarLembrete(input.id);
    }),

  /**
   * Configurar lembretes automáticos
   */
  configurarAutomaticos: protectedProcedure
    .input(
      z.object({
        lembreteConsulta: z.object({
          ativo: z.boolean(),
          diasAntes: z.array(z.number()), // Ex: [1, 3, 7] = 1 dia, 3 dias e 7 dias antes
          canais: z.array(z.enum(["whatsapp", "sms", "email"])),
          mensagemTemplate: z.string().optional(),
        }).optional(),
        
        lembreteRetorno: z.object({
          ativo: z.boolean(),
          diasDepois: z.number(), // Ex: 30, 60, 90 dias após última consulta
          canal: z.enum(["whatsapp", "sms", "email"]),
          mensagemTemplate: z.string().optional(),
        }).optional(),
        
        lembreteAniversario: z.object({
          ativo: z.boolean(),
          canal: z.enum(["whatsapp", "sms", "email"]),
          mensagemTemplate: z.string().optional(),
        }).optional(),
        
        lembretePagamento: z.object({
          ativo: z.boolean(),
          diasAntes: z.number(), // Dias antes do vencimento
          canal: z.enum(["whatsapp", "sms", "email"]),
          mensagemTemplate: z.string().optional(),
        }).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { configurarLembretesAutomaticos } = await import("../db");
      return await configurarLembretesAutomaticos(input);
    }),

  /**
   * Obter configurações de lembretes
   */
  obterConfiguracoes: protectedProcedure.query(async () => {
    const { obterConfiguracoesLembretes } = await import("../db");
    return await obterConfiguracoesLembretes();
  }),

  /**
   * Enviar lembrete de confirmação de consulta
   */
  enviarConfirmacaoConsulta: protectedProcedure
    .input(
      z.object({
        consultaId: z.string(),
        canal: z.enum(["whatsapp", "sms", "email"]),
      })
    )
    .mutation(async ({ input }) => {
      const { enviarConfirmacaoConsulta } = await import("../db");
      return await enviarConfirmacaoConsulta(input);
    }),

  /**
   * Processar confirmação de consulta (callback)
   */
  confirmarConsulta: protectedProcedure
    .input(
      z.object({
        lembreteId: z.string(),
        confirmado: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const { processarConfirmacaoConsulta } = await import("../db");
      return await processarConfirmacaoConsulta(input);
    }),

  /**
   * Obter estatísticas de lembretes
   */
  estatisticas: protectedProcedure
    .input(
      z.object({
        dataInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        dataFim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      })
    )
    .query(async ({ input }) => {
      const { obterEstatisticasLembretes } = await import("../db");
      return await obterEstatisticasLembretes(input);
    }),

  /**
   * Testar envio de lembrete
   */
  testar: protectedProcedure
    .input(
      z.object({
        canal: z.enum(["whatsapp", "sms", "email"]),
        destinatario: z.string(),
        mensagem: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { testarEnvioLembrete } = await import("../db");
      return await testarEnvioLembrete(input);
    }),
});

