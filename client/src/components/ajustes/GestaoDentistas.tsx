// @ts-nocheck
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Plus, Search, Edit, Trash2, DollarSign, User } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import FormularioDentista from "./FormularioDentista";

export default function GestaoDentistas() {
  const { data: dentistas, isLoading, refetch } = trpc.dentistas.listar.useQuery();
  const [pesquisa, setPesquisa] = useState("");
  const [dentistaEditando, setDentistaEditando] = useState(null);
  const [dialogAberto, setDialogAberto] = useState(false);

  const dentistasFiltrados = dentistas?.filter((d) =>
    d.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
    d.email.toLowerCase().includes(pesquisa.toLowerCase()) ||
    d.numeroOrdem.includes(pesquisa)
  ) || [];

  const handleNovo = () => {
    setDentistaEditando(null);
    setDialogAberto(true);
  };

  const handleEditar = (dentista) => {
    setDentistaEditando(dentista);
    setDialogAberto(true);
  };

  const handleSucesso = () => {
    setDialogAberto(false);
    setDentistaEditando(null);
    refetch();
  };

  if (isLoading) {
    return <div className="p-6">Carregando dentistas...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho com Pesquisa */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Gestão de Dentistas</CardTitle>
              <CardDescription>
                {dentistas?.length || 0} dentista(s) cadastrado(s)
              </CardDescription>
            </div>
            <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
              <DialogTrigger asChild>
                <Button onClick={handleNovo} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Novo Dentista
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {dentistaEditando ? "Editar Dentista" : "Novo Dentista"}
                  </DialogTitle>
                  <DialogDescription>
                    Preencha os dados do dentista
                  </DialogDescription>
                </DialogHeader>
                <FormularioDentista
                  dentista={dentistaEditando}
                  onSucesso={handleSucesso}
                  onCancelar={() => setDialogAberto(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Pesquisar por nome, email ou número da ordem..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Dentistas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dentistasFiltrados.map((dentista) => (
          <Card key={dentista.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{dentista.nome}</CardTitle>
                    <p className="text-sm text-gray-500">Nº Ordem: {dentista.numeroOrdem}</p>
                  </div>
                </div>
                <Badge
                  variant={dentista.status === "ativo" ? "default" : "secondary"}
                >
                  {dentista.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Especialidades */}
              {dentista.especialidades && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Especialidades:</p>
                  <div className="flex flex-wrap gap-1">
                    {(typeof dentista.especialidades === "string"
                      ? JSON.parse(dentista.especialidades)
                      : dentista.especialidades
                    ).map((esp, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {esp}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Contactos */}
              <div className="text-sm space-y-1">
                <p className="text-gray-600">📧 {dentista.email}</p>
                <p className="text-gray-600">📱 {dentista.telefone}</p>
              </div>

              {/* Ações */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => handleEditar(dentista)}
                >
                  <Edit className="w-3 h-3" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <DollarSign className="w-3 h-3" />
                  Comissões
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {dentistasFiltrados.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">
              {pesquisa
                ? "Nenhum dentista encontrado com esse critério"
                : "Nenhum dentista cadastrado ainda"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

