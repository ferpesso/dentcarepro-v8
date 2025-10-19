// @ts-nocheck
import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";

export const configuracoesRouter = router({
  // Obter configurações da clínica
  obter: protectedProcedure.query(async () => {
    const { obterConfigClinica } = await import("../db");
    return await obterConfigClinica();
  }),

  // Salvar configurações da clínica
  salvar: protectedProcedure
    .input(
      z.object({
        nomeClinica: z.string(),
        nomeFantasia: z.string().optional(),
        razaoSocial: z.string(),
        nif: z.string().length(9),
        numeroRegistro: z.string().optional(),
        telefone: z.string(),
        telemovel: z.string().optional(),
        email: z.string().email(),
        website: z.string().optional(),
        redesSociais: z.any().optional(),
        morada: z.any(),
        anoFundacao: z.number().optional(),
        numeroFuncionarios: z.number().optional(),
        especialidades: z.array(z.string()).optional(),
        horarioFuncionamento: z.any().optional(),
        logoPrincipal: z.string().optional(),
        logoSecundario: z.string().optional(),
        favicon: z.string().optional(),
        paletaCores: z.any().optional(),
        papelTimbrado: z.any().optional(),
        nomeSistema: z.string().optional(),
        slogan: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { salvarConfigClinica } = await import("../db");
      
      // Converter objetos para JSON strings
      const dados = {
        ...input,
        redesSociais: input.redesSociais ? JSON.stringify(input.redesSociais) : null,
        morada: JSON.stringify(input.morada),
        especialidades: input.especialidades ? JSON.stringify(input.especialidades) : null,
        horarioFuncionamento: input.horarioFuncionamento ? JSON.stringify(input.horarioFuncionamento) : null,
        paletaCores: input.paletaCores ? JSON.stringify(input.paletaCores) : null,
        papelTimbrado: input.papelTimbrado ? JSON.stringify(input.papelTimbrado) : null,
      };
      
      return await salvarConfigClinica(dados);
    }),

  // Listar formas de pagamento
  listarFormasPagamento: protectedProcedure.query(async () => {
    const { listarFormasPagamento } = await import("../db");
    return await listarFormasPagamento();
  }),

  // Criar forma de pagamento
  criarFormaPagamento: protectedProcedure
    .input(
      z.object({
        nome: z.string(),
        tipo: z.string(),
        ativo: z.boolean().optional(),
        icone: z.string().optional(),
        cor: z.string().optional(),
        ordem: z.number().optional(),
        taxa: z.any().optional(),
        valorMinimo: z.number().optional(),
        valorMaximo: z.number().optional(),
        integracao: z.any().optional(),
        observacoes: z.string().optional(),
        requerReferencia: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { criarFormaPagamento } = await import("../db");
      
      const dados = {
        ...input,
        taxa: input.taxa ? JSON.stringify(input.taxa) : null,
        integracao: input.integracao ? JSON.stringify(input.integracao) : null,
      };
      
      return await criarFormaPagamento(dados);
    }),

  // ========================================
  // CATEGORIAS DE DESPESA
  // ========================================
  listarCategoriasDespesa: protectedProcedure
    .input(
      z
        .object({
          tipo: z.enum(["fixa", "variavel"]).optional(),
          ativo: z.boolean().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const { listarCategoriasDespesa } = await import("../db");
      return await listarCategoriasDespesa(input);
    }),

  criarCategoriaDespesa: protectedProcedure
    .input(
      z.object({
        nome: z.string().min(1, "Nome é obrigatório"),
        tipo: z.enum(["fixa", "variavel"]),
        icone: z.string().optional(),
        cor: z.string().optional(),
        ordem: z.number().default(0),
        ativo: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const { criarCategoriaDespesa } = await import("../db");
      return await criarCategoriaDespesa(input);
    }),

  // ========================================
  // FORNECEDORES
  // ========================================
  listarFornecedores: protectedProcedure
    .input(
      z
        .object({
          tipo: z.string().optional(),
          status: z.enum(["ativo", "inativo"]).optional(),
          pesquisa: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const { listarFornecedores } = await import("../db");
      return await listarFornecedores(input);
    }),

  criarFornecedor: protectedProcedure
    .input(
      z.object({
        nome: z.string().min(1, "Nome é obrigatório"),
        razaoSocial: z.string().optional(),
        nif: z.string().optional(),
        tipo: z.enum(["materiais", "equipamentos", "servicos", "laboratorio", "outros"]),
        telefone: z.string().optional(),
        telemovel: z.string().optional(),
        email: z.string().email().optional(),
        website: z.string().url().optional().or(z.literal("")),
        morada: z.string().optional(),
        cidade: z.string().optional(),
        codigoPostal: z.string().optional(),
        pais: z.string().default("Portugal"),
        contactoPrincipal: z.string().optional(),
        condicoesPagamento: z.string().optional(),
        prazoEntrega: z.number().optional(),
        status: z.enum(["ativo", "inativo"]).default("ativo"),
        observacoes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { criarFornecedor } = await import("../db");
      return await criarFornecedor(input);
    }),
});
