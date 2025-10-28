// @ts-nocheck
/**
 * Componente Timeline - Histórico Unificado do Utente
 * DentCare PRO v8
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Calendar,
  Stethoscope,
  FileText,
  CreditCard,
  MessageSquare,
  FileIcon,
  Phone,
  Filter,
  Search,
} from "lucide-react";

interface EventoHistorico {
  id: string;
  utenteId: string;
  tipo: "consulta" | "procedimento" | "fatura" | "pagamento" | "observacao" | "documento" | "comunicacao";
  titulo: string;
  descricao: string;
  data: string;
  consultaId?: string;
  procedimentoId?: string;
  faturaId?: string;
  pagamentoId?: string;
  valor?: number;
  dentistaId?: string;
  dentistaNome?: string;
  icone: string;
  cor: string;
  criadoEm: string;
}

interface TimelineUtenteProps {
  utenteId: string;
  eventos?: EventoHistorico[];
}

const ICONES = {
  Calendar,
  Stethoscope,
  FileText,
  CreditCard,
  MessageSquare,
  FileIcon,
  Phone,
};

const CORES = {
  blue: "bg-blue-100 text-blue-600 border-blue-300",
  green: "bg-green-100 text-green-600 border-green-300",
  orange: "bg-orange-100 text-orange-600 border-orange-300",
  purple: "bg-purple-100 text-purple-600 border-purple-300",
  gray: "bg-gray-100 text-gray-600 border-gray-300",
  red: "bg-red-100 text-red-600 border-red-300",
};

const TIPO_LABELS = {
  consulta: "Consulta",
  procedimento: "Procedimento",
  fatura: "Fatura",
  pagamento: "Pagamento",
  observacao: "Observação",
  documento: "Documento",
  comunicacao: "Comunicação",
};

export default function TimelineUtente({ utenteId, eventos = [] }: TimelineUtenteProps) {
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [pesquisa, setPesquisa] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Dados mock para desenvolvimento
  const eventosMock: EventoHistorico[] = [
    {
      id: "evt-001",
      utenteId,
      tipo: "consulta",
      titulo: "Consulta de Avaliação",
      descricao: "Primeira consulta - Avaliação geral e plano de tratamento",
      data: "2025-10-15",
      consultaId: "cons-001",
      dentistaId: "dent-001",
      dentistaNome: "Dr. João Costa",
      icone: "Calendar",
      cor: "blue",
      criadoEm: "2025-10-15T10:00:00Z",
    },
    {
      id: "evt-002",
      utenteId,
      tipo: "procedimento",
      titulo: "Limpeza Dentária (Destartarização)",
      descricao: "Procedimento realizado com sucesso. Sem intercorrências.",
      data: "2025-10-15",
      procedimentoId: "proc-001",
      valor: 80,
      dentistaId: "dent-001",
      dentistaNome: "Dr. João Costa",
      icone: "Stethoscope",
      cor: "blue",
      criadoEm: "2025-10-15T10:30:00Z",
    },
    {
      id: "evt-003",
      utenteId,
      tipo: "fatura",
      titulo: "Fatura 2025/001 emitida",
      descricao: "Fatura no valor de €150.06",
      data: "2025-10-15",
      faturaId: "fat-001",
      valor: 150.06,
      dentistaId: "dent-001",
      dentistaNome: "Dr. João Costa",
      icone: "FileText",
      cor: "green",
      criadoEm: "2025-10-15T11:00:00Z",
    },
    {
      id: "evt-004",
      utenteId,
      tipo: "pagamento",
      titulo: "Pagamento recebido",
      descricao: "Pagamento de €150.06 via Multibanco",
      data: "2025-10-15",
      faturaId: "fat-001",
      pagamentoId: "pag-001",
      valor: 150.06,
      icone: "CreditCard",
      cor: "green",
      criadoEm: "2025-10-15T11:15:00Z",
    },
    {
      id: "evt-005",
      utenteId,
      tipo: "consulta",
      titulo: "Consulta de Seguimento",
      descricao: "Avaliação pós-tratamento. Tudo dentro da normalidade.",
      data: "2025-10-22",
      consultaId: "cons-002",
      dentistaId: "dent-001",
      dentistaNome: "Dr. João Costa",
      icone: "Calendar",
      cor: "blue",
      criadoEm: "2025-10-22T14:00:00Z",
    },
    {
      id: "evt-006",
      utenteId,
      tipo: "observacao",
      titulo: "Observação Clínica",
      descricao: "Paciente relata sensibilidade ao frio no dente 16. Agendar consulta de avaliação.",
      data: "2025-10-25",
      dentistaId: "dent-001",
      dentistaNome: "Dr. João Costa",
      icone: "MessageSquare",
      cor: "orange",
      criadoEm: "2025-10-25T09:00:00Z",
    },
  ];

  const eventosExibir = eventos.length > 0 ? eventos : eventosMock;

  // Filtrar eventos
  const eventosFiltrados = eventosExibir.filter((evento) => {
    // Filtro por tipo
    if (filtroTipo !== "todos" && evento.tipo !== filtroTipo) {
      return false;
    }

    // Filtro por pesquisa
    if (pesquisa) {
      const termo = pesquisa.toLowerCase();
      return (
        evento.titulo.toLowerCase().includes(termo) ||
        evento.descricao.toLowerCase().includes(termo) ||
        evento.dentistaNome?.toLowerCase().includes(termo)
      );
    }

    return true;
  });

  // Agrupar por data
  const eventosPorData = eventosFiltrados.reduce((acc, evento) => {
    const data = evento.data;
    if (!acc[data]) {
      acc[data] = [];
    }
    acc[data].push(evento);
    return acc;
  }, {} as Record<string, EventoHistorico[]>);

  // Ordenar datas (mais recentes primeiro)
  const datasOrdenadas = Object.keys(eventosPorData).sort((a, b) => b.localeCompare(a));

  const formatarData = (data: string) => {
    const [ano, mes, dia] = data.split("-");
    const meses = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return `${dia} de ${meses[parseInt(mes) - 1]} de ${ano}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Histórico do Utente</CardTitle>
              <CardDescription>Timeline completa de eventos, consultas, procedimentos e pagamentos</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>
        </CardHeader>

        {mostrarFiltros && (
          <CardContent className="border-t">
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Evento:</label>
                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="consulta">Consultas</SelectItem>
                    <SelectItem value="procedimento">Procedimentos</SelectItem>
                    <SelectItem value="fatura">Faturas</SelectItem>
                    <SelectItem value="pagamento">Pagamentos</SelectItem>
                    <SelectItem value="observacao">Observações</SelectItem>
                    <SelectItem value="documento">Documentos</SelectItem>
                    <SelectItem value="comunicacao">Comunicações</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Pesquisar:</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    placeholder="Buscar por título, descrição..."
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {eventosFiltrados.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Nenhum evento encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {datasOrdenadas.map((data) => (
            <div key={data} className="space-y-4">
              {/* Cabeçalho da Data */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-sm font-semibold text-muted-foreground">{formatarData(data)}</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Eventos da Data */}
              <div className="space-y-4 relative pl-8">
                {/* Linha vertical da timeline */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

                {eventosPorData[data].map((evento, idx) => {
                  const Icone = ICONES[evento.icone] || MessageSquare;
                  const corClasse = CORES[evento.cor] || CORES.gray;

                  return (
                    <div key={evento.id} className="relative">
                      {/* Ponto na timeline */}
                      <div
                        className={`absolute -left-[18px] top-3 w-3 h-3 rounded-full border-2 ${corClasse}`}
                      />

                      {/* Card do evento */}
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            {/* Ícone */}
                            <div className={`p-2 rounded-lg ${corClasse}`}>
                              <Icone className="h-5 w-5" />
                            </div>

                            {/* Conteúdo */}
                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold">{evento.titulo}</h4>
                                  {evento.dentistaNome && (
                                    <p className="text-sm text-muted-foreground">{evento.dentistaNome}</p>
                                  )}
                                </div>
                                <Badge variant="outline">{TIPO_LABELS[evento.tipo]}</Badge>
                              </div>

                              <p className="text-sm text-muted-foreground">{evento.descricao}</p>

                              {evento.valor && (
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary" className="font-mono">
                                    €{evento.valor.toFixed(2)}
                                  </Badge>
                                </div>
                              )}

                              {/* Links para entidades relacionadas */}
                              <div className="flex gap-2 text-xs">
                                {evento.consultaId && (
                                  <Button variant="link" size="sm" className="h-auto p-0">
                                    Ver Consulta
                                  </Button>
                                )}
                                {evento.procedimentoId && (
                                  <Button variant="link" size="sm" className="h-auto p-0">
                                    Ver Procedimento
                                  </Button>
                                )}
                                {evento.faturaId && (
                                  <Button variant="link" size="sm" className="h-auto p-0">
                                    Ver Fatura
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Estatísticas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {eventosFiltrados.filter((e) => e.tipo === "consulta").length}
              </div>
              <div className="text-sm text-muted-foreground">Consultas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {eventosFiltrados.filter((e) => e.tipo === "procedimento").length}
              </div>
              <div className="text-sm text-muted-foreground">Procedimentos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {eventosFiltrados.filter((e) => e.tipo === "fatura").length}
              </div>
              <div className="text-sm text-muted-foreground">Faturas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                €
                {eventosFiltrados
                  .filter((e) => e.tipo === "pagamento")
                  .reduce((sum, e) => sum + (e.valor || 0), 0)
                  .toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Pagamentos</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
