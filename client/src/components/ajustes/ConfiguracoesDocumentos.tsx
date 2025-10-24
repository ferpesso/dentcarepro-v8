// @ts-nocheck
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Save,
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ConfiguracoesDocumentos() {
  const { data: templates, refetch } = trpc.consentimentos.listarTemplates.useQuery();
  const criarTemplateMutation = trpc.consentimentos.criarTemplate.useMutation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const [formData, setFormData] = useState({
    titulo: "",
    categoria: "tratamento_geral",
    conteudo: "",
  });

  const categorias = [
    { value: "tratamento_geral", label: "Tratamento Geral" },
    { value: "cirurgia", label: "Cirurgia" },
    { value: "implante", label: "Implante" },
    { value: "ortodontia", label: "Ortodontia" },
    { value: "endodontia", label: "Endodontia" },
    { value: "estetica", label: "Estética" },
    { value: "anestesia", label: "Anestesia" },
    { value: "radiografia", label: "Radiografia" },
    { value: "outros", label: "Outros" },
  ];

  const handleSave = async () => {
    try {
      await criarTemplateMutation.mutateAsync(formData);
      toast.success("Template criado com sucesso!");
      setDialogOpen(false);
      setFormData({ titulo: "", categoria: "tratamento_geral", conteudo: "" });
      refetch();
    } catch (error) {
      toast.error("Erro ao criar template");
      console.error(error);
    }
  };

  const handleEdit = (template: any) => {
    setEditingTemplate(template);
    setFormData({
      titulo: template.titulo,
      categoria: template.categoria,
      conteudo: template.conteudo,
    });
    setDialogOpen(true);
  };

  const handleDuplicate = (template: any) => {
    setFormData({
      titulo: `${template.titulo} (Cópia)`,
      categoria: template.categoria,
      conteudo: template.conteudo,
    });
    setDialogOpen(true);
  };

  const variaveis = [
    { var: "[NOME_PACIENTE]", desc: "Nome completo do paciente" },
    { var: "[NIF_PACIENTE]", desc: "NIF do paciente" },
    { var: "[DATA_NASCIMENTO]", desc: "Data de nascimento" },
    { var: "[NOME_DENTISTA]", desc: "Nome do dentista" },
    { var: "[CRO_DENTISTA]", desc: "Número de registro do dentista" },
    { var: "[NOME_CLINICA]", desc: "Nome da clínica" },
    { var: "[DATA_ATUAL]", desc: "Data atual" },
    { var: "[PROCEDIMENTO]", desc: "Descrição do procedimento" },
  ];

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Templates de Documentos</h2>
          <p className="text-gray-600">
            Gerencie templates para consentimentos, faturas e outros documentos
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? "Editar Template" : "Novo Template"}
              </DialogTitle>
              <DialogDescription>
                Crie ou edite templates de documentos para sua clínica
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título do Template</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Ex: Consentimento para Implante"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <select
                    id="categoria"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {categorias.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Variáveis Disponíveis */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Variáveis Disponíveis</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {variaveis.map((v) => (
                    <div key={v.var} className="flex items-start gap-2">
                      <code className="bg-blue-100 px-2 py-0.5 rounded text-blue-800 font-mono text-xs">
                        {v.var}
                      </code>
                      <span className="text-gray-600 text-xs">{v.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conteúdo */}
              <div className="space-y-2">
                <Label htmlFor="conteudo">Conteúdo do Template</Label>
                <Textarea
                  id="conteudo"
                  value={formData.conteudo}
                  onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
                  rows={15}
                  placeholder="Digite o conteúdo do template aqui. Use as variáveis acima para personalizar."
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500">
                  {formData.conteudo.length} caracteres
                </p>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label>Pré-visualização</Label>
                <div className="border rounded-lg p-6 bg-white min-h-[200px]">
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: formData.conteudo
                        .replace(/\[NOME_PACIENTE\]/g, '<strong>João Silva</strong>')
                        .replace(/\[NOME_DENTISTA\]/g, '<strong>Dr. Maria Santos</strong>')
                        .replace(/\[NOME_CLINICA\]/g, '<strong>DentCare Pro</strong>')
                        .replace(/\[DATA_ATUAL\]/g, new Date().toLocaleDateString('pt-PT'))
                        .replace(/\n/g, '<br />'),
                    }}
                  />
                </div>
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    setEditingTemplate(null);
                    setFormData({ titulo: "", categoria: "tratamento_geral", conteudo: "" });
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={criarTemplateMutation.isPending}>
                  <Save className="w-4 h-4 mr-2" />
                  {criarTemplateMutation.isPending ? "Salvando..." : "Salvar Template"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates?.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{template.titulo}</CardTitle>
                  <CardDescription className="capitalize">
                    {categorias.find((c) => c.value === template.categoria)?.label}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(template)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDuplicate(template)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {template.conteudo.substring(0, 150)}...
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    Visualizar
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <FileText className="w-4 h-4 mr-2" />
                    Usar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!templates || templates.length === 0) && (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">Nenhum template criado ainda</p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Template
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Templates Pré-definidos */}
      <Card>
        <CardHeader>
          <CardTitle>Templates Pré-definidos</CardTitle>
          <CardDescription>
            Importe templates prontos para começar rapidamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start h-auto py-4">
              <div className="text-left">
                <div className="font-semibold">Consentimento Geral</div>
                <div className="text-sm text-gray-500">
                  Template básico para tratamentos odontológicos
                </div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-4">
              <div className="text-left">
                <div className="font-semibold">Consentimento Cirúrgico</div>
                <div className="text-sm text-gray-500">
                  Para procedimentos cirúrgicos e invasivos
                </div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-4">
              <div className="text-left">
                <div className="font-semibold">Termo de Responsabilidade</div>
                <div className="text-sm text-gray-500">
                  Responsabilidade do paciente no tratamento
                </div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-4">
              <div className="text-left">
                <div className="font-semibold">Anamnese Completa</div>
                <div className="text-sm text-gray-500">
                  Questionário de saúde detalhado
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

