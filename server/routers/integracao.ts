// @ts-nocheck
/**
 * Router tRPC para Integração
 * DentCare PRO v8
 */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as dbIntegracao from "../db-integracao";

export const integracaoRouter = router({
  // ========================================
  // PROCEDIMENTOS CLÍNICOS
  // ========================================
  
  procedimentos: router({
    // Criar procedimento clínico
    criar: protectedProcedure
      .input(
        z.object({
          utenteId: z.string(),
          dentistaId: z.string(),
          consultaId: z.string().optional(),
          tipo: z.enum([
            "odontograma",
            "periodontograma",
            "endodontia",
            "implante",
            "ortodontia",
            "limpeza",
            "restauracao",
            "extracao",
            "protese",
            "clareamento",
            "outro",
          ]),
          dados: z.record(z.any()), // JSON com dados específicos
          descricao: z.string(),
          observacoes: z.string().optional(),
          valorProcedimento: z.number(),
          data: z.string(), // YYYY-MM-DD
        })
      )
      .mutation(async ({ input, ctx }) => {
        return await dbIntegracao.criarProcedimento({
          ...input,
          dados: JSON.stringify(input.dados),
          criadoPor: ctx.user.id,
        });
      }),
    
    // Listar procedimentos de um utente
    listarPorUtente: protectedProcedure
      .input(z.object({ utenteId: z.string() }))
      .query(async ({ input }) => {
        return await dbIntegracao.listarProcedimentosUtente(input.utenteId);
      }),
    
    // Listar procedimentos de um dentista
    listarPorDentista: protectedProcedure
      .input(
        z.object({
          dentistaId: z.string(),
          dataInicio: z.string().optional(),
          dataFim: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        return await dbIntegracao.listarProcedimentosDentista(
          input.dentistaId,
          input.dataInicio,
          input.dataFim
        );
      }),
  }),
  
  // ========================================
  // HISTÓRICO UNIFICADO
  // ========================================
  
  historico: router({
    // Obter histórico completo de um utente
    obter: protectedProcedure
      .input(
        z.object({
          utenteId: z.string(),
          limite: z.number().optional(),
        })
      )
      .query(async ({ input }) => {
        return await dbIntegracao.obterHistoricoUtente(input.utenteId, input.limite);
      }),
    
    // Registar evento manualmente
    registar: protectedProcedure
      .input(
        z.object({
          utenteId: z.string(),
          tipo: z.enum(["consulta", "procedimento", "fatura", "pagamento", "observacao", "documento", "comunicacao"]),
          titulo: z.string(),
          descricao: z.string(),
          data: z.string(),
          consultaId: z.string().optional(),
          procedimentoId: z.string().optional(),
          faturaId: z.string().optional(),
          pagamentoId: z.string().optional(),
          valor: z.number().optional(),
          dentistaId: z.string().optional(),
          dentistaNome: z.string().optional(),
          icone: z.string(),
          cor: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        return await dbIntegracao.registarEventoHistorico(input);
      }),
  }),
  
  // ========================================
  // TABELA DE PREÇOS
  // ========================================
  
  precos: router({
    // Listar preços
    listar: protectedProcedure
      .input(z.object({ categoria: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return await dbIntegracao.listarPrecos(input?.categoria);
      }),
    
    // Buscar preço por código
    buscar: protectedProcedure
      .input(z.object({ codigo: z.string() }))
      .query(async ({ input }) => {
        return await dbIntegracao.buscarPrecoPorCodigo(input.codigo);
      }),
    
    // Salvar preço
    salvar: protectedProcedure
      .input(
        z.object({
          codigo: z.string(),
          descricao: z.string(),
          categoria: z.enum([
            "consulta",
            "tratamento",
            "cirurgia",
            "protese",
            "ortodontia",
            "implante",
            "estetica",
            "urgencia",
            "material",
            "laboratorio",
            "outro",
          ]),
          valor: z.number(),
          iva: z.number().default(23),
          ativo: z.number().default(1),
        })
      )
      .mutation(async ({ input }) => {
        return await dbIntegracao.salvarPreco(input);
      }),
  }),
  
  // ========================================
  // FATURAÇÃO AUTOMÁTICA
  // ========================================
  
  faturacao: router({
    // Gerar fatura automaticamente
    gerarAutomatica: protectedProcedure
      .input(
        z.object({
          utenteId: z.string(),
          utenteNome: z.string(),
          utenteNif: z.string().optional(),
          utenteMorada: z.string().optional(),
          dentistaId: z.string(),
          dentistaNome: z.string(),
          consultaId: z.string().optional(),
          procedimentosIds: z.array(z.string()),
          dataVencimento: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        // Buscar procedimentos
        const procedimentos = []; // Implementar busca real
        
        return await dbIntegracao.gerarFaturaAutomatica({
          ...input,
          procedimentos,
        });
      }),
  }),
  
  // ========================================
  // COMISSÕES
  // ========================================
  
  comissoes: router({
    // Listar comissões de um dentista
    listar: protectedProcedure
      .input(
        z.object({
          dentistaId: z.string(),
          mes: z.string().optional(),
          status: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        return await dbIntegracao.listarComissoesDentista(
          input.dentistaId,
          input.mes,
          input.status
        );
      }),
    
    // Criar comissão
    criar: protectedProcedure
      .input(
        z.object({
          dentistaId: z.string(),
          faturaId: z.string(),
          valor: z.number(),
          percentagem: z.number().optional(),
          procedimentoId: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await dbIntegracao.criarComissaoAutomatica(input);
      }),
    
    // Marcar como paga
    pagar: protectedProcedure
      .input(
        z.object({
          comissaoId: z.string(),
          formaPagamento: z.string(),
          referencia: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await dbIntegracao.pagarComissao(
          input.comissaoId,
          input.formaPagamento,
          input.referencia
        );
        return { sucesso: true };
      }),
    
    // Obter configuração
    obterConfig: protectedProcedure
      .input(z.object({ dentistaId: z.string() }))
      .query(async ({ input }) => {
        return await dbIntegracao.obterConfigComissao(input.dentistaId);
      }),
    
    // Salvar configuração
    salvarConfig: protectedProcedure
      .input(
        z.object({
          dentistaId: z.string(),
          tipo: z.enum(["percentagem", "fixo", "misto"]),
          percentagem: z.number().optional(),
          valorFixo: z.number().optional(),
          valorMinimo: z.number().optional(),
          valorMaximo: z.number().optional(),
          observacoes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await dbIntegracao.salvarConfigComissao(input);
      }),
  }),
  
  // ========================================
  // RELATÓRIOS
  // ========================================
  
  relatorios: router({
    // Relatório do dentista
    dentista: protectedProcedure
      .input(
        z.object({
          dentistaId: z.string(),
          dataInicio: z.string(),
          dataFim: z.string(),
        })
      )
      .query(async ({ input }) => {
        return await dbIntegracao.gerarRelatorioDentista(
          input.dentistaId,
          input.dataInicio,
          input.dataFim
        );
      }),
    
    // Relatório da clínica
    clinica: protectedProcedure
      .input(
        z.object({
          dataInicio: z.string(),
          dataFim: z.string(),
        })
      )
      .query(async ({ input }) => {
        return await dbIntegracao.gerarRelatorioClinica(input.dataInicio, input.dataFim);
      }),
  }),
});
