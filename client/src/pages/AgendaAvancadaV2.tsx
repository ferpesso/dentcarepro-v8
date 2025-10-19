// @ts-nocheck
import React, { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DndContext, DragEndEvent, DragOverlay, useDraggable, useDroppable } from "@dnd-kit/core";
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
  Calendar as CalendarIcon,
  Search,
  X,
  Plus,
  GripVertical
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ModalNovaConsultaV2 from "@/components/ModalNovaConsultaV2";
import ModalEditarConsulta from "@/components/ModalEditarConsulta";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  agendada: "bg-blue-100 text-blue-700 border-blue-300",
  confirmada: "bg-green-100 text-green-700 border-green-300",
  realizada: "bg-purple-100 text-purple-700 border-purple-300",
  cancelada: "bg-red-100 text-red-700 border-red-300",
  faltou: "bg-orange-100 text-orange-700 border-orange-300",
  em_atendimento: "bg-yellow-100 text-yellow-700 border-yellow-300",
};

const HORA_INICIO = 8;
const HORA_FIM = 20;
const HORAS = Array.from({ length: HORA_FIM - HORA_INICIO + 1 }, (_, i) => HORA_INICIO + i);

// Componente de consulta arrastável
function ConsultaCard({ consulta, utente, onClick }: any) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: consulta.id,
    data: consulta,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "p-2 rounded-lg border-2 cursor-grab active:cursor-grabbing hover:shadow-lg transition-all",
        STATUS_COLORS[consulta.status],
        isDragging && "opacity-50 scale-95"
      )}
      onClick={onClick}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-start gap-1">
        <GripVertical className="w-3 h-3 opacity-50 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
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
      </div>
    </div>
  );
}

// Componente de slot de horário (droppable)
function HorarioSlot({ dia, hora, onClick, children }: any) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${dia.toISOString()}-${hora}`,
    data: { dia, hora },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "absolute w-full border-b border-gray-100 hover:bg-blue-50/30 cursor-pointer transition-colors group",
        isOver && "bg-blue-100/50 border-blue-300"
      )}
      style={{
        top: `${(hora - HORA_INICIO) * 60}px`,
        height: "60px",
      }}
      onClick={onClick}
    >
      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-blue-600 font-medium p-1">
        {isOver ? "Soltar aqui" : "Clique para agendar"}
      </div>
      {children}
    </div>
  );
}

export default function AgendaAvancadaV2() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [dataAtual, setDataAtual] = useState(new Date());
  const [modalNovaConsulta, setModalNovaConsulta] = useState(false);
  const [modalEditarConsulta, setModalEditarConsulta] = useState(false);
  const [consultaSelecionada, setConsultaSelecionada] = useState<any>(null);
  const [dataHoraInicial, setDataHoraInicial] = useState<Date | undefined>();
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroMedico, setFiltroMedico] = useState("todos");
  const [pesquisa, setPesquisa] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  // Calcular período
  const { inicio, fim } = useMemo(() => {
    const data = new Date(dataAtual);
    
    if (viewMode === "day") {
      const inicio = new Date(data.getFullYear(), data.getMonth(), data.getDate(), 0, 0, 0);
      const fim = new Date(data.getFullYear(), data.getMonth(), data.getDate(), 23, 59, 59, 999);
      return { inicio, fim };
    }
    
    if (viewMode === "week") {
      const diaSemana = data.getDay();
      const inicio = new Date(data);
      inicio.setDate(data.getDate() - diaSemana);
      inicio.setHours(0, 0, 0, 0);
      
      const fim = new Date(inicio);
      fim.setDate(inicio.getDate() + 6);
      fim.setHours(23, 59, 59, 999);
      
      return { inicio, fim };
    }
    
    // month
    const inicio = new Date(data.getFullYear(), data.getMonth(), 1, 0, 0, 0);
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

    // Filtro por status
    if (filtroStatus !== "todos") {
      filtered = filtered.filter((c: Consulta) => c.status === filtroStatus);
    }

    // Filtro por médico
    if (filtroMedico !== "todos") {
      filtered = filtered.filter((c: Consulta) => c.medicoId === filtroMedico);
    }

    // Pesquisa por paciente
    if (pesquisa.trim()) {
      const termo = pesquisa.toLowerCase();
      filtered = filtered.filter((c: Consulta) => {
        const utente = utentes.find((u: any) => u.id === c.utenteId);
        return utente?.nomeCompleto.toLowerCase().includes(termo);
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
      novaData.setDate(dataAtual.getDate() + direcao);
    } else if (viewMode === "week") {
      novaData.setDate(dataAtual.getDate() + (direcao * 7));
    } else {
      novaData.setMonth(dataAtual.getMonth() + direcao);
    }
    
    setDataAtual(novaData);
  };

  const irParaHoje = () => {
    setDataAtual(new Date());
  };

  const handleHorarioClick = (dia: Date, hora: number) => {
    const dataHora = new Date(dia);
    dataHora.setHours(hora, 0, 0, 0);
    setDataHoraInicial(dataHora);
    setModalNovaConsulta(true);
  };

  const handleConsultaClick = (consulta: Consulta) => {
    setConsultaSelecionada(consulta);
    setModalEditarConsulta(true);
  };

  // Drag and Drop
  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const consultaId = active.id as string;
    const consulta = consultas.find((c: Consulta) => c.id === consultaId);
    
    if (!consulta) return;

    // Extrair dia e hora do droppable
    const [diaStr, horaStr] = (over.id as string).split('-');
    const novoDia = new Date(diaStr);
    const novaHora = parseInt(horaStr);

    if (isNaN(novoDia.getTime()) || isNaN(novaHora)) return;

    // Criar nova data/hora
    const novaDataHora = new Date(novoDia);
    novaDataHora.setHours(novaHora, 0, 0, 0);

    // Atualizar consulta
    try {
      await atualizarConsultaMutation.mutateAsync({
        id: consultaId,
        dados: { 
          utenteId: consulta.utenteId,
          medicoId: consulta.medicoId,
          dataHora: novaDataHora.toISOString(),
          duracao: consulta.duracao,
          tipoConsulta: consulta.tipoConsulta,
          procedimento: consulta.procedimento,
          status: consulta.status,
          observacoes: consulta.observacoes,
          valorEstimado: consulta.valorEstimado,
          classificacaoRisco: consulta.classificacaoRisco
        }
      });
      
      // Forçar reload imediato dos dados
      await queryClient.refetchQueries({ queryKey: ['consultas'] });
      await queryClient.refetchQueries({ queryKey: ['consultas-stats'] });
      
      toast.success("Consulta reagendada!");
    } catch (error) {
      console.error("Erro ao reagendar:", error);
      toast.error("Erro ao reagendar consulta");
    }
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
      return [new Date(dataAtual)]; // Clone da data
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
      const chaveConsulta = dataConsulta.toISOString().split("T")[0];
      return chaveConsulta === chave;
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

  // Consulta ativa durante drag
  const consultaAtiva = activeId ? consultas.find((c: Consulta) => c.id === activeId) : null;
  const utenteAtivo = consultaAtiva ? utentes.find((u: any) => u.id === consultaAtiva.utenteId) : null;

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Agenda</h1>
          <p className="text-gray-600">{formatarPeriodo()}</p>
        </div>

        {/* Controles */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Seletor de visualização */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === "day" ? "default" : "outline"}
              onClick={() => setViewMode("day")}
              className="rounded-xl"
            >
              Dia
            </Button>
            <Button
              variant={viewMode === "week" ? "default" : "outline"}
              onClick={() => setViewMode("week")}
              className="rounded-xl"
            >
              Semana
            </Button>
            <Button
              variant={viewMode === "month" ? "default" : "outline"}
              onClick={() => setViewMode("month")}
              className="rounded-xl"
            >
              Mês
            </Button>
          </div>

          {/* Navegação */}
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => navegar(-1)} className="rounded-xl">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={irParaHoje} className="rounded-xl gap-2">
              <CalendarIcon className="h-4 w-4" />
              Hoje
            </Button>
            <Button variant="outline" size="icon" onClick={() => navegar(1)} className="rounded-xl">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1" />

          {/* Nova Consulta */}
          <Button
            onClick={() => {
              setDataHoraInicial(undefined);
              setModalNovaConsulta(true);
            }}
            className="rounded-xl gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <Plus className="h-4 w-4" />
            Nova Consulta
          </Button>
        </div>

        {/* Filtros */}
        <Card className="mb-6 rounded-2xl shadow-sm border-orange-200 bg-orange-50/30">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Pesquisar paciente..."
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    className="pl-10 rounded-xl border-orange-200 focus:border-orange-400"
                  />
                </div>
              </div>

              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="w-[180px] rounded-xl border-orange-200">
                  <SelectValue placeholder="Todos os Status" />
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
                  variant="ghost"
                  onClick={limparFiltros}
                  className="rounded-xl text-orange-700 hover:text-orange-900 hover:bg-orange-100"
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
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
          // Visualização de Mês (Grid) - SEM DRAG AND DROP
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
          // Visualização de Dia/Semana (Timeline) - COM DRAG AND DROP
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
                        {/* Slots de horário (droppable) */}
                        {HORAS.map((hora) => (
                          <HorarioSlot
                            key={hora}
                            dia={dia}
                            hora={hora}
                            onClick={() => handleHorarioClick(dia, hora)}
                          />
                        ))}

                        {/* Consultas (draggable) */}
                        {consultasDoDia.map((consulta: Consulta) => {
                          const utente = utentes.find((u: any) => u.id === consulta.utenteId);
                          const top = calcularPosicao(consulta);
                          const altura = calcularAltura(consulta.duracao);

                          return (
                            <div
                              key={consulta.id}
                              className="absolute left-1 right-1 z-10"
                              style={{
                                top: `${top}px`,
                                height: `${altura}px`,
                                minHeight: "40px",
                              }}
                            >
                              <ConsultaCard
                                consulta={consulta}
                                utente={utente}
                                onClick={() => handleConsultaClick(consulta)}
                              />
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

        {/* Modais */}
        <ModalNovaConsultaV2
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
          utentes={utentes.map(u => ({ id: u.id, nome: u.nomeCompleto }))}
          medicos={[]}
        />

        {/* Drag Overlay */}
        <DragOverlay>
          {consultaAtiva ? (
            <div className={cn(
              "p-2 rounded-lg border-2 shadow-2xl",
              STATUS_COLORS[consultaAtiva.status]
            )}>
              <div className="text-xs font-bold">
                {new Date(consultaAtiva.dataHora).toLocaleTimeString("pt-PT", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="text-xs font-medium mt-1">
                {utenteAtivo?.nomeCompleto || "Sem nome"}
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}

