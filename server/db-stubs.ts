/**
 * Stubs de Funções de Banco de Dados
 * 
 * Este arquivo contém implementações básicas (stubs) das funções de banco de dados
 * para os novos módulos. Retornam mock data para permitir que o sistema compile e funcione.
 * 
 * IMPORTANTE: Estas são implementações temporárias. Para produção, devem ser substituídas
 * por implementações reais com PostgreSQL/Prisma.
 */

// ========================================
// IMAGENS CLÍNICAS
// ========================================

export async function listarImagensClinicas(input: any) {
  return [];
}

export async function obterImagemClinica(id: string) {
  return null;
}

export async function uploadImagemClinica(input: any) {
  return {
    id: `img_${Date.now()}`,
    ...input,
    dataUpload: new Date().toISOString(),
  };
}

export async function atualizarImagemClinica(input: any) {
  return { success: true };
}

export async function deletarImagemClinica(id: string) {
  return { success: true };
}

export async function adicionarAnotacaoImagem(input: any) {
  return {
    id: `anotacao_${Date.now()}`,
    ...input,
    dataCriacao: new Date().toISOString(),
  };
}

export async function analisarImagemComIA(input: any) {
  return {
    id: `analise_${Date.now()}`,
    imagemId: input.imagemId,
    tipoAnalise: input.tipoAnalise,
    resultado: {
      confianca: 0.85,
      deteccoes: [],
      recomendacoes: ["Análise simulada - implementar IA real"],
    },
    dataAnalise: new Date().toISOString(),
  };
}

export async function obterAnalisesIAImagem(imagemId: string) {
  return [];
}

export async function compararImagens(imagemId1: string, imagemId2: string) {
  return {
    diferencas: [],
    similaridade: 0.75,
  };
}

export async function obterEstatisticasImagens(utenteId: string) {
  return {
    total: 0,
    porTipo: {},
  };
}

// ========================================
// ENDODONTIA
// ========================================

export async function listarTratamentosEndodonticos(input: any) {
  return [];
}

export async function obterTratamentoEndodontico(id: string) {
  return null;
}

export async function criarTratamentoEndodontico(input: any) {
  return {
    id: `endo_${Date.now()}`,
    ...input,
    dataCriacao: new Date().toISOString(),
  };
}

export async function atualizarTratamentoEndodontico(input: any) {
  return { success: true };
}

export async function adicionarSessaoEndodontia(input: any) {
  return { success: true };
}

export async function deletarTratamentoEndodontico(id: string) {
  return { success: true };
}

export async function obterEstatisticasEndodontia(input: any) {
  return {
    total: 0,
    porStatus: {},
  };
}

// ========================================
// IMPLANTES
// ========================================

export async function listarImplantes(input: any) {
  return [];
}

export async function obterImplante(id: string) {
  return null;
}

export async function criarImplante(input: any) {
  return {
    id: `impl_${Date.now()}`,
    ...input,
    dataCriacao: new Date().toISOString(),
  };
}

export async function atualizarImplante(input: any) {
  return { success: true };
}

export async function adicionarAcompanhamentoImplante(input: any) {
  return { success: true };
}

export async function registrarComplicacaoImplante(input: any) {
  return { success: true };
}

export async function deletarImplante(id: string) {
  return { success: true };
}

export async function obterEstatisticasImplantes(input: any) {
  return {
    total: 0,
    porStatus: {},
    taxaSucesso: 0,
  };
}

// ========================================
// ORTODONTIA
// ========================================

export async function listarTratamentosOrtodontia(input: any) {
  return [];
}

export async function obterTratamentoOrtodontia(id: string) {
  return null;
}

export async function criarTratamentoOrtodontia(input: any) {
  return {
    id: `orto_${Date.now()}`,
    ...input,
    dataCriacao: new Date().toISOString(),
  };
}

export async function atualizarTratamentoOrtodontia(input: any) {
  return { success: true };
}

export async function adicionarAtivacaoOrtodontia(input: any) {
  return { success: true };
}

export async function adicionarEvolucaoFotograficaOrtodontia(input: any) {
  return { success: true };
}

export async function registrarPagamentoOrtodontia(input: any) {
  return { success: true };
}

export async function deletarTratamentoOrtodontia(id: string) {
  return { success: true };
}

export async function obterEstatisticasOrtodontia(input: any) {
  return {
    total: 0,
    porStatus: {},
    receitaTotal: 0,
  };
}

// ========================================
// CONSENTIMENTOS INFORMADOS
// ========================================

const mockTemplates = [
  {
    id: "template_1",
    titulo: "Consentimento para Tratamento Odontológico Geral",
    categoria: "tratamento_geral" as const,
    conteudo: "Eu, [NOME_PACIENTE], autorizo o(a) Dr(a). [NOME_DENTISTA] a realizar o tratamento odontológico proposto...",
    ativo: true,
    criadoPor: "admin",
    dataCriacao: "2025-01-15",
  },
  {
    id: "template_2",
    titulo: "Consentimento para Cirurgia Oral",
    categoria: "cirurgia" as const,
    conteudo: "Declaro estar ciente dos riscos e benefícios do procedimento cirúrgico...",
    ativo: true,
    criadoPor: "admin",
    dataCriacao: "2025-01-15",
  },
];

export async function listarTemplatesConsentimento() {
  return mockTemplates;
}

export async function criarTemplateConsentimento(input: any) {
  return {
    id: `template_${Date.now()}`,
    ...input,
    dataCriacao: new Date().toISOString(),
  };
}

export async function atualizarTemplateConsentimento(input: any) {
  return { success: true };
}

export async function listarConsentimentos(input: any) {
  return [];
}

export async function obterConsentimento(id: string) {
  return null;
}

export async function gerarConsentimento(input: any) {
  return {
    id: `consent_${Date.now()}`,
    ...input,
    status: "pendente",
    dataGeracao: new Date().toISOString(),
  };
}

export async function assinarConsentimento(input: any) {
  return {
    success: true,
    dataAssinatura: new Date().toISOString(),
  };
}

export async function recusarConsentimento(input: any) {
  return {
    success: true,
    dataRecusa: new Date().toISOString(),
  };
}

export async function deletarConsentimento(id: string) {
  return { success: true };
}

export async function obterEstatisticasConsentimentos() {
  return {
    total: 0,
    assinados: 0,
    pendentes: 0,
    recusados: 0,
  };
}

// ========================================
// ANAMNESE
// ========================================

export async function obterAnamnese(utenteId: string) {
  return null;
}

export async function salvarAnamnese(input: any) {
  return {
    id: `anamnese_${Date.now()}`,
    ...input,
    dataSalvamento: new Date().toISOString(),
  };
}

export async function obterHistoricoAnamnese(utenteId: string) {
  return [];
}

export async function gerarAlertasAnamnese(utenteId: string) {
  return {
    alertas: [],
    nivelRisco: "baixo",
  };
}

// ========================================
// LEMBRETES E NOTIFICAÇÕES
// ========================================

export async function listarLembretes(input: any) {
  return [];
}

export async function criarLembrete(input: any) {
  return {
    id: `lembrete_${Date.now()}`,
    ...input,
    status: "pendente",
    dataCriacao: new Date().toISOString(),
  };
}

export async function cancelarLembrete(id: string) {
  return { success: true };
}

export async function reenviarLembrete(id: string) {
  return { success: true };
}

export async function configurarLembretesAutomaticos(input: any) {
  return { success: true };
}

export async function obterConfiguracoesLembretes() {
  return {
    lembreteConsulta: {
      ativo: false,
      diasAntes: [1, 3],
      canais: ["whatsapp"],
    },
  };
}

export async function enviarConfirmacaoConsulta(input: any) {
  return {
    success: true,
    mensagem: "Lembrete enviado (simulado)",
  };
}

export async function processarConfirmacaoConsulta(input: any) {
  return { success: true };
}

export async function obterEstatisticasLembretes(input: any) {
  return {
    total: 0,
    enviados: 0,
    falhados: 0,
    taxaConfirmacao: 0,
  };
}

export async function testarEnvioLembrete(input: any) {
  return {
    success: true,
    mensagem: "Teste enviado com sucesso (simulado)",
  };
}

// ========================================
// ESTOQUE/INVENTÁRIO
// ========================================

export async function listarProdutos(input: any) {
  return [];
}

export async function obterProduto(id: string) {
  return null;
}

export async function criarProduto(input: any) {
  return {
    id: `produto_${Date.now()}`,
    ...input,
    dataCriacao: new Date().toISOString(),
  };
}

export async function atualizarProduto(input: any) {
  return { success: true };
}

export async function registrarEntradaEstoque(input: any) {
  return {
    id: `entrada_${Date.now()}`,
    ...input,
    tipo: "entrada",
    dataRegistro: new Date().toISOString(),
  };
}

export async function registrarSaidaEstoque(input: any) {
  return {
    id: `saida_${Date.now()}`,
    ...input,
    tipo: "saida",
    dataRegistro: new Date().toISOString(),
  };
}

export async function obterHistoricoEstoque(input: any) {
  return [];
}

export async function obterAlertasEstoque() {
  return {
    estoqueMinimo: [],
    vencimentoProximo: [],
  };
}

export async function realizarInventario(input: any) {
  return {
    id: `inventario_${Date.now()}`,
    dataRealizacao: new Date().toISOString(),
    diferencas: [],
  };
}

export async function deletarProduto(id: string) {
  return { success: true };
}

export async function obterEstatisticasEstoque(input: any) {
  return {
    valorTotal: 0,
    itensAtivos: 0,
    alertas: 0,
  };
}

export async function gerarRelatorioConsumo(input: any) {
  return {
    periodo: `${input.dataInicio} a ${input.dataFim}`,
    consumoPorCategoria: {},
    custoTotal: 0,
  };
}

