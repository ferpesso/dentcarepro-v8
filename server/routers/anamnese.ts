import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";

/**
 * Router de Anamnese
 * Gestão de questionários de anamnese digital
 */
export const anamneseRouter = router({
  /**
   * Obter anamnese de um utente
   */
  obter: protectedProcedure
    .input(z.object({ utenteId: z.string() }))
    .query(async ({ input }) => {
      const { obterAnamnese } = await import("../db");
      return await obterAnamnese(input.utenteId);
    }),

  /**
   * Criar/Atualizar anamnese
   */
  salvar: protectedProcedure
    .input(
      z.object({
        utenteId: z.string().min(1, "Utente é obrigatório"),
        
        // Dados Pessoais
        profissao: z.string().optional(),
        estadoCivil: z.enum(["solteiro", "casado", "divorciado", "viuvo", "uniao_estavel"]).optional(),
        
        // Queixa Principal
        queixaPrincipal: z.string().optional(),
        historiaQueixa: z.string().optional(),
        
        // Histórico Médico
        historicoMedico: z.object({
          doencasCardiacas: z.boolean().default(false),
          hipertensao: z.boolean().default(false),
          diabetes: z.boolean().default(false),
          problemasTireoide: z.boolean().default(false),
          problemasRenais: z.boolean().default(false),
          problemasHepaticos: z.boolean().default(false),
          problemasRespiratorios: z.boolean().default(false),
          epilepsia: z.boolean().default(false),
          cancer: z.boolean().default(false),
          hiv: z.boolean().default(false),
          hepatite: z.boolean().default(false),
          disturbiosSanguineos: z.boolean().default(false),
          outras: z.string().optional(),
        }),
        
        // Medicamentos em Uso
        medicamentosUso: z.array(
          z.object({
            nome: z.string(),
            dosagem: z.string().optional(),
            frequencia: z.string().optional(),
            motivo: z.string().optional(),
          })
        ).optional(),
        
        // Alergias
        alergias: z.object({
          medicamentos: z.array(z.string()).optional(),
          alimentos: z.array(z.string()).optional(),
          latex: z.boolean().default(false),
          anestesicos: z.boolean().default(false),
          outras: z.string().optional(),
        }).optional(),
        
        // Histórico Odontológico
        historicoOdontologico: z.object({
          ultimaConsulta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
          motivoUltimaConsulta: z.string().optional(),
          frequenciaEscovacao: z.enum(["1x", "2x", "3x", "mais_3x"]).optional(),
          usaFioDental: z.boolean().default(false),
          usaEnxaguante: z.boolean().default(false),
          sangramentoGengival: z.boolean().default(false),
          dorDentes: z.boolean().default(false),
          sensibilidade: z.boolean().default(false),
          mauHalito: z.boolean().default(false),
          bruxismo: z.boolean().default(false),
          atm: z.boolean().default(false),
        }).optional(),
        
        // Hábitos
        habitos: z.object({
          fumante: z.boolean().default(false),
          cigarrosPorDia: z.number().optional(),
          exFumante: z.boolean().default(false),
          tempoParou: z.string().optional(),
          alcool: z.boolean().default(false),
          frequenciaAlcool: z.enum(["raramente", "semanalmente", "diariamente"]).optional(),
          roiUnhas: z.boolean().default(false),
          morderObjetos: z.boolean().default(false),
        }).optional(),
        
        // Mulheres
        saudeFeminina: z.object({
          gestante: z.boolean().default(false),
          mesesGestacao: z.number().optional(),
          amamentando: z.boolean().default(false),
          usaAnticoncepcional: z.boolean().default(false),
        }).optional(),
        
        // Observações Gerais
        observacoes: z.string().optional(),
        
        // Assinatura
        assinatura: z.string().optional(), // Base64 da assinatura
        dataPreenchimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { salvarAnamnese } = await import("../db");
      return await salvarAnamnese({
        ...input,
        preenchidoPor: ctx.user.id,
      });
    }),

  /**
   * Obter histórico de anamneses
   */
  historico: protectedProcedure
    .input(z.object({ utenteId: z.string() }))
    .query(async ({ input }) => {
      const { obterHistoricoAnamnese } = await import("../db");
      return await obterHistoricoAnamnese(input.utenteId);
    }),

  /**
   * Gerar alertas baseados na anamnese
   */
  gerarAlertas: protectedProcedure
    .input(z.object({ utenteId: z.string() }))
    .query(async ({ input }) => {
      const { gerarAlertasAnamnese } = await import("../db");
      return await gerarAlertasAnamnese(input.utenteId);
    }),
});

