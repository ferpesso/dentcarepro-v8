// @ts-nocheck
import React, { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useConsultasPorPeriodo, 
  useUtentes, 
  useConsultasStats,
  useCriarConsulta,
  useAtualizarConsulta,
  useRemoverConsulta
} from "@/hooks/useMockableQuery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  Search,
  Filter,
  Grid3x3,
  List,
  X
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ModalNovaConsulta from "@/components/ModalNovaConsulta";
import ModalEditarConsulta from "@/components/ModalEditarConsulta";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ViewMode = "day" | "week" | "month";

interface Consulta {
  id: string;
  utenteId: string;
  medicoId: string | null;
  dataHora: string;
  duracao: number;
  tipoConsulta: string | null;
  procedimento: string | null;
  status: "agendada" | "confirmada" | "realizada" | "cancelada" | "faltou" | "em_atendimento";
  observacoes: string | null;
  valorEstimado: number | null;
  classificacaoRisco: string | null;
}

const STATUS_COLORS = {
  agendada: "bg-blue-100 text-blue-700 border-blue-200",
  confirmada: "bg-green-100 text-green-700 border-green-200",
  realizada: "bg-purple-100 text-purple-700 border-purple-200",
  cancelada: "bg-red-100 text-red-700 border-red-200",
  faltou: "bg-orange-100 text-orange-700 border-orange-200",
  em_atendimento: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

const STATUS_LABELS = {
  agendada: "Agendada",
  confirmada: "Confirmada",
  realizada: "Realizada",
  cancelada: "Cancelada",
  faltou: "Faltou",
  em_atendimento: "Em Atendimento",
};

const HORA_INICIO = 8;
const HORA_FIM = 20;
const HORAS = Array.from({ length: HORA_FIM - HORA_INICIO + 1 }, (_, i) => HORA_INICIO + i);

export default function AgendaAvancada() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [dataAtual, setDataAtual] = useState(new Date());
  const [modalNovaConsulta, setModalNovaConsulta] = useState(false);
  const [modalEditarConsulta, setModalEditarConsulta] = useState(false);
  const [consultaSelecionada, setConsultaSelecionada] = useState<any>(null);
  const [dataHoraInicial, setDataHoraInicial] = useState<Date | undefined>();
  
  // Filtros
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [filtroMedico, setFiltroMedico] = useState<string>("todos");
  const [pesquisa, setPesquisa] = useState("");

  // Calcular período baseado no modo de visualização
  const { inicio, fim } = useMemo(() => {
    const data = new Date(dataAtual);
    
    if (viewMode === "day") {
      const inicio = new Date(data);
      inicio.setHours(0, 0, 0, 0);
      const fim = new Date(data);
      fim.setHours(23, 59, 59, 999);
      return { inicio, fim };
    }
    
    if (viewMode === "week") {
      const dia = data.getDay();
      const inicio = new Date(data);
      inicio.setDate(data.getDate() - dia);
      inicio.setHours(0, 0, 0, 0);
      const fim = new Date(inicio);
      fim.setDate(inicio.getDate() + 6);
      fim.setHours(23, 59, 59, 999);
      return { inicio, fim };
    }
    
    // month
    const inicio = new Date(data.getFullYear(), data.getMonth(), 1);
    const fim = new Date(data.getFullYear(), data.getMonth() + 1, 0, 23, 59, 59, 999);
    return { inicio, fim };
  }, [dataAtual, viewMode]);

  // Buscar consultas
  const { data: todasConsultas = [], isLoading } = useConsultasPorPeriodo(
    inicio.toISOString().split("T")[0],
    fim.toISOString().split("T")[0]
  );

  // Buscar utentes
  const { data: utentes = [] } = useUtentes();

  // Buscar estatísticas
  const { data: estatisticas } = useConsultasStats();

  // Filtrar consultas
  const consultas = useMemo(() => {
    let filtered = todasConsultas;

    // Filtro de status
    if (filtroStatus !== "todos") {
      filtered = filtered.filter((c: Consulta) => c.status === filtroStatus);
    }

    // Filtro de médico
    if (filtroMedico !== "todos") {
      filtered = filtered.filter((c: Consulta) => c.medicoId === filtroMedico);
    }

    // Pesquisa por paciente
    if (pesquisa.trim()) {
      const termo = pesquisa.toLowerCase();
      filtered = filtered.filter((c: Consulta) => {
        const utente = utentes.find((u: any) => u.id === c.utenteId);
        return utente?.nomeCompleto?.toLowerCase().includes(termo);
      });
    }

    return filtered;
  }, [todasConsultas, filtroStatus, filtroMedico, pesquisa, utentes]);

  // Mutations
  const criarConsultaMutation = useCriarConsulta();
  const atualizarConsultaMutation = useAtualizarConsulta();
  const removerConsultaMutation = useRemoverConsulta();

  // Navegação
  const navegar = (direcao: number) => {
    const novaData = new Date(dataAtual);
    
    if (viewMode === "day") {
      novaData.setDate(novaData.getDate() + direcao);
    } else if (viewMode === "week") {
      novaData.setDate(novaData.getDate() + (direcao * 7));
    } else {
      novaData.setMonth(novaData.getMonth() + direcao);
    }
    
    setDataAtual(novaData);
  };

  const irParaHoje = () => {
    setDataAtual(new Date());
  };

  // Handlers
  const handleHorarioClick = (data: Date, hora: number) => {
    const dataHora = new Date(data);
    dataHora.setHours(hora, 0, 0, 0);
    setDataHoraInicial(dataHora);
    setModalNovaConsulta(true);
  };

  const handleConsultaClick = (consulta: Consulta) => {
    setConsultaSelecionada(consulta);
    setModalEditarConsulta(true);
  };

  // Formatação
  const formatarPeriodo = () => {
    const opcoes: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
    
    if (viewMode === "day") {
      return dataAtual.toLocaleDateString("pt-PT", opcoes);
    }
    
    if (viewMode === "week") {
      const inicioStr = inicio.toLocaleDateString("pt-PT", { day: "numeric", month: "short" });
      const fimStr = fim.toLocaleDateString("pt-PT", { day: "numeric", month: "short", year: "numeric" });
      return `${inicioStr} - ${fimStr}`;
    }
    
    return dataAtual.toLocaleDateString("pt-PT", { month: "long", year: "numeric" });
  };

  // Gerar dias para visualização
  const dias = useMemo(() => {
    if (viewMode === "day") {
      return [dataAtual];
    }
    
    if (viewMode === "week") {
      const dias = [];
      for (let i = 0; i < 7; i++) {
        const dia = new Date(inicio);
        dia.setDate(inicio.getDate() + i);
        dias.push(dia);
      }
      return dias;
    }
    
    // month - gerar todos os dias do mês
    const dias = [];
    const primeiroDia = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
    const ultimoDia = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0);
    
    for (let d = primeiroDia.getDate(); d <= ultimoDia.getDate(); d++) {
      const dia = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), d);
      dias.push(dia);
    }
    
    return dias;
  }, [dataAtual, viewMode, inicio]);

  const isHoje = (data: Date) => {
    const hoje = new Date();
    return (
      data.getDate() === hoje.getDate() &&
      data.getMonth() === hoje.getMonth() &&
      data.getFullYear() === hoje.getFullYear()
    );
  };

  const getConsultasDoDia = (dia: Date) => {
    const chave = dia.toISOString().split("T")[0];
    return consultas.filter((c: Consulta) => {
      const dataConsulta = new Date(c.dataHora);
      return dataConsulta.toISOString().split("T")[0] === chave;
    });
  };

  const calcularPosicao = (consulta: Consulta) => {
    const dataHora = new Date(consulta.dataHora);
    const hora = dataHora.getHours();
    const minuto = dataHora.getMinutes();
    
    const offsetHoras = hora - HORA_INICIO;
    const offsetMinutos = minuto / 60;
    const top = (offsetHoras + offsetMinutos) * 60; // 60px por hora
    
    return top;
  };

  const calcularAltura = (duracao: number) => {
    return (duracao / 60) * 60; // 60px por hora
  };

  const limparFiltros = () => {
    setFiltroStatus("todos");
    setFiltroMedico("todos");
    setPesquisa("");
  };

  const temFiltrosAtivos = filtroStatus !== "todos" || filtroMedico !== "todos" || pesquisa.trim() !== "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-[1920px] mx-auto space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Agenda</h1>
            <p className="text-gray-600 text-lg">{formatarPeriodo()}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Modo de visualização */}
            <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 p-1">
              <Button
                variant={viewMode === "day" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("day")}
                className="rounded-lg"
              >
                Dia
              </Button>
              <Button
                variant={viewMode === "week" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("week")}
                className="rounded-lg"
              >
                Semana
              </Button>
              <Button
                variant={viewMode === "month" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("month")}
                className="rounded-lg"
              >
                Mês
              </Button>
            </div>

            {/* Navegação */}
            <div className="flex bg-white rounded-xl shadow-sm border border-gray-200">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navegar(-1)}
                className="rounded-l-xl"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                onClick={irParaHoje}
                className="border-x"
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Hoje
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navegar(1)}
                className="rounded-r-xl"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <Button
              onClick={() => {
                setDataHoraInicial(undefined);
                setModalNovaConsulta(true);
              }}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Consulta
            </Button>
          </div>
        </div>

        {/* Filtros e Pesquisa */}
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Pesquisa */}
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Pesquisar paciente..."
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    className="pl-10 rounded-xl"
                  />
                </div>
              </div>

              {/* Filtro Status */}
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="w-[180px] rounded-xl">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="agendada">Agendada</SelectItem>
                  <SelectItem value="confirmada">Confirmada</SelectItem>
                  <SelectItem value="realizada">Realizada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                  <SelectItem value="faltou">Faltou</SelectItem>
                  <SelectItem value="em_atendimento">Em Atendimento</SelectItem>
                </SelectContent>
              </Select>

              {temFiltrosAtivos && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={limparFiltros}
                  className="rounded-xl"
                >
                  <X className="w-4 h-4 mr-2" />
                  Limpar Filtros
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        {estatisticas && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600">Hoje</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{estatisticas.hoje || 0}</div>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600">Esta Semana</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{estatisticas.estaSemana || 0}</div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-blue-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-blue-700">Agendadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-900">{estatisticas.agendadas || 0}</div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-green-50 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-green-700">Confirmadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900">{estatisticas.confirmadas || 0}</div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-purple-50 border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-purple-700">Realizadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-900">{estatisticas.realizadas || 0}</div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-orange-50 border-orange-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-orange-700">Faltas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-900">{estatisticas.faltou || 0}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Calendário */}
        {isLoading ? (
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="text-gray-500">A carregar consultas...</div>
            </CardContent>
          </Card>
        ) : viewMode === "month" ? (
          // Visualização de Mês (Grid)
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-7 gap-2">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((dia) => (
                  <div key={dia} className="text-center font-semibold text-gray-700 py-2">
                    {dia}
                  </div>
                ))}
                
                {dias.map((dia, index) => {
                  const consultasDoDia = getConsultasDoDia(dia);
                  const ehHoje = isHoje(dia);
                  
                  return (
                    <div
                      key={index}
                      className={cn(
                        "min-h-[120px] p-2 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md",
                        ehHoje ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200 hover:border-gray-300"
                      )}
                      onClick={() => handleHorarioClick(dia, 9)}
                    >
                      <div className={cn(
                        "text-sm font-semibold mb-2",
                        ehHoje ? "text-blue-700" : "text-gray-700"
                      )}>
                        {dia.getDate()}
                      </div>
                      <div className="space-y-1">
                        {consultasDoDia.slice(0, 3).map((consulta: Consulta) => {
                          const utente = utentes.find((u: any) => u.id === consulta.utenteId);
                          return (
                            <div
                              key={consulta.id}
                              className={cn(
                                "text-xs p-1 rounded border cursor-pointer hover:opacity-80",
                                STATUS_COLORS[consulta.status]
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConsultaClick(consulta);
                              }}
                            >
                              <div className="font-medium truncate">
                                {new Date(consulta.dataHora).toLocaleTimeString("pt-PT", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                              <div className="truncate">{utente?.nomeCompleto || "Sem nome"}</div>
                            </div>
                          );
                        })}
                        {consultasDoDia.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{consultasDoDia.length - 3} mais
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ) : (
          // Visualização de Dia/Semana (Timeline)
          <Card className="rounded-2xl shadow-sm overflow-hidden">
            <div className="flex">
              {/* Timeline de horários */}
              <div className="w-20 bg-gray-50 border-r border-gray-200">
                <div className="h-16 border-b border-gray-200" /> {/* Espaço para cabeçalho */}
                {HORAS.map((hora) => (
                  <div
                    key={hora}
                    className="h-[60px] border-b border-gray-200 flex items-start justify-center pt-1"
                  >
                    <span className="text-xs text-gray-500 font-medium">
                      {hora.toString().padStart(2, "0")}:00
                    </span>
                  </div>
                ))}
              </div>

              {/* Grid de dias */}
              <div className="flex-1 flex overflow-x-auto">
                {dias.map((dia, index) => {
                  const consultasDoDia = getConsultasDoDia(dia);
                  const ehHoje = isHoje(dia);

                  return (
                    <div key={index} className="flex-1 min-w-[150px] border-r border-gray-200 last:border-r-0">
                      {/* Cabeçalho do dia */}
                      <div
                        className={cn(
                          "h-16 border-b border-gray-200 flex flex-col items-center justify-center",
                          ehHoje ? "bg-blue-50" : "bg-white"
                        )}
                      >
                        <div className="text-xs text-gray-500 font-medium uppercase">
                          {dia.toLocaleDateString("pt-PT", { weekday: "short" })}
                        </div>
                        <div
                          className={cn(
                            "text-lg font-bold mt-1",
                            ehHoje
                              ? "bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center"
                              : "text-gray-900"
                          )}
                        >
                          {dia.getDate()}
                        </div>
                      </div>

                      {/* Grid de horários */}
                      <div className="relative" style={{ height: `${(HORA_FIM - HORA_INICIO + 1) * 60}px` }}>
                        {/* Linhas de hora */}
                        {HORAS.map((hora) => (
                          <div
                            key={hora}
                            className="absolute w-full border-b border-gray-100 hover:bg-blue-50/30 cursor-pointer transition-colors group"
                            style={{
                              top: `${(hora - HORA_INICIO) * 60}px`,
                              height: "60px",
                            }}
                            onClick={() => handleHorarioClick(dia, hora)}
                          >
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-blue-600 font-medium p-1">
                              Clique para agendar
                            </div>
                          </div>
                        ))}

                        {/* Consultas */}
                        {consultasDoDia.map((consulta: Consulta) => {
                          const utente = utentes.find((u: any) => u.id === consulta.utenteId);
                          const top = calcularPosicao(consulta);
                          const altura = calcularAltura(consulta.duracao);

                          return (
                            <div
                              key={consulta.id}
                              className={cn(
                                "absolute left-1 right-1 z-10 p-2 rounded-lg border-2 cursor-pointer hover:shadow-lg transition-all overflow-hidden",
                                STATUS_COLORS[consulta.status]
                              )}
                              style={{
                                top: `${top}px`,
                                height: `${altura}px`,
                                minHeight: "40px",
                              }}
                              onClick={() => handleConsultaClick(consulta)}
                            >
                              <div className="text-xs font-bold truncate">
                                {new Date(consulta.dataHora).toLocaleTimeString("pt-PT", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                              <div className="text-xs font-medium truncate mt-1">
                                {utente?.nomeCompleto || "Sem nome"}
                              </div>
                              {consulta.tipoConsulta && (
                                <div className="text-xs truncate opacity-75">
                                  {consulta.tipoConsulta}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Modais */}
      <ModalNovaConsulta
        isOpen={modalNovaConsulta}
        onClose={() => setModalNovaConsulta(false)}
        onSave={async (dados) => {
          await criarConsultaMutation.mutateAsync(dados);
          queryClient.invalidateQueries({ queryKey: ['consultas'] });
          queryClient.invalidateQueries({ queryKey: ['consultas-stats'] });
          toast.success("Consulta criada com sucesso!");
          setModalNovaConsulta(false);
        }}
        utentes={utentes}
        medicos={[]}
        dataHoraInicial={dataHoraInicial}
      />

      <ModalEditarConsulta
        isOpen={modalEditarConsulta}
        onClose={() => {
          setModalEditarConsulta(false);
          setConsultaSelecionada(null);
        }}
        onSave={async (id, dados) => {
          await atualizarConsultaMutation.mutateAsync({ id, dados });
          queryClient.invalidateQueries({ queryKey: ['consultas'] });
          queryClient.invalidateQueries({ queryKey: ['consultas-stats'] });
          toast.success("Consulta atualizada!");
          setModalEditarConsulta(false);
        }}
        onDelete={async (id) => {
          await removerConsultaMutation.mutateAsync({ id });
          queryClient.invalidateQueries({ queryKey: ['consultas'] });
          queryClient.invalidateQueries({ queryKey: ['consultas-stats'] });
          toast.success("Consulta eliminada!");
          setModalEditarConsulta(false);
        }}
        consulta={consultaSelecionada}
        utentes={utentes}
        medicos={[]}
      />
    </div>
  );
}

