/**
 * Página de IA Financeira
 * DentCare PRO - Assistente Inteligente para Gestão Financeira
 */

import { useState } from "react";
import { trpc } from "../lib/trpc";
import GraficosFinanceiros from "@/components/GraficosFinanceiros";
import ExportadorRelatorios from "@/components/ExportadorRelatorios";
import { 
  Sparkles, 
  MessageSquare, 
  TrendingUp, 
  Lightbulb,
  Send,
  Loader2,
  Brain,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";

export default function IAFinanceira() {
  const [pergunta, setPergunta] = useState("");
  const [conversas, setConversas] = useState<Array<{
    tipo: "pergunta" | "resposta";
    texto: string;
    timestamp: string;
  }>>([]);

  // Mutation para perguntar ao assistente
  const perguntarMutation = trpc.iaFinanceira.perguntarAssistente.useMutation({
    onSuccess: (data) => {
      setConversas(prev => [
        ...prev,
        {
          tipo: "resposta",
          texto: data.resposta,
          timestamp: new Date().toLocaleTimeString("pt-PT", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setPergunta("");
    },
  });

  // Query para insights automáticos
  const { data: insights, isLoading: loadingInsights } = trpc.iaFinanceira.gerarInsights.useQuery({
    periodo: {
      inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString()
        .split("T")[0],
      fim: new Date().toISOString().split("T")[0],
    },
  });

  // Query para análise de tendências
  const { data: tendencias, isLoading: loadingTendencias } = trpc.iaFinanceira.analisarTendencias.useQuery({
    meses: 6,
  });

  const handleEnviarPergunta = () => {
    if (!pergunta.trim()) return;

    setConversas(prev => [
      ...prev,
      {
        tipo: "pergunta",
        texto: pergunta,
        timestamp: new Date().toLocaleTimeString("pt-PT", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    perguntarMutation.mutate({
      pergunta,
      periodo: {
        inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          .toISOString()
          .split("T")[0],
        fim: new Date().toISOString().split("T")[0],
      },
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">IA Financeira</h1>
            <p className="text-sm text-gray-600">
              Assistente inteligente para gestão financeira da clínica
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda: Chat com Assistente */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chat */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <h2 className="font-semibold text-gray-900">
                  Assistente Financeiro
                </h2>
                <span className="ml-auto px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Online
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Faça perguntas sobre as finanças da sua clínica
              </p>
            </div>

            {/* Área de conversas */}
            <div className="p-4 h-96 overflow-y-auto space-y-4">
              {conversas.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Sparkles className="w-12 h-12 text-purple-300 mb-3" />
                  <p className="text-gray-500 mb-2">
                    Olá! Sou o seu assistente financeiro.
                  </p>
                  <p className="text-sm text-gray-400">
                    Pergunte-me qualquer coisa sobre as finanças da clínica!
                  </p>
                  <div className="mt-4 space-y-2 text-left">
                    <p className="text-xs text-gray-400">Exemplos:</p>
                    <button
                      onClick={() => setPergunta("Quanto faturei este mês?")}
                      className="block w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded text-sm text-gray-700"
                    >
                      💰 Quanto faturei este mês?
                    </button>
                    <button
                      onClick={() => setPergunta("Quais contas vencem esta semana?")}
                      className="block w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded text-sm text-gray-700"
                    >
                      📅 Quais contas vencem esta semana?
                    </button>
                    <button
                      onClick={() => setPergunta("Qual dentista tem mais comissões?")}
                      className="block w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded text-sm text-gray-700"
                    >
                      👨‍⚕️ Qual dentista tem mais comissões?
                    </button>
                  </div>
                </div>
              ) : (
                conversas.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.tipo === "pergunta" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.tipo === "pergunta"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.texto}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.tipo === "pergunta" ? "text-purple-200" : "text-gray-500"
                        }`}
                      >
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))
              )}

              {perguntarMutation.isPending && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                  </div>
                </div>
              )}
            </div>

            {/* Input de pergunta */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pergunta}
                  onChange={(e) => setPergunta(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleEnviarPergunta()}
                  placeholder="Digite sua pergunta..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={perguntarMutation.isPending}
                />
                <button
                  onClick={handleEnviarPergunta}
                  disabled={!pergunta.trim() || perguntarMutation.isPending}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {perguntarMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Análise de Tendências */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h2 className="font-semibold text-gray-900">
                  Análise de Tendências
                </h2>
              </div>
            </div>
            <div className="p-4">
              {loadingTendencias ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              ) : tendencias ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Receitas</p>
                      <p className="text-lg font-bold text-green-600 capitalize">
                        {tendencias.tendenciaReceitas}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Despesas</p>
                      <p className="text-lg font-bold text-red-600 capitalize">
                        {tendencias.tendenciaDespesas}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Lucro</p>
                      <p className="text-lg font-bold text-blue-600 capitalize">
                        {tendencias.tendenciaLucro}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Análise Detalhada:
                    </p>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                      {tendencias.analise}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  Dados insuficientes para análise
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Insights e Alertas */}
        <div className="space-y-6">
          {/* Insights Automáticos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                <h2 className="font-semibold text-gray-900">Insights</h2>
              </div>
            </div>
            <div className="p-4">
              {loadingInsights ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-yellow-600" />
                </div>
              ) : insights ? (
                <div className="space-y-4">
                  {/* Resumo */}
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{insights.resumo}</p>
                    </div>
                  </div>

                  {/* Insights */}
                  {insights.insights && insights.insights.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Insights
                      </p>
                      {insights.insights.map((insight, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 p-2 bg-green-50 rounded"
                        >
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">{insight}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Alertas */}
                  {insights.alertas && insights.alertas.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Alertas
                      </p>
                      {insights.alertas.map((alerta, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 p-2 bg-red-50 rounded"
                        >
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">{alerta}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Recomendações */}
                  {insights.recomendacoes && insights.recomendacoes.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Recomendações
                      </p>
                      {insights.recomendacoes.map((rec, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 p-2 bg-purple-50 rounded"
                        >
                          <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">{rec}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Métricas */}
                  {insights.metricas && (
                    <div className="space-y-2 pt-2 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Métricas Principais
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <p className="text-xs text-gray-600">Receita Total</p>
                          <p className="text-lg font-bold text-green-600">
                            {insights.metricas.receitaTotal.toFixed(2)} €
                          </p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <p className="text-xs text-gray-600">Despesa Total</p>
                          <p className="text-lg font-bold text-red-600">
                            {insights.metricas.despesaTotal.toFixed(2)} €
                          </p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <p className="text-xs text-gray-600">Lucro Líquido</p>
                          <p className="text-lg font-bold text-blue-600">
                            {insights.metricas.lucroLiquido.toFixed(2)} €
                          </p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <p className="text-xs text-gray-600">Margem</p>
                          <p className="text-lg font-bold text-purple-600">
                            {insights.metricas.margemLucro.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhum insight disponível
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos Interativos */}
      <div className="mt-8">
        <GraficosFinanceiros
          dados={tendencias?.dadosHistoricos || []}
          periodo="Últimos 6 meses"
        />
      </div>

      {/* Exportação de Relatórios */}
      <div className="mt-8 max-w-md">
        <ExportadorRelatorios
          dados={{
            metricas: insights?.metricas,
            receitas: [],
            despesas: [],
            comissoes: [],
          }}
          periodo={{
            inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
              .toISOString()
              .split("T")[0],
            fim: new Date().toISOString().split("T")[0],
          }}
        />
      </div>
    </div>
  );
}

