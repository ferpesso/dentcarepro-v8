// @ts-nocheck
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Filter,
  Euro,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

export default function Tratamentos() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [filtroStatus, setFiltroStatus] = useState<string | undefined>();
  const [dialogAberto, setDialogAberto] = useState(false);
  const [tratamentoEditando, setTratamentoEditando] = useState<any>(null);
  const [pesquisa, setPesquisa] = useState("");

  // Queries
  const { data: tratamentosData, isLoading, refetch } = trpc.tratamentos.listarPaginado.useQuery({
    page,
    pageSize,
    status: filtroStatus as any,
  });

  const { data: estatisticas } = trpc.tratamentos.estatisticas.useQuery({});
  const { data: utentes } = trpc.utentes.listar.useQuery();

  // Mutations
  const criarMutation = trpc.tratamentos.criar.useMutation({
    onSuccess: () => {
      toast.success("Tratamento criado com sucesso!");
      refetch();
      setDialogAberto(false);
      setTratamentoEditando(null);
    },
    onError: (error) => {
      toast.error(`Erro ao criar tratamento: ${error.message}`);
    },
  });

  const atualizarMutation = trpc.tratamentos.atualizar.useMutation({
    onSuccess: () => {
      toast.success("Tratamento atualizado com sucesso!");
      refetch();
      setDialogAberto(false);
      setTratamentoEditando(null);
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar tratamento: ${error.message}`);
    },
  });

  const deletarMutation = trpc.tratamentos.deletar.useMutation({
    onSuccess: () => {
      toast.success("Tratamento deletado com sucesso!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao deletar tratamento: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const dados = {
      utenteId: formData.get("utenteId") as string,
      data: formData.get("data") as string,
      dente: formData.get("dente") as string || null,
      procedimento: formData.get("procedimento") as string,
      descricao: formData.get("descricao") as string || null,
      valor: Number(formData.get("valor")) || 0,
      valorPago: Number(formData.get("valorPago")) || 0,
      status: formData.get("status") as any,
      observacoes: formData.get("observacoes") as string || null,
    };

    if (tratamentoEditando) {
      atualizarMutation.mutate({ id: tratamentoEditando.id, dados });
    } else {
      criarMutation.mutate(dados);
    }
  };

  const handleEditar = (tratamento: any) => {
    setTratamentoEditando(tratamento);
    setDialogAberto(true);
  };

  const handleDeletar = (id: string) => {
    if (confirm("Tem certeza que deseja deletar este tratamento?")) {
      deletarMutation.mutate({ id });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any; label: string }> = {
      planeado: { variant: "secondary", icon: Clock, label: "Planeado" },
      em_andamento: { variant: "default", icon: TrendingUp, label: "Em Andamento" },
      concluido: { variant: "outline", icon: CheckCircle2, label: "Concluído" },
      cancelado: { variant: "destructive", icon: XCircle, label: "Cancelado" },
    };

    const config = variants[status] || variants.planeado;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant as any} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: pt });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Tratamentos</h1>
              <p className="text-muted-foreground">Gestão de planos e tratamentos dentários</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  toast.info("Funcionalidade de exportação em desenvolvimento");
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar Excel
              </Button>
              <Button
                onClick={() => {
                  setTratamentoEditando(null);
                  setDialogAberto(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Novo Tratamento
              </Button>
            </div>
          </div>

          {/* Estatísticas */}
          {estatisticas && (
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{estatisticas.total}</div>
                      <p className="text-sm text-muted-foreground">Total</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-orange-600">{estatisticas.planeados}</div>
                      <p className="text-sm text-muted-foreground">Planeados</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{estatisticas.emAndamento}</div>
                      <p className="text-sm text-muted-foreground">Em Andamento</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{estatisticas.concluidos}</div>
                      <p className="text-sm text-muted-foreground">Concluídos</p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-emerald-600">
                        {formatCurrency(estatisticas.valorTotal)}
                      </div>
                      <p className="text-sm text-muted-foreground">Valor Total</p>
                    </div>
                    <Euro className="h-8 w-8 text-emerald-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filtros */}
          <div className="flex gap-4 mt-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar tratamentos..."
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filtroStatus} onValueChange={(value) => setFiltroStatus(value === "todos" ? undefined : value)}>
              <SelectTrigger className="w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="planeado">Planeados</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="concluido">Concluídos</SelectItem>
                <SelectItem value="cancelado">Cancelados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tabela de Tratamentos */}
      <div className="container py-8">
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="py-12 text-center">
                <div className="animate-pulse text-muted-foreground">A carregar tratamentos...</div>
              </div>
            ) : !tratamentosData?.tratamentos || tratamentosData.tratamentos.length === 0 ? (
              <div className="py-12 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Nenhum tratamento encontrado</p>
                <Button className="mt-4" onClick={() => setDialogAberto(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeiro Tratamento
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Utente</TableHead>
                    <TableHead>Dente</TableHead>
                    <TableHead>Procedimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-right">Pago</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tratamentosData.tratamentos.map((tratamento) => (
                    <TableRow key={tratamento.id}>
                      <TableCell>{formatDate(tratamento.data)}</TableCell>
                      <TableCell>
                        {utentes?.find((u) => u.id === tratamento.utenteId)?.nomeCompleto || "N/A"}
                      </TableCell>
                      <TableCell>{tratamento.dente || "-"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{tratamento.procedimento}</TableCell>
                      <TableCell>{getStatusBadge(tratamento.status)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(tratamento.valor)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(tratamento.valorPago)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditar(tratamento)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletar(tratamento.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Paginação */}
        {tratamentosData && tratamentosData.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {page} de {tratamentosData.totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(tratamentosData.totalPages, p + 1))}
              disabled={page === tratamentosData.totalPages}
            >
              Próxima
            </Button>
          </div>
        )}
      </div>

      {/* Dialog de Criar/Editar */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {tratamentoEditando ? "Editar Tratamento" : "Novo Tratamento"}
            </DialogTitle>
            <DialogDescription>
              {tratamentoEditando
                ? "Atualize as informações do tratamento"
                : "Preencha os dados do novo tratamento"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="utenteId">Utente *</Label>
                  <Select
                    name="utenteId"
                    defaultValue={tratamentoEditando?.utenteId}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o utente" />
                    </SelectTrigger>
                    <SelectContent>
                      {utentes?.map((utente) => (
                        <SelectItem key={utente.id} value={utente.id}>
                          {utente.nomeCompleto}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="data">Data *</Label>
                  <Input
                    id="data"
                    name="data"
                    type="date"
                    defaultValue={tratamentoEditando?.data}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dente">Dente</Label>
                  <Input
                    id="dente"
                    name="dente"
                    placeholder="Ex: 16, 21, 36..."
                    defaultValue={tratamentoEditando?.dente || ""}
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    name="status"
                    defaultValue={tratamentoEditando?.status || "planeado"}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planeado">Planeado</SelectItem>
                      <SelectItem value="em_andamento">Em Andamento</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="procedimento">Procedimento *</Label>
                <Input
                  id="procedimento"
                  name="procedimento"
                  placeholder="Ex: Restauração em Resina Composta"
                  defaultValue={tratamentoEditando?.procedimento || ""}
                  required
                />
              </div>

              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  placeholder="Detalhes do tratamento..."
                  rows={3}
                  defaultValue={tratamentoEditando?.descricao || ""}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="valor">Valor (€) *</Label>
                  <Input
                    id="valor"
                    name="valor"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    defaultValue={tratamentoEditando?.valor || ""}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="valorPago">Valor Pago (€)</Label>
                  <Input
                    id="valorPago"
                    name="valorPago"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    defaultValue={tratamentoEditando?.valorPago || ""}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  name="observacoes"
                  placeholder="Observações adicionais..."
                  rows={2}
                  defaultValue={tratamentoEditando?.observacoes || ""}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogAberto(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={criarMutation.isPending || atualizarMutation.isPending}
              >
                {tratamentoEditando ? "Atualizar" : "Criar"} Tratamento
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

