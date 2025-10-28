import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import * as db from "../db";

// ========================================
// SCHEMAS DE VALIDAÇÃO
// ========================================

const consultaSchema = z.object({
  utenteId: z.string().min(1, "ID do utente é obrigatório"),
  dentistaId: z.string().optional(),
  dataHora: z.string().or(z.date()),
  duracao: z.number().int().positive().default(30),
  tipo: z.string().optional(),
  status: z.enum(['agendada', 'confirmada', 'realizada', 'cancelada', 'faltou']).default('agendada'),
  notas: z.string().optional(),
  valor: z.number().optional(),
});

const atualizarConsultaSchema = z.object({
  utenteId: z.string().optional(),
  dentistaId: z.string().optional(),
  dataHora: z.string().or(z.date()).optional(),
  duracao: z.number().int().positive().optional(),
  tipo: z.string().optional(),
  status: z.enum(['agendada', 'confirmada', 'realizada', 'cancelada', 'faltou']).optional(),
  notas: z.string().optional(),
  valor: z.number().optional(),
});

// ========================================
// ROUTER DE CONSULTAS
// ========================================

export const consultasRouter = router({
  /**
   * Criar nova consulta
   */
  criar: publicProcedure
    .input(consultaSchema)
    .mutation(async ({ input }) => {
      try {
        // Verificar conflito de horário se dentista especificado
        if (input.dentistaId) {
          const dataHora = typeof input.dataHora === 'string' 
            ? new Date(input.dataHora) 
            : input.dataHora;
          
          const conflito = await db.verificarConflito(
            input.dentistaId,
            dataHora,
            input.duracao
          );

          if (conflito) {
            throw new Error('Já existe uma consulta agendada neste horário para este dentista');
          }
        }

        const consulta = await db.criarConsulta(input);
        return {
          success: true,
          data: consulta,
          message: 'Consulta criada com sucesso'
        };
      } catch (error: any) {
        console.error('[Router] Erro ao criar consulta:', error);
        throw new Error(error.message || 'Erro ao criar consulta');
      }
    }),

  /**
   * Listar todas as consultas
   */
  listar: publicProcedure
    .query(async () => {
      try {
        const consultas = await db.listarConsultas();
        return {
          success: true,
          data: consultas,
          total: consultas.length
        };
      } catch (error: any) {
        console.error('[Router] Erro ao listar consultas:', error);
        throw new Error('Erro ao listar consultas');
      }
    }),

  /**
   * Listar consultas por data específica
   */
  listarPorData: publicProcedure
    .input(z.object({
      data: z.string() // formato: YYYY-MM-DD
    }))
    .query(async ({ input }) => {
      try {
        const consultas = await db.listarConsultasPorData(input.data);
        return {
          success: true,
          data: consultas,
          total: consultas.length
        };
      } catch (error: any) {
        console.error('[Router] Erro ao listar consultas por data:', error);
        throw new Error('Erro ao listar consultas por data');
      }
    }),

  /**
   * Listar consultas por médico/dentista
   */
  listarPorMedico: publicProcedure
    .input(z.object({
      medicoId: z.string()
    }))
    .query(async ({ input }) => {
      try {
        const consultas = await db.listarConsultasPorMedico(input.medicoId);
        return {
          success: true,
          data: consultas,
          total: consultas.length
        };
      } catch (error: any) {
        console.error('[Router] Erro ao listar consultas por médico:', error);
        throw new Error('Erro ao listar consultas por médico');
      }
    }),

  /**
   * Listar consultas por período
   */
  listarPorPeriodo: publicProcedure
    .input(z.object({
      dataInicio: z.string(), // formato: YYYY-MM-DD
      dataFim: z.string()     // formato: YYYY-MM-DD
    }))
    .query(async ({ input }) => {
      try {
        const consultas = await db.listarConsultasPorPeriodo(
          input.dataInicio,
          input.dataFim
        );
        return {
          success: true,
          data: consultas,
          total: consultas.length
        };
      } catch (error: any) {
        console.error('[Router] Erro ao listar consultas por período:', error);
        throw new Error('Erro ao listar consultas por período');
      }
    }),

  /**
   * Obter consulta por ID
   */
  obter: publicProcedure
    .input(z.object({
      id: z.string()
    }))
    .query(async ({ input }) => {
      try {
        const consulta = await db.obterConsulta(input.id);
        
        if (!consulta) {
          throw new Error('Consulta não encontrada');
        }

        return {
          success: true,
          data: consulta
        };
      } catch (error: any) {
        console.error('[Router] Erro ao obter consulta:', error);
        throw new Error(error.message || 'Erro ao obter consulta');
      }
    }),

  /**
   * Atualizar consulta
   */
  atualizar: publicProcedure
    .input(z.object({
      id: z.string(),
      dados: atualizarConsultaSchema
    }))
    .mutation(async ({ input }) => {
      try {
        // Verificar se a consulta existe
        const consultaExistente = await db.obterConsulta(input.id);
        if (!consultaExistente) {
          throw new Error('Consulta não encontrada');
        }

        // Se está alterando data/hora ou dentista, verificar conflito
        if (input.dados.dataHora || input.dados.dentistaId) {
          const dentistaId = input.dados.dentistaId || consultaExistente.dentistaId;
          const dataHora = input.dados.dataHora 
            ? (typeof input.dados.dataHora === 'string' 
                ? new Date(input.dados.dataHora) 
                : input.dados.dataHora)
            : new Date(consultaExistente.dataHora);
          const duracao = input.dados.duracao || consultaExistente.duracao || 30;

          if (dentistaId) {
            const conflito = await db.verificarConflito(
              dentistaId,
              dataHora,
              duracao
            );

            if (conflito) {
              // Verificar se o conflito é com a própria consulta
              const consultasConflitantes = await db.listarConsultasPorMedico(dentistaId);
              const outroConflito = consultasConflitantes.some(c => 
                c.id !== input.id && 
                new Date(c.dataHora).getTime() === dataHora.getTime()
              );

              if (outroConflito) {
                throw new Error('Já existe outra consulta agendada neste horário para este dentista');
              }
            }
          }
        }

        const consulta = await db.atualizarConsulta(input.id, input.dados);
        return {
          success: true,
          data: consulta,
          message: 'Consulta atualizada com sucesso'
        };
      } catch (error: any) {
        console.error('[Router] Erro ao atualizar consulta:', error);
        throw new Error(error.message || 'Erro ao atualizar consulta');
      }
    }),

  /**
   * Remover consulta
   */
  remover: publicProcedure
    .input(z.object({
      id: z.string()
    }))
    .mutation(async ({ input }) => {
      try {
        // Verificar se a consulta existe
        const consultaExistente = await db.obterConsulta(input.id);
        if (!consultaExistente) {
          throw new Error('Consulta não encontrada');
        }

        await db.removerConsulta(input.id);
        return {
          success: true,
          message: 'Consulta removida com sucesso'
        };
      } catch (error: any) {
        console.error('[Router] Erro ao remover consulta:', error);
        throw new Error(error.message || 'Erro ao remover consulta');
      }
    }),

  /**
   * Cancelar consulta (soft delete)
   */
  cancelar: publicProcedure
    .input(z.object({
      id: z.string(),
      motivo: z.string().optional()
    }))
    .mutation(async ({ input }) => {
      try {
        const consultaExistente = await db.obterConsulta(input.id);
        if (!consultaExistente) {
          throw new Error('Consulta não encontrada');
        }

        const notas = input.motivo 
          ? `${consultaExistente.notas || ''}\n[CANCELADA] ${input.motivo}`.trim()
          : consultaExistente.notas;

        await db.atualizarConsulta(input.id, {
          status: 'cancelada',
          notas
        });

        return {
          success: true,
          message: 'Consulta cancelada com sucesso'
        };
      } catch (error: any) {
        console.error('[Router] Erro ao cancelar consulta:', error);
        throw new Error(error.message || 'Erro ao cancelar consulta');
      }
    }),

  /**
   * Confirmar consulta
   */
  confirmar: publicProcedure
    .input(z.object({
      id: z.string()
    }))
    .mutation(async ({ input }) => {
      try {
        const consultaExistente = await db.obterConsulta(input.id);
        if (!consultaExistente) {
          throw new Error('Consulta não encontrada');
        }

        await db.atualizarConsulta(input.id, {
          status: 'confirmada'
        });

        return {
          success: true,
          message: 'Consulta confirmada com sucesso'
        };
      } catch (error: any) {
        console.error('[Router] Erro ao confirmar consulta:', error);
        throw new Error(error.message || 'Erro ao confirmar consulta');
      }
    }),

  /**
   * Marcar consulta como realizada
   */
  marcarRealizada: publicProcedure
    .input(z.object({
      id: z.string(),
      notas: z.string().optional()
    }))
    .mutation(async ({ input }) => {
      try {
        const consultaExistente = await db.obterConsulta(input.id);
        if (!consultaExistente) {
          throw new Error('Consulta não encontrada');
        }

        const dados: any = {
          status: 'realizada'
        };

        if (input.notas) {
          dados.notas = input.notas;
        }

        await db.atualizarConsulta(input.id, dados);

        return {
          success: true,
          message: 'Consulta marcada como realizada'
        };
      } catch (error: any) {
        console.error('[Router] Erro ao marcar consulta como realizada:', error);
        throw new Error(error.message || 'Erro ao marcar consulta como realizada');
      }
    }),

  /**
   * Verificar conflito de horário
   */
  verificarConflito: publicProcedure
    .input(z.object({
      dentistaId: z.string(),
      dataHora: z.string().or(z.date()),
      duracao: z.number().int().positive().default(30)
    }))
    .query(async ({ input }) => {
      try {
        const dataHora = typeof input.dataHora === 'string' 
          ? new Date(input.dataHora) 
          : input.dataHora;

        const conflito = await db.verificarConflito(
          input.dentistaId,
          dataHora,
          input.duracao
        );

        return {
          success: true,
          conflito,
          message: conflito 
            ? 'Existe conflito de horário' 
            : 'Horário disponível'
        };
      } catch (error: any) {
        console.error('[Router] Erro ao verificar conflito:', error);
        throw new Error('Erro ao verificar conflito');
      }
    }),

  /**
   * Obter estatísticas de consultas
   */
  estatisticas: publicProcedure
    .query(async () => {
      try {
        const stats = await db.obterEstatisticasConsultas();
        return {
          success: true,
          data: stats
        };
      } catch (error: any) {
        console.error('[Router] Erro ao obter estatísticas:', error);
        throw new Error('Erro ao obter estatísticas');
      }
    }),
});
