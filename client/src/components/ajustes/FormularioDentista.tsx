// @ts-nocheck
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Save, X } from "lucide-react";

const ESPECIALIDADES = [
  "Clínica Geral",
  "Ortodontia",
  "Implantologia",
  "Endodontia",
  "Periodontia",
  "Prostodontia",
  "Cirurgia Oral",
  "Odontopediatria",
  "Dentisteria Estética",
  "Radiologia",
  "Patologia Oral",
];

export default function FormularioDentista({ dentista, onSucesso, onCancelar }) {
  const criarMutation = trpc.dentistas.criar.useMutation();
  const atualizarMutation = trpc.dentistas.atualizar.useMutation();

  const [formData, setFormData] = useState({
    nome: "",
    nomeCompleto: "",
    nif: "",
    numeroOrdem: "",
    especialidades: [],
    email: "",
    telefone: "",
    telemovel: "",
    dataAdmissao: new Date().toISOString().split("T")[0],
    cargo: "",
    corAgenda: "#3b82f6",
    tempoConsultaPadrao: 30,
    observacoes: "",
    // Configuração de Comissões
    tipoComissao: "percentagem",
    percentagemComissao: 30,
    valorFixoComissao: 0,
    valorMinimoComissao: 0,
    valorMaximoComissao: 0,
  });

  useEffect(() => {
    if (dentista) {
      setFormData({
        nome: dentista.nome || "",
        nomeCompleto: dentista.nomeCompleto || "",
        nif: dentista.nif || "",
        numeroOrdem: dentista.numeroOrdem || "",
        especialidades: typeof dentista.especialidades === "string"
          ? JSON.parse(dentista.especialidades)
          : dentista.especialidades || [],
        email: dentista.email || "",
        telefone: dentista.telefone || "",
        telemovel: dentista.telemovel || "",
        dataAdmissao: dentista.dataAdmissao || new Date().toISOString().split("T")[0],
        cargo: dentista.cargo || "",
        corAgenda: dentista.corAgenda || "#3b82f6",
        tempoConsultaPadrao: dentista.tempoConsultaPadrao || 30,
        observacoes: dentista.observacoes || "",
        // Configuração de Comissões
        tipoComissao: dentista.tipoComissao || "percentagem",
        percentagemComissao: dentista.percentagemComissao || 30,
        valorFixoComissao: dentista.valorFixoComissao || 0,
        valorMinimoComissao: dentista.valorMinimoComissao || 0,
        valorMaximoComissao: dentista.valorMaximoComissao || 0,
      });
    }
  }, [dentista]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (dentista) {
        // Atualizar
        await atualizarMutation.mutateAsync({
          id: dentista.id,
          dados: formData,
        });
        toast.success("Dentista atualizado com sucesso!");
      } else {
        // Criar
        await criarMutation.mutateAsync(formData);
        toast.success("Dentista cadastrado com sucesso!");
      }
      onSucesso();
    } catch (error) {
      toast.error("Erro ao salvar dentista");
      console.error(error);
    }
  };

  const toggleEspecialidade = (esp: string) => {
    setFormData({
      ...formData,
      especialidades: formData.especialidades.includes(esp)
        ? formData.especialidades.filter((e) => e !== esp)
        : [...formData.especialidades, esp],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dados Pessoais */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Dados Pessoais</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nome">Nome (Abreviado) *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Dr. Silva"
              required
            />
          </div>
          <div>
            <Label htmlFor="nomeCompleto">Nome Completo *</Label>
            <Input
              id="nomeCompleto"
              value={formData.nomeCompleto}
              onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
              placeholder="Dr. João Silva Santos"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nif">NIF *</Label>
            <Input
              id="nif"
              value={formData.nif}
              onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
              placeholder="123456789"
              maxLength={9}
              required
            />
          </div>
          <div>
            <Label htmlFor="numeroOrdem">Número da Ordem *</Label>
            <Input
              id="numeroOrdem"
              value={formData.numeroOrdem}
              onChange={(e) => setFormData({ ...formData, numeroOrdem: e.target.value })}
              placeholder="OM12345"
              required
            />
          </div>
        </div>
      </div>

      {/* Especialidades */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Especialidades *</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {ESPECIALIDADES.map((esp) => (
            <label
              key={esp}
              className={`flex items-center gap-2 p-3 border rounded cursor-pointer transition-colors ${
                formData.especialidades.includes(esp)
                  ? "bg-blue-50 border-blue-500"
                  : "hover:bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                checked={formData.especialidades.includes(esp)}
                onChange={() => toggleEspecialidade(esp)}
                className="rounded"
              />
              <span className="text-sm">{esp}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Contactos */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Contactos</h3>
        
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="dentista@clinica.pt"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="telefone">Telefone *</Label>
            <Input
              id="telefone"
              type="tel"
              value={formData.telefone}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              placeholder="+351 21 123 4567"
              required
            />
          </div>
          <div>
            <Label htmlFor="telemovel">Telemóvel</Label>
            <Input
              id="telemovel"
              type="tel"
              value={formData.telemovel}
              onChange={(e) => setFormData({ ...formData, telemovel: e.target.value })}
              placeholder="+351 91 234 5678"
            />
          </div>
        </div>
      </div>

      {/* Profissional */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Informações Profissionais</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dataAdmissao">Data de Admissão *</Label>
            <Input
              id="dataAdmissao"
              type="date"
              value={formData.dataAdmissao}
              onChange={(e) => setFormData({ ...formData, dataAdmissao: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="cargo">Cargo</Label>
            <Input
              id="cargo"
              value={formData.cargo}
              onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
              placeholder="Dentista Sénior"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="corAgenda">Cor na Agenda</Label>
            <Input
              id="corAgenda"
              type="color"
              value={formData.corAgenda}
              onChange={(e) => setFormData({ ...formData, corAgenda: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="tempoConsultaPadrao">Tempo Consulta Padrão (min)</Label>
            <Input
              id="tempoConsultaPadrao"
              type="number"
              value={formData.tempoConsultaPadrao}
              onChange={(e) => setFormData({ ...formData, tempoConsultaPadrao: parseInt(e.target.value) })}
              min={15}
              step={15}
            />
          </div>
        </div>
      </div>

      {/* Configuração de Comissões */}
      <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <h3 className="font-semibold text-purple-900 flex items-center gap-2">
          <span className="text-lg">💰</span>
          Configuração de Comissões
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tipo de Comissão */}
          <div>
            <Label htmlFor="tipoComissao">Tipo de Comissão *</Label>
            <Select
              value={formData.tipoComissao}
              onValueChange={(value) => setFormData({ ...formData, tipoComissao: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentagem">Percentagem</SelectItem>
                <SelectItem value="fixo">Valor Fixo (Diária)</SelectItem>
                <SelectItem value="misto">Misto (Percentagem + Fixo)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Percentagem */}
          {(formData.tipoComissao === "percentagem" || formData.tipoComissao === "misto") && (
            <div>
              <Label htmlFor="percentagemComissao">Percentagem (%)</Label>
              <Input
                id="percentagemComissao"
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={formData.percentagemComissao}
                onChange={(e) => setFormData({ ...formData, percentagemComissao: parseFloat(e.target.value) || 0 })}
                placeholder="30"
              />
            </div>
          )}

          {/* Valor Fixo */}
          {(formData.tipoComissao === "fixo" || formData.tipoComissao === "misto") && (
            <div>
              <Label htmlFor="valorFixoComissao">Valor Fixo (€)</Label>
              <Input
                id="valorFixoComissao"
                type="number"
                min="0"
                step="0.01"
                value={formData.valorFixoComissao}
                onChange={(e) => setFormData({ ...formData, valorFixoComissao: parseFloat(e.target.value) || 0 })}
                placeholder="150.00"
              />
            </div>
          )}

          {/* Valor Mínimo */}
          <div>
            <Label htmlFor="valorMinimoComissao">Valor Mínimo (€) <span className="text-xs text-gray-500">(opcional)</span></Label>
            <Input
              id="valorMinimoComissao"
              type="number"
              min="0"
              step="0.01"
              value={formData.valorMinimoComissao}
              onChange={(e) => setFormData({ ...formData, valorMinimoComissao: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
            />
          </div>

          {/* Valor Máximo */}
          <div>
            <Label htmlFor="valorMaximoComissao">Valor Máximo (€) <span className="text-xs text-gray-500">(opcional)</span></Label>
            <Input
              id="valorMaximoComissao"
              type="number"
              min="0"
              step="0.01"
              value={formData.valorMaximoComissao}
              onChange={(e) => setFormData({ ...formData, valorMaximoComissao: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Exemplo de Cálculo */}
        <div className="bg-white p-3 rounded border border-purple-300">
          <p className="text-sm font-medium text-purple-900 mb-1">Exemplo de cálculo:</p>
          <p className="text-xs text-gray-600">
            {formData.tipoComissao === "percentagem" && (
              `Para uma fatura de 100€, a comissão será ${formData.percentagemComissao}% = ${(100 * formData.percentagemComissao / 100).toFixed(2)}€`
            )}
            {formData.tipoComissao === "fixo" && (
              `Comissão fixa de ${formData.valorFixoComissao.toFixed(2)}€ por dia/consulta`
            )}
            {formData.tipoComissao === "misto" && (
              `Para uma fatura de 100€, a comissão será ${formData.percentagemComissao}% + ${formData.valorFixoComissao.toFixed(2)}€ = ${(100 * formData.percentagemComissao / 100 + formData.valorFixoComissao).toFixed(2)}€`
            )}
          </p>
        </div>
      </div>

      {/* Observações */}
      <div>
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          value={formData.observacoes}
          onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
          placeholder="Notas adicionais sobre o dentista..."
          rows={3}
        />
      </div>

      {/* Botões */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancelar}>
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={criarMutation.isPending || atualizarMutation.isPending}
        >
          <Save className="w-4 h-4 mr-2" />
          {criarMutation.isPending || atualizarMutation.isPending
            ? "Salvando..."
            : dentista
            ? "Atualizar"
            : "Cadastrar"}
        </Button>
      </div>
    </form>
  );
}

