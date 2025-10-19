// @ts-nocheck
/**
 * Modal para Criar Nova Fatura
 * DentCare PRO v8.0 - Com cálculo de comissões
 */

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Save, User, DollarSign } from "lucide-react";
import { trpc } from "@/lib/trpc";
import type { ItemFatura } from "@shared/types-financeiro";
import { Card, CardContent } from "@/components/ui/card";

interface ModalNovaFaturaProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ModalNovaFatura({ open, onClose, onSuccess }: ModalNovaFaturaProps) {
  const [utenteId, setUtenteId] = useState("");
  const [dentistaId, setDentistaId] = useState("");
  const [dataVencimento, setDataVencimento] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [itens, setItens] = useState<Partial<ItemFatura>[]>([
    {
      descricao: "",
      quantidade: 1,
      precoUnitario: 0,
      desconto: 0,
      iva: 23,
      categoria: "consulta",
    },
  ]);

  // Queries
  const { data: utentes = [] } = trpc.utentes.listar.useQuery();
  const { data: dentistas = [] } = trpc.dentistas.listar.useQuery();
  
  // Buscar dados do dentista selecionado
  const { data: dentistaSelecionado } = trpc.dentistas.obter.useQuery(
    { id: dentistaId },
    { enabled: !!dentistaId }
  );

  const criarFatura = trpc.financeiro.criar.useMutation({
    onSuccess: () => {
      onSuccess();
      resetForm();
    },
  });

  const resetForm = () => {
    setUtenteId("");
    setDentistaId("");
    setDataVencimento("");
    setObservacoes("");
    setItens([
      {
        descricao: "",
        quantidade: 1,
        precoUnitario: 0,
        desconto: 0,
        iva: 23,
        categoria: "consulta",
      },
    ]);
  };

  const adicionarItem = () => {
    setItens([
      ...itens,
      {
        descricao: "",
        quantidade: 1,
        precoUnitario: 0,
        desconto: 0,
        iva: 23,
        categoria: "tratamento",
      },
    ]);
  };

  const removerItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const atualizarItem = (index: number, campo: string, valor: any) => {
    const novosItens = [...itens];
    novosItens[index] = { ...novosItens[index], [campo]: valor };
    setItens(novosItens);
  };

  const calcularSubtotal = () => {
    return itens.reduce((total, item) => {
      const valorSemDesconto = (item.quantidade || 0) * (item.precoUnitario || 0);
      const valorDesconto = valorSemDesconto * ((item.desconto || 0) / 100);
      return total + (valorSemDesconto - valorDesconto);
    }, 0);
  };

  const calcularIVA = () => {
    return itens.reduce((total, item) => {
      const valorSemDesconto = (item.quantidade || 0) * (item.precoUnitario || 0);
      const valorDesconto = valorSemDesconto * ((item.desconto || 0) / 100);
      const valorComDesconto = valorSemDesconto - valorDesconto;
      const valorIva = valorComDesconto * ((item.iva || 0) / 100);
      return total + valorIva;
    }, 0);
  };

  const calcularTotal = () => {
    return calcularSubtotal() + calcularIVA();
  };

  const calcularComissao = () => {
    if (!dentistaSelecionado?.percentagemComissao) return 0;
    const subtotal = calcularSubtotal();
    return subtotal * (dentistaSelecionado.percentagemComissao / 100);
  };

  const calcularValorClinica = () => {
    return calcularSubtotal() - calcularComissao();
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(valor);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!utenteId || !dentistaId || !dataVencimento || itens.length === 0) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const utente = utentes.find((u) => u.id === utenteId);
    if (!utente) {
      alert("Utente não encontrado");
      return;
    }

    const dentista = dentistas.find((d) => d.id === dentistaId);
    if (!dentista) {
      alert("Dentista não encontrado");
      return;
    }

    criarFatura.mutate({
      utenteId,
      utenteNome: utente.nomeCompleto,
      utenteNif: utente.nif,
      utenteMorada: utente.morada
        ? `${utente.morada.rua}, ${utente.morada.numero}, ${utente.morada.codigoPostal} ${utente.morada.localidade}`
        : undefined,
      dentistaId: dentista.id,
      dentista: dentista.nome,
      dentistaPercentagem: dentista.percentagemComissao || 0,
      dentistaComissao: calcularComissao(),
      dataVencimento,
      itens: itens.map((item) => ({
        descricao: item.descricao || "",
        quantidade: item.quantidade || 1,
        precoUnitario: item.precoUnitario || 0,
        desconto: item.desconto || 0,
        iva: item.iva || 23,
        categoria: item.categoria || "outro",
      })),
      observacoes: observacoes || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Fatura</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados do Utente e Dentista */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="utente">
                <User className="inline h-4 w-4 mr-1" />
                Utente *
              </Label>
              <Select value={utenteId} onValueChange={setUtenteId}>
                <SelectTrigger id="utente">
                  <SelectValue placeholder="Selecione o utente" />
                </SelectTrigger>
                <SelectContent>
                  {utentes.map((utente) => (
                    <SelectItem key={utente.id} value={utente.id}>
                      {utente.nomeCompleto} {utente.numeroUtente && `(${utente.numeroUtente})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dentista">
                <User className="inline h-4 w-4 mr-1" />
                Dentista *
              </Label>
              <Select value={dentistaId} onValueChange={setDentistaId}>
                <SelectTrigger id="dentista">
                  <SelectValue placeholder="Selecione o dentista" />
                </SelectTrigger>
                <SelectContent>
                  {dentistas.map((dentista) => (
                    <SelectItem key={dentista.id} value={dentista.id}>
                      {dentista.nome} {dentista.percentagemComissao && `(${dentista.percentagemComissao}%)`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {dentistaSelecionado && (
                <p className="text-xs text-muted-foreground">
                  Comissão: {dentistaSelecionado.percentagemComissao}%
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataVencimento">Data de Vencimento *</Label>
              <Input
                id="dataVencimento"
                type="date"
                value={dataVencimento}
                onChange={(e) => setDataVencimento(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Itens da Fatura */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Itens da Fatura</Label>
              <Button type="button" variant="outline" size="sm" onClick={adicionarItem}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
            </div>

            <div className="space-y-4">
              {itens.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Item {index + 1}</span>
                    {itens.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removerItem(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label>Descrição *</Label>
                      <Input
                        value={item.descricao}
                        onChange={(e) => atualizarItem(index, "descricao", e.target.value)}
                        placeholder="Ex: Consulta de avaliação"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Categoria</Label>
                      <Select
                        value={item.categoria}
                        onValueChange={(value) => atualizarItem(index, "categoria", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consulta">Consulta</SelectItem>
                          <SelectItem value="tratamento">Tratamento</SelectItem>
                          <SelectItem value="material">Material</SelectItem>
                          <SelectItem value="laboratorio">Laboratório</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Quantidade *</Label>
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        value={item.quantidade}
                        onChange={(e) =>
                          atualizarItem(index, "quantidade", parseFloat(e.target.value))
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Preço Unitário (€) *</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.precoUnitario}
                        onChange={(e) =>
                          atualizarItem(index, "precoUnitario", parseFloat(e.target.value))
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Desconto (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={item.desconto}
                        onChange={(e) =>
                          atualizarItem(index, "desconto", parseFloat(e.target.value))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>IVA (%)</Label>
                      <Select
                        value={String(item.iva)}
                        onValueChange={(value) => atualizarItem(index, "iva", parseFloat(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0%</SelectItem>
                          <SelectItem value="6">6%</SelectItem>
                          <SelectItem value="13">13%</SelectItem>
                          <SelectItem value="23">23%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumo Financeiro */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal (sem IVA):</span>
                  <span className="font-medium">{formatarMoeda(calcularSubtotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>IVA:</span>
                  <span className="font-medium">{formatarMoeda(calcularIVA())}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>Total (com IVA):</span>
                  <span>{formatarMoeda(calcularTotal())}</span>
                </div>

                {dentistaSelecionado && dentistaSelecionado.percentagemComissao > 0 && (
                  <>
                    <div className="border-t pt-3 mt-3">
                      <p className="text-xs text-muted-foreground mb-2">Discriminação de Comissões:</p>
                      <div className="flex justify-between text-sm text-blue-600">
                        <span>
                          <DollarSign className="inline h-3 w-3" />
                          Comissão Dentista ({dentistaSelecionado.percentagemComissao}%):
                        </span>
                        <span className="font-semibold">{formatarMoeda(calcularComissao())}</span>
                      </div>
                      <div className="flex justify-between text-sm text-green-600 mt-1">
                        <span>
                          <DollarSign className="inline h-3 w-3" />
                          Valor Clínica:
                        </span>
                        <span className="font-semibold">{formatarMoeda(calcularValorClinica())}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Observações adicionais..."
              rows={3}
            />
          </div>

          {/* Botões */}
          <div className="flex items-center justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={criarFatura.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {criarFatura.isPending ? "A criar..." : "Criar Fatura"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

