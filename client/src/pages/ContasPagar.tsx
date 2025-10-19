/**
 * Página de Contas a Pagar
 * DentCare PRO - Módulo Financeiro
 */

import { useState } from "react";
import { trpc } from "../lib/trpc";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import {
  Plus,
  Search,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  FileText,
  TrendingDown,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ContasPagar() {
  const [dialogAberto, setDialogAberto] = useState(false);
  const [dialogPagamento, setDialogPagamento] = useState(false);
  const [contaSelecionada, setContaSelecionada] = useState<any>(null);
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [pesquisa, setPesquisa] = useState("");

  // Queries
  const { data: contas, refetch } = trpc.contasPagar.listar.useQuery({
    status: filtroStatus === "todos" ? undefined : filtroStatus,
  });

  const { data: estatisticas } = trpc.contasPagar.estatisticas.useQuery();

  const { data: categorias } = trpc.configuracoes.listarCategoriasDespesa.useQuery();

  const { data: fornecedores } = trpc.configuracoes.listarFornecedores.useQuery();

  // Mutations
  const criarMutation = trpc.contasPagar.criar.useMutation({
    onSuccess: () => {
      toast.success("Conta criada com sucesso!");
      refetch();
      setDialogAberto(false);
      setContaSelecionada(null);
    },
    onError: (error) => {
      toast.error(`Erro ao criar conta: ${error.message}`);
    },
  });

  const atualizarMutation = trpc.contasPagar.atualizar.useMutation({
    onSuccess: () => {
      toast.success("Conta atualizada com sucesso!");
      refetch();
      setDialogAberto(false);
      setContaSelecionada(null);
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar conta: ${error.message}`);
    },
  });

  const excluirMutation = trpc.contasPagar.excluir.useMutation({
    onSuccess: () => {
      toast.success("Conta excluída com sucesso!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao excluir conta: ${error.message}`);
    },
  });

  const registrarPagamentoMutation = trpc.contasPagar.registrarPagamento.useMutation({
    onSuccess: () => {
      toast.success("Pagamento registrado com sucesso!");
      refetch();
      setDialogPagamento(false);
      setContaSelecionada(null);
    },
    onError: (error) => {
      toast.error(`Erro ao registrar pagamento: ${error.message}`);
    },
  });

  const handleSalvar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dados = Object.fromEntries(formData.entries());

    const payload = {
      ...dados,
      valorTotal: parseFloat(dados.valorTotal as string),
      valorPago: parseFloat(dados.valorPago as string) || 0,
      recorrente: dados.recorrente === "true",
    };

    if (contaSelecionada) {
      atualizarMutation.mutate({
        id: contaSelecionada.id,
        ...payload,
      } as any);
    } else {
      criarMutation.mutate(payload as any);
    }
  };

  const handleRegistrarPagamento = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dados = Object.fromEntries(formData.entries());

    registrarPagamentoMutation.mutate({
      contaPagarId: contaSelecionada.id,
      dataPagamento: dados.dataPagamento as string,
      valorPago: parseFloat(dados.valorPago as string),
      formaPagamento: dados.formaPagamento as string,
      observacoes: dados.observacoes as string,
    });
  };

  const handleNovo = () => {
    setContaSelecionada(null);
    setDialogAberto(true);
  };

  const handleEditar = (conta: any) => {
    setContaSelecionada(conta);
    setDialogAberto(true);
  };

  const handlePagar = (conta: any) => {
    setContaSelecionada(conta);
    setDialogPagamento(true);
  };

  const handleExcluir = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta conta?")) {
      excluirMutation.mutate({ id });
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pendente: <Badge variant="outline" className="bg-yellow-50">Pendente</Badge>,
      pago_parcial: <Badge variant="outline" className="bg-blue-50">Pago Parcial</Badge>,
      pago: <Badge variant="outline" className="bg-green-50">Pago</Badge>,
      vencido: <Badge variant="destructive">Vencido</Badge>,
      cancelado: <Badge variant="secondary">Cancelado</Badge>,
    };
    return badges[status as keyof typeof badges] || status;
  };

  const formatCurrency = (value: number | string) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(num);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contas a Pagar</h1>
          <p className="text-muted-foreground">
            Gestão de despesas e pagamentos
          </p>
        </div>
        <Button onClick={handleNovo}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Conta
        </Button>
      </div>

      {/* Estatísticas */}
      {estatisticas && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Pendente
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(estatisticas.totalPendente)}
              </div>
              <p className="text-xs text-muted-foreground">
                {estatisticas.contasPendentes} contas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Vencido
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(estatisticas.totalVencido)}
              </div>
              <p className="text-xs text-muted-foreground">
                {estatisticas.contasVencidas} contas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Pago
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(estatisticas.totalPago)}
              </div>
              <p className="text-xs text-muted-foreground">
                Este período
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total do Mês
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(estatisticas.totalMes)}
              </div>
              <p className="text-xs text-muted-foreground">
                {format(new Date(), "MMMM yyyy", { locale: ptBR })}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar contas..."
                  value={pesquisa}
                  onChange={(e) => setPesquisa(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={filtroStatus}
              onValueChange={setFiltroStatus}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pendente">Pendentes</SelectItem>
                <SelectItem value="pago_parcial">Pago Parcial</SelectItem>
                <SelectItem value="vencido">Vencidos</SelectItem>
                <SelectItem value="pago">Pagos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Contas */}
      <Card>
        <CardHeader>
          <CardTitle>Contas a Pagar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contas?.map((conta) => {
              const valorTotal = parseFloat(conta.valorTotal);
              const valorPago = parseFloat(conta.valorPago || "0");
              const saldo = valorTotal - valorPago;
              const dataVencimento = new Date(conta.dataVencimento);
              const hoje = new Date();
              const vencido = dataVencimento < hoje && conta.status !== "pago";

              return (
                <div
                  key={conta.id}
                  className={`p-4 border rounded-lg ${
                    vencido ? "border-red-300 bg-red-50" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{conta.descricao}</h3>
                        {getStatusBadge(conta.status)}
                        {vencido && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Vencido
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Vencimento:</span>{" "}
                          {format(dataVencimento, "dd/MM/yyyy")}
                        </div>
                        <div>
                          <span className="font-medium">Valor Total:</span>{" "}
                          {formatCurrency(valorTotal)}
                        </div>
                        {valorPago > 0 && (
                          <>
                            <div>
                              <span className="font-medium">Pago:</span>{" "}
                              {formatCurrency(valorPago)}
                            </div>
                            <div>
                              <span className="font-medium">Saldo:</span>{" "}
                              {formatCurrency(saldo)}
                            </div>
                          </>
                        )}
                      </div>

                      {conta.observacoes && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {conta.observacoes}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {conta.status !== "pago" && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handlePagar(conta)}
                        >
                          <DollarSign className="h-4 w-4 mr-1" />
                          Pagar
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditar(conta)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExcluir(conta.id)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            {contas?.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Nenhuma conta encontrada
                </h3>
                <p className="text-muted-foreground mb-4">
                  Comece adicionando uma nova conta a pagar
                </p>
                <Button onClick={handleNovo}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Conta
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Criar/Editar */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {contaSelecionada ? "Editar" : "Nova"} Conta a Pagar
            </DialogTitle>
            <DialogDescription>
              Preencha os dados da despesa
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSalvar} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="descricao">Descrição *</Label>
                <Input
                  id="descricao"
                  name="descricao"
                  defaultValue={contaSelecionada?.descricao}
                  required
                />
              </div>

              <div>
                <Label htmlFor="categoriaId">Categoria *</Label>
                <Select
                  name="categoriaId"
                  defaultValue={contaSelecionada?.categoriaId}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icone} {cat.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="fornecedorId">Fornecedor</Label>
                <Select
                  name="fornecedorId"
                  defaultValue={contaSelecionada?.fornecedorId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {fornecedores?.map((forn) => (
                      <SelectItem key={forn.id} value={forn.id}>
                        {forn.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="numeroDocumento">Nº Documento</Label>
                <Input
                  id="numeroDocumento"
                  name="numeroDocumento"
                  defaultValue={contaSelecionada?.numeroDocumento}
                />
              </div>

              <div>
                <Label htmlFor="dataEmissao">Data Emissão *</Label>
                <Input
                  id="dataEmissao"
                  name="dataEmissao"
                  type="date"
                  defaultValue={contaSelecionada?.dataEmissao}
                  required
                />
              </div>

              <div>
                <Label htmlFor="dataVencimento">Data Vencimento *</Label>
                <Input
                  id="dataVencimento"
                  name="dataVencimento"
                  type="date"
                  defaultValue={contaSelecionada?.dataVencimento}
                  required
                />
              </div>

              <div>
                <Label htmlFor="valorTotal">Valor Total (€) *</Label>
                <Input
                  id="valorTotal"
                  name="valorTotal"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={contaSelecionada?.valorTotal}
                  required
                />
              </div>

              <div>
                <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
                <Select
                  name="formaPagamento"
                  defaultValue={contaSelecionada?.formaPagamento}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="multibanco">Multibanco</SelectItem>
                    <SelectItem value="mbway">MB WAY</SelectItem>
                    <SelectItem value="transferencia">Transferência</SelectItem>
                    <SelectItem value="debito_direto">Débito Direto</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  name="observacoes"
                  rows={3}
                  defaultValue={contaSelecionada?.observacoes}
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
              <Button type="submit">
                {contaSelecionada ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Pagamento */}
      <Dialog open={dialogPagamento} onOpenChange={setDialogPagamento}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Pagamento</DialogTitle>
            <DialogDescription>
              {contaSelecionada?.descricao}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRegistrarPagamento} className="space-y-4">
            {contaSelecionada && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Valor Total:</span>
                  <span className="font-semibold">
                    {formatCurrency(contaSelecionada.valorTotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Valor Pago:</span>
                  <span className="font-semibold">
                    {formatCurrency(contaSelecionada.valorPago || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Saldo:</span>
                  <span className="text-red-600">
                    {formatCurrency(
                      parseFloat(contaSelecionada.valorTotal) -
                        parseFloat(contaSelecionada.valorPago || "0")
                    )}
                  </span>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="dataPagamento">Data do Pagamento *</Label>
              <Input
                id="dataPagamento"
                name="dataPagamento"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div>
              <Label htmlFor="valorPago">Valor a Pagar (€) *</Label>
              <Input
                id="valorPago"
                name="valorPago"
                type="number"
                step="0.01"
                min="0.01"
                max={
                  contaSelecionada
                    ? parseFloat(contaSelecionada.valorTotal) -
                      parseFloat(contaSelecionada.valorPago || "0")
                    : undefined
                }
                defaultValue={
                  contaSelecionada
                    ? parseFloat(contaSelecionada.valorTotal) -
                      parseFloat(contaSelecionada.valorPago || "0")
                    : undefined
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="formaPagamento">Forma de Pagamento *</Label>
              <Select name="formaPagamento" required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="multibanco">Multibanco</SelectItem>
                  <SelectItem value="mbway">MB WAY</SelectItem>
                  <SelectItem value="transferencia">Transferência</SelectItem>
                  <SelectItem value="debito_direto">Débito Direto</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea id="observacoes" name="observacoes" rows={2} />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogPagamento(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Confirmar Pagamento</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

