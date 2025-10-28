// @ts-nocheck
/**
 * Componente Relatório da Clínica
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
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  Download,
  FileText,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { exportarRelatorioClinicaExcel } from "@/lib/export-excel";
import { exportarRelatorioClinicaPDF } from "@/lib/export-pdf";

export default function RelatorioClinica() {
  const [dataInicio, setDataInicio] = useState("2025-10-01");
  const [dataFim, setDataFim] = useState("2025-10-31");

  // Dados mock para desenvolvimento
  const relatorio = {
    periodo: {
      inicio: dataInicio,
      fim: dataFim,
    },
    faturacao: {
      totalFaturado: 45000.0,
      totalRecebido: 40500.0,
      totalPendente: 3500.0,
      totalVencido: 1000.0,
    },
    custos: {
      comissoesDentistas: 13500.0,
      contasPagar: 2000.0,
      laboratorios: 3500.0,
      estoque: 1500.0,
      outros: 1000.0,
      total: 21500.0,
    },
    lucro: {
      bruto: 23500.0, // Faturado - Custos
      liquido: 19000.0, // Recebido - Custos
      margem: 52.22, // %
    },
    porDentista: [
      {
        dentistaId: "dent-001",
        nome: "Dr. João Costa",
        faturacao: 18000.0,
        comissoes: 5400.0,
        procedimentos: 45,
      },
      {
        dentistaId: "dent-002",
        nome: "Dra. Ana Martins",
        faturacao: 15000.0,
        comissoes: 4500.0,
        procedimentos: 38,
      },
      {
        dentistaId: "dent-003",
        nome: "Dr. Pedro Silva",
        faturacao: 12000.0,
        comissoes: 3600.0,
        procedimentos: 32,
      },
    ],
    porProcedimento: [
      { tipo: "Limpeza", quantidade: 45, faturacao: 8100.0 },
      { tipo: "Restauração", quantidade: 38, faturacao: 11400.0 },
      { tipo: "Endodontia", quantidade: 18, faturacao: 9000.0 },
      { tipo: "Extração", quantidade: 15, faturacao: 3750.0 },
      { tipo: "Prótese", quantidade: 8, faturacao: 8000.0 },
      { tipo: "Implante", quantidade: 6, faturacao: 12000.0 },
    ],
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(valor);
  };

  const handleExportarPDF = () => {
    const custosDetalhados = [
      { categoria: "Comissões Dentistas", valor: relatorio.custos.comissoesDentistas, percentagem: (relatorio.custos.comissoesDentistas / relatorio.custos.total) * 100 },
      { categoria: "Contas a Pagar", valor: relatorio.custos.contasPagar, percentagem: (relatorio.custos.contasPagar / relatorio.custos.total) * 100 },
      { categoria: "Laboratórios", valor: relatorio.custos.laboratorios, percentagem: (relatorio.custos.laboratorios / relatorio.custos.total) * 100 },
      { categoria: "Estoque", valor: relatorio.custos.estoque, percentagem: (relatorio.custos.estoque / relatorio.custos.total) * 100 },
      { categoria: "Outros", valor: relatorio.custos.outros, percentagem: (relatorio.custos.outros / relatorio.custos.total) * 100 },
    ];

    exportarRelatorioClinicaPDF({
      periodo: relatorio.periodo,
      financeiro: {
        faturacaoTotal: relatorio.faturacao.totalFaturado,
        custosTotais: relatorio.custos.total,
        lucroBruto: relatorio.lucro.bruto,
        lucroLiquido: relatorio.lucro.liquido,
        margemLucro: relatorio.lucro.margem,
      },
      custos: custosDetalhados,
      dentistas: relatorio.porDentista.map((d) => ({
        nome: d.nome,
        procedimentos: d.procedimentos,
        faturacao: d.faturacao,
        comissoes: d.comissoes,
      })),
      procedimentos: relatorio.porProcedimento,
    });
  };

  const handleExportarExcel = () => {
    const custosDetalhados = [
      { categoria: "Comissões Dentistas", valor: relatorio.custos.comissoesDentistas, percentagem: (relatorio.custos.comissoesDentistas / relatorio.custos.total) * 100 },
      { categoria: "Contas a Pagar", valor: relatorio.custos.contasPagar, percentagem: (relatorio.custos.contasPagar / relatorio.custos.total) * 100 },
      { categoria: "Laboratórios", valor: relatorio.custos.laboratorios, percentagem: (relatorio.custos.laboratorios / relatorio.custos.total) * 100 },
      { categoria: "Estoque", valor: relatorio.custos.estoque, percentagem: (relatorio.custos.estoque / relatorio.custos.total) * 100 },
      { categoria: "Outros", valor: relatorio.custos.outros, percentagem: (relatorio.custos.outros / relatorio.custos.total) * 100 },
    ];

    exportarRelatorioClinicaExcel({
      periodo: relatorio.periodo,
      financeiro: {
        faturacaoTotal: relatorio.faturacao.totalFaturado,
        custosTotais: relatorio.custos.total,
        lucroBruto: relatorio.lucro.bruto,
        lucroLiquido: relatorio.lucro.liquido,
        margemLucro: relatorio.lucro.margem,
      },
      custos: custosDetalhados,
      dentistas: relatorio.porDentista.map((d) => ({
        nome: d.nome,
        procedimentos: d.procedimentos,
        faturacao: d.faturacao,
        comissoes: d.comissoes,
      })),
      procedimentos: relatorio.porProcedimento,
    });
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Relatório da Clínica</CardTitle>
              <CardDescription>Análise financeira e operacional completa</CardDescription>
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

      {/* Cards de Resumo Financeiro */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
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
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Recebido</p>
                <p className="text-2xl font-bold">
                  {formatarMoeda(relatorio.faturacao.totalRecebido)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Custos</p>
                <p className="text-2xl font-bold">
                  {formatarMoeda(relatorio.custos.total)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lucro Líquido</p>
                <p className="text-2xl font-bold">
                  {formatarMoeda(relatorio.lucro.liquido)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas */}
      {relatorio.faturacao.totalVencido > 0 && (
        <Card className="border-orange-300 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-semibold text-orange-900">Atenção: Faturas Vencidas</p>
                <p className="text-sm text-orange-700">
                  Existem {formatarMoeda(relatorio.faturacao.totalVencido)} em faturas vencidas que
                  precisam de atenção.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Análise de Lucro */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Lucro Bruto</CardTitle>
            <CardDescription>Faturado - Custos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {formatarMoeda(relatorio.lucro.bruto)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Lucro Líquido</CardTitle>
            <CardDescription>Recebido - Custos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {formatarMoeda(relatorio.lucro.liquido)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Margem de Lucro</CardTitle>
            <CardDescription>Lucro / Faturação</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">{relatorio.lucro.margem.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-2 gap-6">
        {/* Gráfico de Custos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Detalhamento de Custos</CardTitle>
            <CardDescription>Distribuição dos custos operacionais</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Comissões", value: relatorio.custos.comissoesDentistas, fill: "#ef4444" },
                    { name: "Laboratórios", value: relatorio.custos.laboratorios, fill: "#f59e0b" },
                    { name: "Contas a Pagar", value: relatorio.custos.contasPagar, fill: "#eab308" },
                    { name: "Estoque", value: relatorio.custos.estoque, fill: "#84cc16" },
                    { name: "Outros", value: relatorio.custos.outros, fill: "#22c55e" },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                </Pie>
                <Tooltip formatter={(value) => formatarMoeda(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Faturação por Procedimento */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Faturação por Procedimento</CardTitle>
            <CardDescription>Top procedimentos por valor</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={relatorio.porProcedimento}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tipo" />
                <YAxis />
                <Tooltip formatter={(value) => formatarMoeda(Number(value))} />
                <Bar dataKey="faturacao" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Performance por Dentista */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Performance por Dentista</CardTitle>
          <CardDescription>Faturação e comissões</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={relatorio.porDentista}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip formatter={(value) => formatarMoeda(Number(value))} />
              <Legend />
              <Bar dataKey="faturacao" fill="#3b82f6" name="Faturação" />
              <Bar dataKey="comissoes" fill="#ef4444" name="Comissões" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance por Dentista */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Performance por Dentista</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dentista</TableHead>
                <TableHead>Procedimentos</TableHead>
                <TableHead>Faturação</TableHead>
                <TableHead>Comissões</TableHead>
                <TableHead>Valor Clínica</TableHead>
                <TableHead>Margem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {relatorio.porDentista.map((dentista) => {
                const valorClinica = dentista.faturacao - dentista.comissoes;
                const margem = (valorClinica / dentista.faturacao) * 100;
                return (
                  <TableRow key={dentista.dentistaId}>
                    <TableCell className="font-medium">{dentista.nome}</TableCell>
                    <TableCell>{dentista.procedimentos}</TableCell>
                    <TableCell className="font-semibold">
                      {formatarMoeda(dentista.faturacao)}
                    </TableCell>
                    <TableCell className="text-orange-600">
                      {formatarMoeda(dentista.comissoes)}
                    </TableCell>
                    <TableCell className="text-green-600 font-semibold">
                      {formatarMoeda(valorClinica)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{margem.toFixed(1)}%</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Faturação por Tipo de Procedimento */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Faturação por Tipo de Procedimento</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Procedimento</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Faturação</TableHead>
                <TableHead>Ticket Médio</TableHead>
                <TableHead>% do Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {relatorio.porProcedimento.map((proc) => {
                const ticketMedio = proc.faturacao / proc.quantidade;
                const percentual = (proc.faturacao / relatorio.faturacao.totalFaturado) * 100;
                return (
                  <TableRow key={proc.tipo}>
                    <TableCell className="font-medium">{proc.tipo}</TableCell>
                    <TableCell>{proc.quantidade}</TableCell>
                    <TableCell className="font-semibold">
                      {formatarMoeda(proc.faturacao)}
                    </TableCell>
                    <TableCell>{formatarMoeda(ticketMedio)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{percentual.toFixed(1)}%</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Resumo Final */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle>Resumo Executivo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-lg">Receitas</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Faturado:</span>
                  <span className="font-semibold">
                    {formatarMoeda(relatorio.faturacao.totalFaturado)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Recebido:</span>
                  <span className="font-semibold text-green-600">
                    {formatarMoeda(relatorio.faturacao.totalRecebido)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pendente:</span>
                  <span className="font-semibold text-orange-600">
                    {formatarMoeda(relatorio.faturacao.totalPendente)}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-lg">Resultado</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Custos Totais:</span>
                  <span className="font-semibold text-red-600">
                    {formatarMoeda(relatorio.custos.total)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lucro Líquido:</span>
                  <span className="font-semibold text-blue-600">
                    {formatarMoeda(relatorio.lucro.liquido)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Margem:</span>
                  <span className="font-semibold text-purple-600">
                    {relatorio.lucro.margem.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
