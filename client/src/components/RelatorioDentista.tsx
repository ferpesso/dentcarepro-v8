// @ts-nocheck
/**
 * Componente Relatório do Dentista
 * DentCare PRO v8
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  DollarSign,
  Activity,
  Calendar,
  Download,
  FileText,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { exportarRelatorioDentistaExcel } from "@/lib/export-excel";
import { exportarRelatorioDentistaPDF } from "@/lib/export-pdf";

interface RelatorioDentistaProps {
  dentistaId: string;
  dentistaNome: string;
}

export default function RelatorioDentista({ dentistaId, dentistaNome }: RelatorioDentistaProps) {
  const [dataInicio, setDataInicio] = useState("2025-10-01");
  const [dataFim, setDataFim] = useState("2025-10-31");

  // Dados mock para desenvolvimento
  const relatorio = {
    periodo: {
      inicio: dataInicio,
      fim: dataFim,
    },
    procedimentos: {
      total: 45,
      porTipo: {
        limpeza: 15,
        restauracao: 12,
        endodontia: 8,
        extracao: 5,
        protese: 3,
        implante: 2,
      },
    },
    faturacao: {
      totalFaturado: 12500.0,
      totalRecebido: 11200.0,
      totalPendente: 1300.0,
    },
    comissoes: {
      totalComissoes: 3750.0,
      totalPago: 3000.0,
      totalPendente: 750.0,
      lista: [
        {
          id: "com-001",
          faturaId: "fat-001",
          valor: 45.0,
          percentagem: 30,
          mes: "2025-10",
          status: "pago",
          dataPagamento: "2025-10-20",
        },
        {
          id: "com-002",
          faturaId: "fat-002",
          valor: 88.56,
          percentagem: 30,
          mes: "2025-10",
          status: "pago",
          dataPagamento: "2025-10-22",
        },
        {
          id: "com-003",
          faturaId: "fat-003",
          valor: 55.35,
          percentagem: 30,
          mes: "2025-10",
          status: "pendente",
        },
      ],
    },
    estatisticas: {
      mediaComissaoPorProcedimento: 83.33,
      procedimentoMaisRealizado: "Limpeza Dentária",
      ticketMedio: 277.78,
    },
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-PT");
  };

  const handleExportarPDF = () => {
    exportarRelatorioDentistaPDF({
      dentistaNome,
      periodo: relatorio.periodo,
      procedimentos: [],
      comissoes: relatorio.comissoes.lista.map((c) => ({
        data: c.dataPagamento || relatorio.periodo.fim,
        fatura: c.faturaId,
        valor: c.valor,
        percentagem: c.percentagem,
        status: c.status,
      })),
      estatisticas: {
        totalProcedimentos: relatorio.procedimentos.total,
        totalFaturacao: relatorio.faturacao.totalFaturado,
        totalComissoes: relatorio.comissoes.totalComissoes,
        comissoesPagas: relatorio.comissoes.totalPago,
        comissoesPendentes: relatorio.comissoes.totalPendente,
        ticketMedio: relatorio.estatisticas.ticketMedio,
      },
    });
  };

  const handleExportarExcel = () => {
    exportarRelatorioDentistaExcel({
      dentistaNome,
      periodo: relatorio.periodo,
      procedimentos: [],
      comissoes: relatorio.comissoes.lista.map((c) => ({
        data: c.dataPagamento || relatorio.periodo.fim,
        fatura: c.faturaId,
        valor: c.valor,
        percentagem: c.percentagem,
        status: c.status,
      })),
      estatisticas: {
        totalProcedimentos: relatorio.procedimentos.total,
        totalFaturacao: relatorio.faturacao.totalFaturado,
        totalComissoes: relatorio.comissoes.totalComissoes,
        comissoesPagas: relatorio.comissoes.totalPago,
        comissoesPendentes: relatorio.comissoes.totalPendente,
        ticketMedio: relatorio.estatisticas.ticketMedio,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Relatório do Dentista</CardTitle>
              <CardDescription>{dentistaNome}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={handleExportarPDF}>
                <Download className="h-4 w-4" />
                Exportar PDF
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleExportarExcel}>
                <FileText className="h-4 w-4" />
                Exportar Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Início:</label>
              <Input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Fim:</label>
              <Input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
            </div>
            <div className="flex items-end">
              <Button>Gerar Relatório</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Procedimentos</p>
                <p className="text-2xl font-bold">{relatorio.procedimentos.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Faturado</p>
                <p className="text-2xl font-bold">
                  {formatarMoeda(relatorio.faturacao.totalFaturado)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Comissões</p>
                <p className="text-2xl font-bold">
                  {formatarMoeda(relatorio.comissoes.totalComissoes)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ticket Médio</p>
                <p className="text-2xl font-bold">
                  {formatarMoeda(relatorio.estatisticas.ticketMedio)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-2 gap-6">
        {/* Gráfico de Procedimentos por Tipo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Procedimentos por Tipo</CardTitle>
            <CardDescription>Distribuição dos procedimentos realizados</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Limpeza", value: relatorio.procedimentos.porTipo.limpeza, fill: "#3b82f6" },
                    { name: "Restauração", value: relatorio.procedimentos.porTipo.restauracao, fill: "#10b981" },
                    { name: "Endodontia", value: relatorio.procedimentos.porTipo.endodontia, fill: "#f59e0b" },
                    { name: "Extração", value: relatorio.procedimentos.porTipo.extracao, fill: "#ef4444" },
                    { name: "Prótese", value: relatorio.procedimentos.porTipo.protese, fill: "#8b5cf6" },
                    { name: "Implante", value: relatorio.procedimentos.porTipo.implante, fill: "#ec4899" },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Comissões */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comissões</CardTitle>
            <CardDescription>Status das comissões</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: "Pagas", valor: relatorio.comissoes.totalPago, fill: "#10b981" },
                  { name: "Pendentes", valor: relatorio.comissoes.totalPendente, fill: "#f59e0b" },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatarMoeda(Number(value))} />
                <Bar dataKey="valor">
                  {[
                    { name: "Pagas", valor: relatorio.comissoes.totalPago, fill: "#10b981" },
                    { name: "Pendentes", valor: relatorio.comissoes.totalPendente, fill: "#f59e0b" },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Comissões */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Comissões</CardTitle>
            <div className="flex gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total: </span>
                <span className="font-semibold">
                  {formatarMoeda(relatorio.comissoes.totalComissoes)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Pago: </span>
                <span className="font-semibold text-green-600">
                  {formatarMoeda(relatorio.comissoes.totalPago)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Pendente: </span>
                <span className="font-semibold text-orange-600">
                  {formatarMoeda(relatorio.comissoes.totalPendente)}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fatura</TableHead>
                <TableHead>Mês</TableHead>
                <TableHead>Percentagem</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Pagamento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {relatorio.comissoes.lista.map((comissao) => (
                <TableRow key={comissao.id}>
                  <TableCell className="font-mono">{comissao.faturaId}</TableCell>
                  <TableCell>{comissao.mes}</TableCell>
                  <TableCell>{comissao.percentagem}%</TableCell>
                  <TableCell className="font-semibold">
                    {formatarMoeda(comissao.valor)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={comissao.status === "pago" ? "default" : "secondary"}
                    >
                      {comissao.status === "pago" ? "Pago" : "Pendente"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {comissao.dataPagamento
                      ? formatarData(comissao.dataPagamento)
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Estatísticas Adicionais */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Média de Comissão por Procedimento</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {formatarMoeda(relatorio.estatisticas.mediaComissaoPorProcedimento)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Procedimento Mais Realizado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold text-purple-600">
              {relatorio.estatisticas.procedimentoMaisRealizado}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Taxa de Recebimento</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {((relatorio.faturacao.totalRecebido / relatorio.faturacao.totalFaturado) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
