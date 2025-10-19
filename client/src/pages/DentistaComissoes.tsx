// @ts-nocheck
import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, DollarSign, TrendingUp, Clock, CheckCircle2 } from "lucide-react";

export default function DentistaComissoes() {
  const [, params] = useRoute("/dentistas/:id/comissoes");
  const [, setLocation] = useLocation();
  const [mesFilter, setMesFilter] = useState(new Date().toISOString().slice(0, 7));

  const dentistaId = params?.id;

  // Buscar dados do dentista
  const { data: dentista } = trpc.dentistas.obter.useQuery(
    { id: dentistaId! },
    { enabled: !!dentistaId }
  );

  // Buscar comissões
  const { data: comissoes = [], isLoading } = trpc.comissoes.listar.useQuery(
    { dentistaId: dentistaId!, mes: mesFilter },
    { enabled: !!dentistaId }
  );

  // Buscar resumo
  const { data: resumo } = trpc.comissoes.resumo.useQuery(
    { dentistaId: dentistaId! },
    { enabled: !!dentistaId }
  );

  // Formatar moeda
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(valor);
  };

  // Formatar data
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/ajustes")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Comissões</h1>
              <p className="text-muted-foreground">
                {dentista?.nome || "Carregando..."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container py-8">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pendente</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {formatarMoeda(resumo?.totalPendente || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {resumo?.quantidadePendente || 0} comissão(ões)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatarMoeda(resumo?.totalPago || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {resumo?.quantidadePago || 0} comissão(ões)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Geral</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatarMoeda((resumo?.totalPendente || 0) + (resumo?.totalPago || 0))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {(resumo?.quantidadePendente || 0) + (resumo?.quantidadePago || 0)} comissão(ões)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média por Fatura</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {formatarMoeda(
                  ((resumo?.totalPendente || 0) + (resumo?.totalPago || 0)) /
                    Math.max((resumo?.quantidadePendente || 0) + (resumo?.quantidadePago || 0), 1)
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Por comissão</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Comissões */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Histórico de Comissões</CardTitle>
                <CardDescription>Lista de todas as comissões registadas</CardDescription>
              </div>
              <Select value={mesFilter} onValueChange={setMesFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione o mês" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={new Date().toISOString().slice(0, 7)}>
                    Mês Atual
                  </SelectItem>
                  <SelectItem
                    value={
                      new Date(new Date().setMonth(new Date().getMonth() - 1))
                        .toISOString()
                        .slice(0, 7)
                    }
                  >
                    Mês Anterior
                  </SelectItem>
                  <SelectItem value="all">Todos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                A carregar comissões...
              </div>
            ) : comissoes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma comissão encontrada</p>
                <p className="text-sm">
                  As comissões aparecerão aqui quando forem registadas
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Fatura</TableHead>
                    <TableHead>Utente</TableHead>
                    <TableHead>Valor Base</TableHead>
                    <TableHead>Percentagem</TableHead>
                    <TableHead>Comissão</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comissoes.map((comissao: any) => (
                    <TableRow key={comissao.id}>
                      <TableCell>{formatarData(comissao.mes)}</TableCell>
                      <TableCell className="font-medium">
                        {comissao.faturaId}
                      </TableCell>
                      <TableCell>{comissao.nomeUtente || "-"}</TableCell>
                      <TableCell>{formatarMoeda(comissao.valorBase || 0)}</TableCell>
                      <TableCell>{comissao.percentagem || 0}%</TableCell>
                      <TableCell className="font-bold">
                        {formatarMoeda(comissao.valor || 0)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            comissao.status === "pago"
                              ? "default"
                              : comissao.status === "pendente"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {comissao.status === "pago"
                            ? "Pago"
                            : comissao.status === "pendente"
                            ? "Pendente"
                            : "Cancelado"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

