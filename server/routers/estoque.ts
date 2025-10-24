import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";

/**
 * Router de Estoque/Inventário
 * Gestão de materiais e produtos
 */
export const estoqueRouter = router({
  /**
   * Listar produtos
   */
  listar: protectedProcedure
    .input(
      z.object({
        categoria: z.enum([
          "todos",
          "materiais_dentarios",
          "instrumentos",
          "medicamentos",
          "descartaveis",
          "higiene",
          "escritorio",
          "outros"
        ]).optional(),
        status: z.enum(["todos", "ativo", "inativo", "descontinuado"]).optional(),
        estoqueMinimo: z.boolean().optional(), // Filtrar apenas produtos abaixo do estoque mínimo
      })
    )
    .query(async ({ input }) => {
      const { listarProdutos } = await import("../db");
      return await listarProdutos(input);
    }),

  /**
   * Obter produto por ID
   */
  obter: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { obterProduto } = await import("../db");
      return await obterProduto(input.id);
    }),

  /**
   * Criar produto
   */
  criar: protectedProcedure
    .input(
      z.object({
        nome: z.string().min(1, "Nome é obrigatório"),
        codigo: z.string().optional(), // Código interno ou SKU
        codigoBarras: z.string().optional(),
        categoria: z.enum([
          "materiais_dentarios",
          "instrumentos",
          "medicamentos",
          "descartaveis",
          "higiene",
          "escritorio",
          "outros"
        ]),
        subcategoria: z.string().optional(),
        unidadeMedida: z.enum(["unidade", "caixa", "pacote", "litro", "ml", "kg", "g"]),
        quantidadeAtual: z.number().min(0).default(0),
        quantidadeMinima: z.number().min(0),
        quantidadeMaxima: z.number().min(0).optional(),
        localizacao: z.string().optional(), // Ex: "Armário 1, Prateleira 2"
        fornecedor: z.string().optional(),
        custoUnitario: z.number().min(0).optional(),
        precoVenda: z.number().min(0).optional(),
        lote: z.string().optional(),
        dataValidade: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        observacoes: z.string().optional(),
        status: z.enum(["ativo", "inativo", "descontinuado"]).default("ativo"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { criarProduto } = await import("../db");
      return await criarProduto({
        ...input,
        criadoPor: ctx.user.id,
      });
    }),

  /**
   * Atualizar produto
   */
  atualizar: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        dados: z.object({
          nome: z.string().optional(),
          categoria: z.enum([
            "materiais_dentarios",
            "instrumentos",
            "medicamentos",
            "descartaveis",
            "higiene",
            "escritorio",
            "outros"
          ]).optional(),
          quantidadeMinima: z.number().optional(),
          quantidadeMaxima: z.number().optional(),
          localizacao: z.string().optional(),
          fornecedor: z.string().optional(),
          custoUnitario: z.number().optional(),
          precoVenda: z.number().optional(),
          status: z.enum(["ativo", "inativo", "descontinuado"]).optional(),
          observacoes: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const { atualizarProduto } = await import("../db");
      return await atualizarProduto(input);
    }),

  /**
   * Registrar entrada de estoque
   */
  registrarEntrada: protectedProcedure
    .input(
      z.object({
        produtoId: z.string(),
        quantidade: z.number().min(0.01),
        custoUnitario: z.number().min(0).optional(),
        fornecedor: z.string().optional(),
        notaFiscal: z.string().optional(),
        lote: z.string().optional(),
        dataValidade: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        observacoes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { registrarEntradaEstoque } = await import("../db");
      return await registrarEntradaEstoque({
        ...input,
        registradoPor: ctx.user.id,
      });
    }),

  /**
   * Registrar saída de estoque
   */
  registrarSaida: protectedProcedure
    .input(
      z.object({
        produtoId: z.string(),
        quantidade: z.number().min(0.01),
        motivo: z.enum(["uso_clinico", "venda", "perda", "vencimento", "devolucao", "outros"]),
        utenteId: z.string().optional(), // Se for uso em paciente
        consultaId: z.string().optional(),
        observacoes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { registrarSaidaEstoque } = await import("../db");
      return await registrarSaidaEstoque({
        ...input,
        registradoPor: ctx.user.id,
      });
    }),

  /**
   * Obter histórico de movimentações
   */
  historico: protectedProcedure
    .input(
      z.object({
        produtoId: z.string().optional(),
        tipo: z.enum(["todos", "entrada", "saida"]).optional(),
        dataInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        dataFim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      })
    )
    .query(async ({ input }) => {
      const { obterHistoricoEstoque } = await import("../db");
      return await obterHistoricoEstoque(input);
    }),

  /**
   * Obter alertas de estoque
   */
  alertas: protectedProcedure.query(async () => {
    const { obterAlertasEstoque } = await import("../db");
    return await obterAlertasEstoque();
  }),

  /**
   * Realizar inventário (contagem física)
   */
  realizarInventario: protectedProcedure
    .input(
      z.object({
        itens: z.array(
          z.object({
            produtoId: z.string(),
            quantidadeContada: z.number().min(0),
            observacoes: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { realizarInventario } = await import("../db");
      return await realizarInventario({
        ...input,
        realizadoPor: ctx.user.id,
      });
    }),

  /**
   * Deletar produto
   */
  deletar: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { deletarProduto } = await import("../db");
      return await deletarProduto(input.id);
    }),

  /**
   * Obter estatísticas de estoque
   */
  estatisticas: protectedProcedure
    .input(
      z.object({
        dataInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        dataFim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      })
    )
    .query(async ({ input }) => {
      const { obterEstatisticasEstoque } = await import("../db");
      return await obterEstatisticasEstoque(input);
    }),

  /**
   * Gerar relatório de consumo
   */
  relatorioConsumo: protectedProcedure
    .input(
      z.object({
        dataInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        dataFim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        categoria: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { gerarRelatorioConsumo } = await import("../db");
      return await gerarRelatorioConsumo(input);
    }),
});

