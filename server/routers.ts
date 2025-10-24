// @ts-nocheck
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
// import { imagensRouter } from "./routers-imagens";
import { financeiroRouter } from "./routers/financeiro";
import { dentistasRouter } from "./routers/dentistas";
import { configuracoesRouter } from "./routers/configuracoes";
import { comissoesRouter } from "./routers/comissoes";
import { laboratoriosRouter } from "./routers/laboratorios";
import { contasPagarRouter } from "./routers/contas-pagar";
import { iaFinanceiraRouter } from "./routers/ia-financeira";
import { tratamentosRouter } from "./routers/tratamentos";
import { prescricoesRouter, medicamentosRouter } from "./routers/prescricoes";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ========================================
  // UTENTES (Pacientes)
  // ========================================
  utentes: router({
    // Listar todos os utentes
    listar: protectedProcedure.query(async () => {
      const { listarUtentes } = await import("./db");
      return await listarUtentes();
    }),

    // Obter utente por ID
    obter: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        const { obterUtente } = await import("./db");
        return await obterUtente(input.id);
      }),

    // Pesquisar utentes
    pesquisar: protectedProcedure
      .input(z.object({ termo: z.string() }))
      .query(async ({ input }) => {
        const { pesquisarUtentes } = await import("./db");
        return await pesquisarUtentes(input.termo);
      }),

    // Criar novo utente
    criar: protectedProcedure
      .input(
        z.object({
          nomeCompleto: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
          dataNascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida (use YYYY-MM-DD)"),
          genero: z.enum(["M", "F", "Outro"]),
          nif: z.string().length(9, "NIF deve ter 9 dígitos").optional(),
          numUtenteSns: z.string().length(9).optional(),
          fotoPerfil: z.string().optional(),
          contacto: z.object({
            telemovel: z.string().min(1, "Telemóvel/WhatsApp é obrigatório"),
            telefone: z.string().optional(),
            email: z.string().email("Email inválido").optional(),
            telefoneEmergencia: z.string().optional(),
          }),
          morada: z.object({
            rua: z.string().optional(),
            numero: z.string().optional(),
            codigoPostal: z.string().regex(/^\d{4}-\d{3}$/, "Código postal inválido").optional(),
            localidade: z.string().optional(),
            distrito: z.string().optional(),
          }).optional(),
          infoMedica: z.object({
            alergias: z.array(z.string()),
            medicamentos: z.array(z.string()),
            condicoesMedicas: z.array(z.string()),
            classificacaoAsa: z.enum(["I", "II", "III", "IV", "V", "VI"]),
            grupoSanguineo: z.string().optional(),
            notasImportantes: z.string().optional(),
          }),
          tags: z.array(z.string()).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { criarUtente } = await import("./db");
        return await criarUtente({
          ...input,
          status: "ativo",
          criadoPor: ctx.user.id,
        });
      }),

    // Atualizar utente
    atualizar: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          dados: z.object({
            nomeCompleto: z.string().min(3).optional(),
            dataNascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
            genero: z.enum(["M", "F", "Outro"]).optional(),
            nif: z.string().length(9).optional(),
            numUtenteSns: z.string().length(9).optional(),
            fotoPerfil: z.string().optional(),
            contacto: z.object({
              telemovel: z.string().min(1, "Telemóvel/WhatsApp é obrigatório"),
              telefone: z.string().optional(),
              email: z.string().email().optional(),
              telefoneEmergencia: z.string().optional(),
            }).optional(),
            morada: z.object({
              rua: z.string(),
              numero: z.string(),
              codigoPostal: z.string().regex(/^\d{4}-\d{3}$/),
              localidade: z.string(),
              distrito: z.string(),
            }).optional(),
            infoMedica: z.object({
              alergias: z.array(z.string()),
              medicamentos: z.array(z.string()),
              condicoesMedicas: z.array(z.string()),
              classificacaoAsa: z.enum(["I", "II", "III", "IV", "V", "VI"]),
              grupoSanguineo: z.string().optional(),
              notasImportantes: z.string().optional(),
            }).optional(),
            status: z.enum(["ativo", "inativo", "arquivado"]).optional(),
            tags: z.array(z.string()).optional(),
          }),
        })
      )
      .mutation(async ({ input }) => {
        const { atualizarUtente } = await import("./db");
        // Converter objetos para JSON strings
        const dados: any = { ...input.dados };
        if (dados.contacto) dados.contacto = JSON.stringify(dados.contacto);
        if (dados.morada) dados.morada = JSON.stringify(dados.morada);
        if (dados.infoMedica) dados.infoMedica = JSON.stringify(dados.infoMedica);
        if (dados.tags) dados.tags = JSON.stringify(dados.tags);
        return await atualizarUtente(input.id, dados);
      }),

    // Remover utente (soft delete)
    remover: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        const { removerUtente } = await import("./db");
        await removerUtente(input.id);
        return { sucesso: true };
      }),

    // Obter estatísticas
    estatisticas: protectedProcedure.query(async () => {
      const { obterEstatisticasUtentes } = await import("./db");
      return await obterEstatisticasUtentes();
    }),
  }),

  // ========================================
  // IA - ASSISTENTE INTELIGENTE
  // ========================================
  ia: router({
    // Assistente de Diagnóstico
    analisarSintomas: protectedProcedure
      .input(
        z.object({
          utenteId: z.string(),
          sintomas: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const { obterUtente } = await import("./db");
        const { analisarSintomas } = await import("./ai-helper");

        const utente = await obterUtente(input.utenteId);
        if (!utente) throw new Error("Utente não encontrado");

        const infoMedica =
          typeof utente.infoMedica === "string"
            ? JSON.parse(utente.infoMedica)
            : utente.infoMedica;

        const idade =
          new Date().getFullYear() -
          new Date(utente.dataNascimento).getFullYear();

        return await analisarSintomas({
          sintomas: input.sintomas,
          historicoMedico: infoMedica?.notasImportantes,
          alergias: infoMedica?.alergias || [],
          medicamentos: infoMedica?.medicamentos || [],
          idade,
          genero: utente.genero,
        });
      }),

    // Verificação de Medicamento
    verificarMedicamento: protectedProcedure
      .input(
        z.object({
          utenteId: z.string(),
          medicamento: z.string(),
          dosagem: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const { obterUtente } = await import("./db");
        const { verificarMedicamento } = await import("./ai-helper");

        const utente = await obterUtente(input.utenteId);
        if (!utente) throw new Error("Utente não encontrado");

        const infoMedica =
          typeof utente.infoMedica === "string"
            ? JSON.parse(utente.infoMedica)
            : utente.infoMedica;

        const idade =
          new Date().getFullYear() -
          new Date(utente.dataNascimento).getFullYear();

        return await verificarMedicamento({
          medicamento: input.medicamento,
          dosagem: input.dosagem,
          alergias: infoMedica?.alergias || [],
          medicamentosAtuais: infoMedica?.medicamentos || [],
          condicoesMedicas: infoMedica?.condicoesMedicas || [],
          idade,
        });
      }),

    // Gerar Resumo de Consulta
    gerarResumo: protectedProcedure
      .input(
        z.object({
          notasConsulta: z.string(),
          tratamentosRealizados: z.array(z.string()).optional(),
          proximaConsulta: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { gerarResumoConsulta } = await import("./ai-helper");
        return await gerarResumoConsulta(input);
      }),

    // Análise de Risco
    analisarRisco: protectedProcedure
      .input(z.object({ utenteId: z.string() }))
      .mutation(async ({ input }) => {
        const { obterUtente } = await import("./db");
        const { analisarRiscoPaciente } = await import("./ai-helper");

        const utente = await obterUtente(input.utenteId);
        if (!utente) throw new Error("Utente não encontrado");

        const infoMedica =
          typeof utente.infoMedica === "string"
            ? JSON.parse(utente.infoMedica)
            : utente.infoMedica;

        const idade =
          new Date().getFullYear() -
          new Date(utente.dataNascimento).getFullYear();

        return await analisarRiscoPaciente({
          historicoMedico: infoMedica?.notasImportantes || "",
          condicoesMedicas: infoMedica?.condicoesMedicas || [],
          idade,
        });
      }),

    // Assistente Virtual
    assistente: protectedProcedure
      .input(
        z.object({
          utenteId: z.string(),
          pergunta: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const { obterUtente } = await import("./db");
        const { assistenteVirtual } = await import("./ai-helper");

        const utente = await obterUtente(input.utenteId);
        if (!utente) throw new Error("Utente não encontrado");

        const infoMedica =
          typeof utente.infoMedica === "string"
            ? JSON.parse(utente.infoMedica)
            : utente.infoMedica;

        const idade =
          new Date().getFullYear() -
          new Date(utente.dataNascimento).getFullYear();

        return await assistenteVirtual({
          pergunta: input.pergunta,
          contextoUtente: {
            nome: utente.nomeCompleto,
            idade,
            historicoMedico: infoMedica?.notasImportantes,
            alergias: infoMedica?.alergias,
            medicamentos: infoMedica?.medicamentos,
            condicoesMedicas: infoMedica?.condicoesMedicas,
          },
        });
      }),

    // Análise de Imagem com IA
    analisarImagem: protectedProcedure
      .input(
        z.object({
          imagemBase64: z.string(),
          tipoImagem: z.string(),
          contexto: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          console.log("🔍 [IA] Iniciando análise de imagem...");
          console.log("📊 [IA] Tipo de imagem:", input.tipoImagem);
          console.log("📊 [IA] Tamanho base64:", input.imagemBase64.length, "caracteres");
          console.log("📊 [IA] Contexto:", input.contexto || "(nenhum)");
          
          const { analisarImagemComGemini } = await import("./gemini-image-helper");
          const resultado = await analisarImagemComGemini({
            imagemBase64: input.imagemBase64,
            tipoImagem: input.tipoImagem,
            contexto: input.contexto,
          });
          
          console.log("✅ [IA] Análise concluída com sucesso");
          return resultado;
        } catch (error) {
          console.error("❌ [IA] Erro na análise de imagem:", error);
          console.error("❌ [IA] Stack:", error instanceof Error ? error.stack : "N/A");
          throw error;
        }
      }),
  }),

  // ========================================
  // IMAGENS (Persistência)
  // ========================================
  // imagens: imagensRouter,

  // ========================================
  // CONSULTAS
  // ========================================
  consultas: router({
    // Listar todas as consultas
    listar: protectedProcedure.query(async () => {
      const { listarConsultas } = await import("./db");
      return await listarConsultas();
    }),

    // Obter consulta por ID
    obter: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        const { obterConsulta } = await import("./db");
        return await obterConsulta(input.id);
      }),

    // Criar nova consulta
    criar: protectedProcedure
      .input(
        z.object({
          utenteId: z.string(),
          medicoId: z.string().optional().nullable(),
          dataHora: z.string(),
          duracao: z.number().optional(),
          tipoConsulta: z.string().optional().nullable(),
          procedimento: z.string().optional().nullable(),
          status: z.enum(['agendada', 'confirmada', 'realizada', 'cancelada', 'faltou', 'em_atendimento']).optional(),
          observacoes: z.string().optional().nullable(),
          valorEstimado: z.number().optional().nullable(),
          classificacaoRisco: z.string().optional().nullable(),
        })
      )
      .mutation(async ({ input }) => {
        const { criarConsulta, verificarConflito } = await import("./db");
        
        // Verificar conflito se tiver médico
        if (input.medicoId) {
          const temConflito = await verificarConflito(
            input.medicoId,
            input.dataHora,
            input.duracao || 30
          );
          
          if (temConflito) {
            throw new Error("Já existe uma consulta agendada para este médico neste horário");
          }
        }
        
        return await criarConsulta(input);
      }),

    // Atualizar consulta
    atualizar: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          utenteId: z.string().optional(),
          medicoId: z.string().optional().nullable(),
          dataHora: z.string().optional(),
          duracao: z.number().optional(),
          tipoConsulta: z.string().optional().nullable(),
          procedimento: z.string().optional().nullable(),
          status: z.enum(['agendada', 'confirmada', 'realizada', 'cancelada', 'faltou', 'em_atendimento']).optional(),
          observacoes: z.string().optional().nullable(),
          valorEstimado: z.number().optional().nullable(),
          classificacaoRisco: z.string().optional().nullable(),
        })
      )
      .mutation(async ({ input }) => {
        const { atualizarConsulta, verificarConflito, obterConsulta } = await import("./db");
        
        // Se estiver alterando médico, data ou duração, verificar conflito
        if (input.medicoId || input.dataHora || input.duracao) {
          const consultaAtual = await obterConsulta(input.id);
          const medicoId = input.medicoId !== undefined ? input.medicoId : consultaAtual.medicoId;
          const dataHora = input.dataHora || consultaAtual.dataHora;
          const duracao = input.duracao || consultaAtual.duracao;
          
          if (medicoId) {
            const temConflito = await verificarConflito(
              medicoId,
              dataHora,
              duracao,
              input.id
            );
            
            if (temConflito) {
              throw new Error("Já existe uma consulta agendada para este médico neste horário");
            }
          }
        }
        
        const { id, ...dados } = input;
        return await atualizarConsulta(id, dados);
      }),

    // Remover consulta
    remover: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        const { removerConsulta } = await import("./db");
        await removerConsulta(input.id);
        return { success: true };
      }),

    // Listar consultas por data
    listarPorData: protectedProcedure
      .input(z.object({ data: z.string() }))
      .query(async ({ input }) => {
        const { listarConsultasPorData } = await import("./db");
        return await listarConsultasPorData(input.data);
      }),

    // Listar consultas por período
    listarPorPeriodo: protectedProcedure
      .input(z.object({ 
        dataInicio: z.string(),
        dataFim: z.string()
      }))
      .query(async ({ input }) => {
        const { listarConsultasPorPeriodo } = await import("./db");
        return await listarConsultasPorPeriodo(input.dataInicio, input.dataFim);
      }),

    // Listar consultas por médico
    listarPorMedico: protectedProcedure
      .input(z.object({ medicoId: z.string() }))
      .query(async ({ input }) => {
        const { listarConsultasPorMedico } = await import("./db");
        return await listarConsultasPorMedico(input.medicoId);
      }),

    // Verificar conflito de horário
    verificarConflito: protectedProcedure
      .input(z.object({
        medicoId: z.string(),
        dataHora: z.string(),
        duracao: z.number(),
        consultaIdExcluir: z.string().optional()
      }))
      .query(async ({ input }) => {
        const { verificarConflito } = await import("./db");
        return await verificarConflito(
          input.medicoId,
          input.dataHora,
          input.duracao,
          input.consultaIdExcluir
        );
      }),

    // Obter estatísticas
    estatisticas: protectedProcedure.query(async () => {
      const { obterEstatisticasConsultas } = await import("./db");
      return await obterEstatisticasConsultas();
    }),
  }),

  // ========================================
  // FINANCEIRO / FATURAÇÃO
  // ========================================
  financeiro: financeiroRouter,

  // ========================================
  // DENTISTAS
  // ========================================
  dentistas: dentistasRouter,

  // ========================================
  // CONFIGURAÇÕES
  // ========================================
  configuracoes: configuracoesRouter,

  // ========================================
  // COMISSÕES
  // ========================================
  comissoes: comissoesRouter,

  // ========================================
  // LABORATÓRIOS
  // ========================================
  laboratorios: laboratoriosRouter,

  // ========================================
  // CONTAS A PAGAR
  // ========================================
  contasPagar: contasPagarRouter,

  // ========================================
  // IA FINANCEIRA
  // ========================================
  iaFinanceira: iaFinanceiraRouter,

  // ========================================
  // TRATAMENTOS
  // ========================================
  tratamentos: tratamentosRouter,

  // ========================================
  // PRESCRIÇÕES
  // ========================================
  prescricoes: prescricoesRouter,

  // ========================================
  // MEDICAMENTOS
  // ========================================
  medicamentos: medicamentosRouter,
});

export type AppRouter = typeof appRouter;
