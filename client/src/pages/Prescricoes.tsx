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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  FileText,
  Printer,
  X,
  Pill,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface Medicamento {
  medicamento: string;
  posologia: string;
  duracao: string;
  quantidade?: string;
}

export default function Prescricoes() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [prescricaoEditando, setPrescricaoEditando] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [pesquisa, setPesquisa] = useState("");

  // Form state
  const [utenteId, setUtenteId] = useState("");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [diagnostico, setDiagnostico] = useState("");
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([
    { medicamento: "", posologia: "", duracao: "", quantidade: "" },
  ]);
  const [observacoes, setObservacoes] = useState("");

  // Queries
  const { data: prescricoesData, isLoading, refetch } = trpc.prescricoes.listarPaginado.useQuery({
    page,
    pageSize,
  });

  const { data: utentes } = trpc.utentes.listar.useQuery();

  // Mutations
  const criarMutation = trpc.prescricoes.criar.useMutation({
    onSuccess: () => {
      toast.success("Prescrição criada com sucesso!");
      refetch();
      resetForm();
      setDialogAberto(false);
    },
    onError: (error) => {
      toast.error(`Erro ao criar prescrição: ${error.message}`);
    },
  });

  const atualizarMutation = trpc.prescricoes.atualizar.useMutation({
    onSuccess: () => {
      toast.success("Prescrição atualizada com sucesso!");
      refetch();
      resetForm();
      setDialogAberto(false);
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar prescrição: ${error.message}`);
    },
  });

  const eliminarMutation = trpc.prescricoes.eliminar.useMutation({
    onSuccess: () => {
      toast.success("Prescrição eliminada com sucesso!");
      refetch();
      setDeleteId(null);
    },
    onError: (error) => {
      toast.error(`Erro ao eliminar prescrição: ${error.message}`);
    },
  });

  const resetForm = () => {
    setUtenteId("");
    setData(new Date().toISOString().split("T")[0]);
    setDiagnostico("");
    setMedicamentos([{ medicamento: "", posologia: "", duracao: "", quantidade: "" }]);
    setObservacoes("");
    setPrescricaoEditando(null);
  };

  const adicionarMedicamento = () => {
    setMedicamentos([
      ...medicamentos,
      { medicamento: "", posologia: "", duracao: "", quantidade: "" },
    ]);
  };

  const removerMedicamento = (index: number) => {
    if (medicamentos.length > 1) {
      setMedicamentos(medicamentos.filter((_, i) => i !== index));
    }
  };

  const atualizarMedicamento = (index: number, field: keyof Medicamento, value: string) => {
    const novos = [...medicamentos];
    novos[index][field] = value;
    setMedicamentos(novos);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação
    const medicamentosValidos = medicamentos.filter(
      (m) => m.medicamento.trim() && m.posologia.trim() && m.duracao.trim()
    );

    if (medicamentosValidos.length === 0) {
      toast.error("Adicione pelo menos um medicamento completo");
      return;
    }

    if (!utenteId) {
      toast.error("Selecione um utente");
      return;
    }

    const dados = {
      utenteId,
      data,
      medicamentos: medicamentosValidos,
      diagnostico: diagnostico || null,
      observacoes: observacoes || null,
    };

    if (prescricaoEditando) {
      atualizarMutation.mutate({
        id: prescricaoEditando.id,
        dados,
      });
    } else {
      criarMutation.mutate(dados);
    }
  };

  const handleEditar = (prescricao: any) => {
    setPrescricaoEditando(prescricao);
    setUtenteId(prescricao.utenteId);
    setData(prescricao.data);
    setDiagnostico(prescricao.diagnostico || "");
    setMedicamentos(prescricao.medicamentos || []);
    setObservacoes(prescricao.observacoes || "");
    setDialogAberto(true);
  };

  const handleImprimir = (prescricao: any) => {
    const utente = utentes?.find((u) => u.id === prescricao.utenteId);
    
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const medicamentosHtml = prescricao.medicamentos
      .map(
        (m: Medicamento, i: number) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${i + 1}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>${m.medicamento}</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${m.posologia}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${m.duracao}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${m.quantidade || "-"}</td>
        </tr>
      `
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Prescrição Médica</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; }
            .info { margin-bottom: 20px; }
            .info-row { display: flex; margin-bottom: 8px; }
            .info-label { font-weight: bold; width: 150px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background-color: #f3f4f6; padding: 12px; text-align: left; border-bottom: 2px solid #000; }
            .footer { margin-top: 50px; border-top: 1px solid #000; padding-top: 20px; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>PRESCRIÇÃO MÉDICA</h1>
            <p>DentCarePro - Clínica Dentária</p>
          </div>
          
          <div class="info">
            <div class="info-row">
              <span class="info-label">Paciente:</span>
              <span>${utente?.nomeCompleto || "N/A"}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Data:</span>
              <span>${format(new Date(prescricao.data), "dd/MM/yyyy", { locale: pt })}</span>
            </div>
            ${prescricao.diagnostico ? `
            <div class="info-row">
              <span class="info-label">Diagnóstico:</span>
              <span>${prescricao.diagnostico}</span>
            </div>
            ` : ""}
          </div>

          <h3>Medicamentos Prescritos:</h3>
          <table>
            <thead>
              <tr>
                <th style="width: 40px;">#</th>
                <th>Medicamento</th>
                <th>Posologia</th>
                <th>Duração</th>
                <th>Quantidade</th>
              </tr>
            </thead>
            <tbody>
              ${medicamentosHtml}
            </tbody>
          </table>

          ${prescricao.observacoes ? `
          <div style="margin-top: 20px;">
            <strong>Observações:</strong>
            <p>${prescricao.observacoes}</p>
          </div>
          ` : ""}

          <div class="footer">
            <p>_____________________________________</p>
            <p style="text-align: center;">Assinatura e Carimbo do Médico</p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #000; color: #fff; border: none; cursor: pointer;">
              Imprimir
            </button>
            <button onclick="window.close()" style="padding: 10px 20px; background: #666; color: #fff; border: none; cursor: pointer; margin-left: 10px;">
              Fechar
            </button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
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
              <h1 className="text-3xl font-bold">Prescrições Médicas</h1>
              <p className="text-muted-foreground">Gestão de prescrições e medicamentos</p>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setDialogAberto(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Prescrição
            </Button>
          </div>

          {/* Estatísticas */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">
                      {prescricoesData?.total || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">Total de Prescrições</p>
                  </div>
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {prescricoesData?.prescricoes?.length || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">Nesta Página</p>
                  </div>
                  <Pill className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {prescricoesData?.totalPages || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">Páginas</p>
                  </div>
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pesquisa */}
          <div className="mt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar prescrições..."
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Prescrições */}
      <div className="container py-8">
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="py-12 text-center">
                <div className="animate-pulse text-muted-foreground">
                  A carregar prescrições...
                </div>
              </div>
            ) : !prescricoesData?.prescricoes || prescricoesData.prescricoes.length === 0 ? (
              <div className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Nenhuma prescrição encontrada</p>
                <Button className="mt-4" onClick={() => setDialogAberto(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeira Prescrição
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Utente</TableHead>
                    <TableHead>Diagnóstico</TableHead>
                    <TableHead>Medicamentos</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prescricoesData.prescricoes.map((prescricao) => (
                    <TableRow key={prescricao.id}>
                      <TableCell>{formatDate(prescricao.data)}</TableCell>
                      <TableCell>
                        {utentes?.find((u) => u.id === prescricao.utenteId)?.nomeCompleto ||
                          "N/A"}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {prescricao.diagnostico || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {prescricao.medicamentos?.length || 0} medicamento(s)
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleImprimir(prescricao)}
                            title="Imprimir"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditar(prescricao)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(prescricao.id)}
                            title="Eliminar"
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
        {prescricoesData && prescricoesData.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {page} de {prescricoesData.totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(prescricoesData.totalPages, p + 1))}
              disabled={page === prescricoesData.totalPages}
            >
              Próxima
            </Button>
          </div>
        )}
      </div>

      {/* Dialog de Criar/Editar */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {prescricaoEditando ? "Editar Prescrição" : "Nova Prescrição"}
            </DialogTitle>
            <DialogDescription>
              {prescricaoEditando
                ? "Atualize as informações da prescrição"
                : "Preencha os dados da nova prescrição médica"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="utenteId">Utente *</Label>
                  <Select value={utenteId} onValueChange={setUtenteId} required>
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
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="diagnostico">Diagnóstico</Label>
                <Input
                  id="diagnostico"
                  placeholder="Ex: Infecção dentária aguda"
                  value={diagnostico}
                  onChange={(e) => setDiagnostico(e.target.value)}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Medicamentos *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={adicionarMedicamento}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </div>

                <div className="space-y-4">
                  {medicamentos.map((med, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-2">
                          <div className="flex-1 grid gap-3">
                            <div>
                              <Label className="text-xs">Medicamento</Label>
                              <Input
                                placeholder="Ex: Amoxicilina 500mg"
                                value={med.medicamento}
                                onChange={(e) =>
                                  atualizarMedicamento(index, "medicamento", e.target.value)
                                }
                                required
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <Label className="text-xs">Posologia</Label>
                                <Input
                                  placeholder="1 comp. 8/8h"
                                  value={med.posologia}
                                  onChange={(e) =>
                                    atualizarMedicamento(index, "posologia", e.target.value)
                                  }
                                  required
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Duração</Label>
                                <Input
                                  placeholder="7 dias"
                                  value={med.duracao}
                                  onChange={(e) =>
                                    atualizarMedicamento(index, "duracao", e.target.value)
                                  }
                                  required
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Quantidade</Label>
                                <Input
                                  placeholder="21 comp."
                                  value={med.quantidade || ""}
                                  onChange={(e) =>
                                    atualizarMedicamento(index, "quantidade", e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          {medicamentos.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removerMedicamento(index)}
                              className="mt-5"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Observações adicionais sobre a prescrição..."
                  rows={3}
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setDialogAberto(false);
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={criarMutation.isPending || atualizarMutation.isPending}
              >
                {prescricaoEditando ? "Atualizar" : "Criar"} Prescrição
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Eliminação */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A prescrição será permanentemente eliminada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  eliminarMutation.mutate({ id: deleteId });
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

