/**
 * Página de Gestão de Laboratórios
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
  Building2,
  Phone,
  Mail,
  MapPin,
  Star,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";

export default function Laboratorios() {
  const [dialogAberto, setDialogAberto] = useState(false);
  const [laboratorioSelecionado, setLaboratorioSelecionado] = useState<any>(
    null
  );
  const [filtroStatus, setFiltroStatus] = useState<"ativo" | "inativo" | "todos">("ativo");
  const [pesquisa, setPesquisa] = useState("");

  // Queries
  const { data: laboratorios, refetch } = trpc.laboratorios.listar.useQuery({
    status: filtroStatus === "todos" ? undefined : filtroStatus,
    pesquisa: pesquisa || undefined,
  });

  // Mutations
  const criarMutation = trpc.laboratorios.criar.useMutation({
    onSuccess: () => {
      toast.success("Laboratório criado com sucesso!");
      refetch();
      setDialogAberto(false);
      setLaboratorioSelecionado(null);
    },
    onError: (error) => {
      toast.error(`Erro ao criar laboratório: ${error.message}`);
    },
  });

  const atualizarMutation = trpc.laboratorios.atualizar.useMutation({
    onSuccess: () => {
      toast.success("Laboratório atualizado com sucesso!");
      refetch();
      setDialogAberto(false);
      setLaboratorioSelecionado(null);
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar laboratório: ${error.message}`);
    },
  });

  const excluirMutation = trpc.laboratorios.excluir.useMutation({
    onSuccess: () => {
      toast.success("Laboratório excluído com sucesso!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao excluir laboratório: ${error.message}`);
    },
  });

  const handleSalvar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dados = Object.fromEntries(formData.entries());

    // Converter especialidades para JSON array
    const especialidadesStr = dados.especialidades as string;
    const especialidades = especialidadesStr
      ? JSON.stringify(especialidadesStr.split(",").map((s) => s.trim()))
      : undefined;

    const payload = {
      ...dados,
      especialidades,
      prazoMedioEntrega: parseInt(dados.prazoMedioEntrega as string) || 7,
      avaliacaoQualidade: parseInt(dados.avaliacaoQualidade as string) || 5,
    };

    if (laboratorioSelecionado) {
      atualizarMutation.mutate({
        id: laboratorioSelecionado.id,
        ...payload,
      } as any);
    } else {
      criarMutation.mutate(payload as any);
    }
  };

  const handleEditar = (lab: any) => {
    setLaboratorioSelecionado(lab);
    setDialogAberto(true);
  };

  const handleExcluir = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este laboratório?")) {
      excluirMutation.mutate({ id });
    }
  };

  const handleNovo = () => {
    setLaboratorioSelecionado(null);
    setDialogAberto(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Laboratórios</h1>
          <p className="text-muted-foreground">
            Gestão de laboratórios parceiros
          </p>
        </div>
        <Button onClick={handleNovo}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Laboratório
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar laboratórios..."
                  value={pesquisa}
                  onChange={(e) => setPesquisa(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={filtroStatus}
              onValueChange={(value: any) => setFiltroStatus(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="ativo">Ativos</SelectItem>
                <SelectItem value="inativo">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Laboratórios */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {laboratorios?.map((lab) => {
          const especialidades = lab.especialidades
            ? JSON.parse(lab.especialidades)
            : [];

          return (
            <Card key={lab.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {lab.nome}
                    </CardTitle>
                    <CardDescription>{lab.razaoSocial}</CardDescription>
                  </div>
                  <Badge variant={lab.status === "ativo" ? "default" : "secondary"}>
                    {lab.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Contactos */}
                <div className="space-y-2 text-sm">
                  {lab.telefone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {lab.telefone}
                    </div>
                  )}
                  {lab.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {lab.email}
                    </div>
                  )}
                  {lab.cidade && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {lab.cidade}
                    </div>
                  )}
                </div>

                {/* Avaliação */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < (lab.avaliacaoQualidade || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">
                    {lab.prazoMedioEntrega} dias
                  </span>
                </div>

                {/* Especialidades */}
                {especialidades.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {especialidades.slice(0, 3).map((esp: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {esp}
                      </Badge>
                    ))}
                    {especialidades.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{especialidades.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Ações */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEditar(lab)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExcluir(lab.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Mensagem quando vazio */}
      {laboratorios?.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Nenhum laboratório encontrado
            </h3>
            <p className="text-muted-foreground mb-4">
              Comece adicionando um novo laboratório parceiro
            </p>
            <Button onClick={handleNovo}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Laboratório
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog de Criar/Editar */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {laboratorioSelecionado ? "Editar" : "Novo"} Laboratório
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do laboratório parceiro
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSalvar} className="space-y-4">
            {/* Dados Básicos */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="nome">Nome do Laboratório *</Label>
                <Input
                  id="nome"
                  name="nome"
                  defaultValue={laboratorioSelecionado?.nome}
                  required
                />
              </div>

              <div>
                <Label htmlFor="razaoSocial">Razão Social</Label>
                <Input
                  id="razaoSocial"
                  name="razaoSocial"
                  defaultValue={laboratorioSelecionado?.razaoSocial}
                />
              </div>

              <div>
                <Label htmlFor="nif">NIF</Label>
                <Input
                  id="nif"
                  name="nif"
                  maxLength={9}
                  defaultValue={laboratorioSelecionado?.nif}
                />
              </div>
            </div>

            {/* Contactos */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="telemovel">Telemóvel/WhatsApp *</Label>
                <Input
                  id="telemovel"
                  name="telemovel"
                  type="tel"
                  placeholder="+351 912 345 678"
                  defaultValue={laboratorioSelecionado?.telemovel}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Será usado para confirmações automáticas via WhatsApp
                </p>
              </div>

              <div>
                <Label htmlFor="telefone">Telefone Fixo</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  placeholder="+351 21 234 5678"
                  defaultValue={laboratorioSelecionado?.telefone}
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="laboratorio@exemplo.pt"
                  defaultValue={laboratorioSelecionado?.email}
                />
              </div>
            </div>

            {/* Morada */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-3">
                <Label htmlFor="morada">Morada</Label>
                <Input
                  id="morada"
                  name="morada"
                  defaultValue={laboratorioSelecionado?.morada}
                />
              </div>

              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  name="cidade"
                  defaultValue={laboratorioSelecionado?.cidade}
                />
              </div>

              <div>
                <Label htmlFor="codigoPostal">Código Postal</Label>
                <Input
                  id="codigoPostal"
                  name="codigoPostal"
                  placeholder="0000-000"
                  defaultValue={laboratorioSelecionado?.codigoPostal}
                />
              </div>

              <div>
                <Label htmlFor="pais">País</Label>
                <Input
                  id="pais"
                  name="pais"
                  defaultValue={laboratorioSelecionado?.pais || "Portugal"}
                />
              </div>
            </div>

            {/* Informações Profissionais */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="responsavelTecnico">Responsável Técnico</Label>
                <Input
                  id="responsavelTecnico"
                  name="responsavelTecnico"
                  defaultValue={laboratorioSelecionado?.responsavelTecnico}
                />
              </div>

              <div>
                <Label htmlFor="prazoMedioEntrega">
                  Prazo Médio (dias)
                </Label>
                <Input
                  id="prazoMedioEntrega"
                  name="prazoMedioEntrega"
                  type="number"
                  min="1"
                  defaultValue={laboratorioSelecionado?.prazoMedioEntrega || 7}
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="especialidades">
                  Especialidades (separadas por vírgula)
                </Label>
                <Input
                  id="especialidades"
                  name="especialidades"
                  placeholder="Prótese, Ortodontia, Implantes"
                  defaultValue={
                    laboratorioSelecionado?.especialidades
                      ? JSON.parse(laboratorioSelecionado.especialidades).join(
                          ", "
                        )
                      : ""
                  }
                />
              </div>

              <div>
                <Label htmlFor="avaliacaoQualidade">Avaliação (1-5)</Label>
                <Select
                  name="avaliacaoQualidade"
                  defaultValue={
                    laboratorioSelecionado?.avaliacaoQualidade?.toString() || "5"
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">⭐ 1 estrela</SelectItem>
                    <SelectItem value="2">⭐⭐ 2 estrelas</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ 3 estrelas</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ 4 estrelas</SelectItem>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ 5 estrelas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  name="status"
                  defaultValue={laboratorioSelecionado?.status || "ativo"}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Observações */}
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                name="observacoes"
                rows={3}
                defaultValue={laboratorioSelecionado?.observacoes}
              />
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
                {laboratorioSelecionado ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

