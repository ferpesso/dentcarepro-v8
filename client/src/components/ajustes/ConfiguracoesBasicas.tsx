// @ts-nocheck
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Save, Building2, Phone, Mail, MapPin } from "lucide-react";

export default function ConfiguracoesBasicas() {
  const { data: config, isLoading, refetch } = trpc.configuracoes.obter.useQuery();
  const salvarMutation = trpc.configuracoes.salvar.useMutation();

  const [formData, setFormData] = useState({
    nomeClinica: "",
    nomeFantasia: "",
    razaoSocial: "",
    nif: "",
    numeroRegistro: "",
    telefone: "",
    telemovel: "",
    email: "",
    website: "",
    morada: {
      rua: "",
      numero: "",
      complemento: "",
      codigoPostal: "",
      cidade: "",
      distrito: "",
      pais: "Portugal",
    },
    anoFundacao: new Date().getFullYear(),
    numeroFuncionarios: 0,
  });

  useEffect(() => {
    if (config) {
      setFormData({
        nomeClinica: config.nomeClinica || "",
        nomeFantasia: config.nomeFantasia || "",
        razaoSocial: config.razaoSocial || "",
        nif: config.nif || "",
        numeroRegistro: config.numeroRegistro || "",
        telefone: config.telefone || "",
        telemovel: config.telemovel || "",
        email: config.email || "",
        website: config.website || "",
        morada: typeof config.morada === "string" ? JSON.parse(config.morada) : config.morada || {
          rua: "",
          numero: "",
          complemento: "",
          codigoPostal: "",
          cidade: "",
          distrito: "",
          pais: "Portugal",
        },
        anoFundacao: config.anoFundacao || new Date().getFullYear(),
        numeroFuncionarios: config.numeroFuncionarios || 0,
      });
    }
  }, [config]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await salvarMutation.mutateAsync(formData);
      toast.success("Configurações salvas com sucesso!");
      refetch();
    } catch (error) {
      toast.error("Erro ao salvar configurações");
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Identificação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Identificação da Clínica
          </CardTitle>
          <CardDescription>
            Informações básicas sobre a clínica
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nomeClinica">Nome da Clínica *</Label>
              <Input
                id="nomeClinica"
                value={formData.nomeClinica}
                onChange={(e) => setFormData({ ...formData, nomeClinica: e.target.value })}
                placeholder="Clínica Dentária Sorrisos"
                required
              />
            </div>
            <div>
              <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
              <Input
                id="nomeFantasia"
                value={formData.nomeFantasia}
                onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
                placeholder="Sorrisos Odontologia"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="razaoSocial">Razão Social *</Label>
            <Input
              id="razaoSocial"
              value={formData.razaoSocial}
              onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
              placeholder="Clínica Dentária Sorrisos Lda"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nif">NIF/NIPC *</Label>
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
              <Label htmlFor="numeroRegistro">Número de Registro</Label>
              <Input
                id="numeroRegistro"
                value={formData.numeroRegistro}
                onChange={(e) => setFormData({ ...formData, numeroRegistro: e.target.value })}
                placeholder="Registro profissional"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contactos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Contactos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="geral@clinica.pt"
                required
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://www.clinica.pt"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Morada */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Morada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="rua">Rua *</Label>
              <Input
                id="rua"
                value={formData.morada?.rua || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  morada: { ...formData.morada, rua: e.target.value }
                })}
                placeholder="Rua das Flores"
                required
              />
            </div>
            <div>
              <Label htmlFor="numero">Número *</Label>
              <Input
                id="numero"
                value={formData.morada?.numero || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  morada: { ...formData.morada, numero: e.target.value }
                })}
                placeholder="123"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="complemento">Complemento</Label>
            <Input
              id="complemento"
              value={formData.morada?.complemento || ""}
              onChange={(e) => setFormData({
                ...formData,
                morada: { ...formData.morada, complemento: e.target.value }
              })}
              placeholder="Andar, Sala, etc."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="codigoPostal">Código Postal *</Label>
              <Input
                id="codigoPostal"
                value={formData.morada?.codigoPostal || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  morada: { ...formData.morada, codigoPostal: e.target.value }
                })}
                placeholder="1000-001"
                required
              />
            </div>
            <div>
              <Label htmlFor="cidade">Cidade *</Label>
              <Input
                id="cidade"
                value={formData.morada?.cidade || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  morada: { ...formData.morada, cidade: e.target.value }
                })}
                placeholder="Lisboa"
                required
              />
            </div>
            <div>
              <Label htmlFor="distrito">Distrito *</Label>
              <Input
                id="distrito"
                value={formData.morada?.distrito || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  morada: { ...formData.morada, distrito: e.target.value }
                })}
                placeholder="Lisboa"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botão Salvar */}
      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={salvarMutation.isPending}
          className="gap-2"
        >
          <Save className="w-4 h-4" />
          {salvarMutation.isPending ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </form>
  );
}

