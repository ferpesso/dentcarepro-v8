// @ts-nocheck
import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";

export const dentistasRouter = router({
  // Listar todos os dentistas
  listar: protectedProcedure.query(async () => {
    const { listarDentistas } = await import("../db");
    return await listarDentistas();
  }),

  // Obter dentista por ID
  obter: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { obterDentista } = await import("../db");
      return await obterDentista(input.id);
    }),

  // Criar novo dentista
  criar: protectedProcedure
    .input(
      z.object({
        nome: z.string(),
        nomeCompleto: z.string(),
        foto: z.string().optional(),
        nif: z.string().length(9),
        numeroOrdem: z.string(),
        especialidades: z.array(z.string()),
        email: z.string().email(),
        telefone: z.string(),
        telemovel: z.string().optional(),
        dataAdmissao: z.string(),
        cargo: z.string().optional(),
        horarioTrabalho: z.any().optional(),
        corAgenda: z.string().optional(),
        permiteAgendamentoOnline: z.boolean().optional(),
        tempoConsultaPadrao: z.number().optional(),
        observacoes: z.string().optional(),
        competencias: z.array(z.string()).optional(),
        idiomas: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { criarDentista } = await import("../db");
      
      // Converter arrays para JSON strings
      const dados: any = {
        ...input,
        especialidades: JSON.stringify(input.especialidades),
        horarioTrabalho: input.horarioTrabalho ? JSON.stringify(input.horarioTrabalho) : null,
        competencias: input.competencias ? JSON.stringify(input.competencias) : null,
        idiomas: input.idiomas ? JSON.stringify(input.idiomas) : null,
      };
      
      return await criarDentista(dados);
    }),

  // Atualizar dentista
  atualizar: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        dados: z.object({
          nome: z.string().optional(),
          nomeCompleto: z.string().optional(),
          foto: z.string().optional(),
          nif: z.string().length(9).optional(),
          numeroOrdem: z.string().optional(),
          especialidades: z.array(z.string()).optional(),
          email: z.string().email().optional(),
          telefone: z.string().optional(),
          telemovel: z.string().optional(),
          dataAdmissao: z.string().optional(),
          status: z.enum(["ativo", "inativo", "ferias", "licenca"]).optional(),
          cargo: z.string().optional(),
          horarioTrabalho: z.any().optional(),
          corAgenda: z.string().optional(),
          permiteAgendamentoOnline: z.boolean().optional(),
          tempoConsultaPadrao: z.number().optional(),
          observacoes: z.string().optional(),
          competencias: z.array(z.string()).optional(),
          idiomas: z.array(z.string()).optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const { atualizarDentista } = await import("../db");
      
      // Converter arrays para JSON strings
      const dados: any = { ...input.dados };
      if (dados.especialidades) dados.especialidades = JSON.stringify(dados.especialidades);
      if (dados.horarioTrabalho) dados.horarioTrabalho = JSON.stringify(dados.horarioTrabalho);
      if (dados.competencias) dados.competencias = JSON.stringify(dados.competencias);
      if (dados.idiomas) dados.idiomas = JSON.stringify(dados.idiomas);
      
      return await atualizarDentista(input.id, dados);
    }),

  // Remover dentista
  remover: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { removerDentista } = await import("../db");
      await removerDentista(input.id);
      return { sucesso: true };
    }),

  // Obter configuração de comissão
  obterConfigComissao: protectedProcedure
    .input(z.object({ dentistaId: z.string() }))
    .query(async ({ input }) => {
      const { obterConfigComissao } = await import("../db");
      return await obterConfigComissao(input.dentistaId);
    }),

  // Salvar configuração de comissão
  salvarConfigComissao: protectedProcedure
    .input(
      z.object({
        dentistaId: z.string(),
        tipo: z.enum(["percentagem", "fixo", "misto", "nenhum"]),
        configuracao: z.any(),
        pagarEm: z.enum(["semanal", "quinzenal", "mensal"]).optional(),
        diasPagamento: z.array(z.number()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { salvarConfigComissao } = await import("../db");
      
      const dados = {
        ...input,
        configuracao: JSON.stringify(input.configuracao),
        diasPagamento: input.diasPagamento ? JSON.stringify(input.diasPagamento) : null,
      };
      
      return await salvarConfigComissao(dados);
    }),

  // Listar comissões do dentista
  listarComissoes: protectedProcedure
    .input(
      z.object({
        dentistaId: z.string(),
        mes: z.string().optional(), // Formato: YYYY-MM
      })
    )
    .query(async ({ input }) => {
      const { listarComissoesDentista } = await import("../db");
      return await listarComissoesDentista(input.dentistaId, input.mes);
    }),

  // Obter resumo financeiro do dentista
  resumoFinanceiro: protectedProcedure
    .input(
      z.object({
        dentistaId: z.string(),
        mes: z.string(), // Formato: YYYY-MM
      })
    )
    .query(async ({ input }) => {
      const { obterResumoFinanceiroDentista } = await import("../db");
      return await obterResumoFinanceiroDentista(input.dentistaId, input.mes);
    }),

  // Pagar comissão
  pagarComissao: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        formaPagamento: z.string(),
        referencia: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { pagarComissao } = await import("../db");
      await pagarComissao(input.id, input.formaPagamento, input.referencia);
      return { sucesso: true };
    }),
});

