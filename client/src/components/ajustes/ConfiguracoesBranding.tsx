// @ts-nocheck
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Save, Upload, Palette, Image as ImageIcon } from "lucide-react";

export default function ConfiguracoesBranding() {
  const { data: config, refetch } = trpc.configuracoes.obter.useQuery();
  const salvarMutation = trpc.configuracoes.salvar.useMutation();

  const [formData, setFormData] = useState({
    logo: "",
    logoSecundario: "",
    favicon: "",
    corPrimaria: "#3B82F6",
    corSecundaria: "#10B981",
    corTexto: "#1F2937",
    corFundo: "#F9FAFB",
    fontePrincipal: "Inter",
    fonteSecundaria: "Roboto",
  });

  useEffect(() => {
    if (config?.branding) {
      setFormData({
        logo: config.branding.logo || "",
        logoSecundario: config.branding.logoSecundario || "",
        favicon: config.branding.favicon || "",
        corPrimaria: config.branding.corPrimaria || "#3B82F6",
        corSecundaria: config.branding.corSecundaria || "#10B981",
        corTexto: config.branding.corTexto || "#1F2937",
        corFundo: config.branding.corFundo || "#F9FAFB",
        fontePrincipal: config.branding.fontePrincipal || "Inter",
        fonteSecundaria: config.branding.fonteSecundaria || "Roboto",
      });
    }
  }, [config]);

  const handleSave = async () => {
    try {
      await salvarMutation.mutateAsync({
        ...config,
        branding: formData,
      });
      toast.success("Configurações de branding salvas com sucesso!");
      refetch();
    } catch (error) {
      toast.error("Erro ao salvar configurações");
      console.error(error);
    }
  };

  const handleFileUpload = (field: string) => {
    // Simular upload de arquivo
    toast.info("Funcionalidade de upload em desenvolvimento");
  };

  return (
    <div className="space-y-6">
      {/* Logotipos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Logotipos
          </CardTitle>
          <CardDescription>
            Configure os logotipos da sua clínica
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Logo Principal */}
            <div className="space-y-2">
              <Label>Logo Principal</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                {formData.logo ? (
                  <img src={formData.logo} alt="Logo" className="max-h-32 mx-auto" />
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-500">Clique para fazer upload</p>
                    <p className="text-xs text-gray-400">PNG, JPG até 2MB</p>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleFileUpload("logo")}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Logo
              </Button>
            </div>

            {/* Logo Secundário */}
            <div className="space-y-2">
              <Label>Logo Secundário (Branco)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-800 hover:border-blue-500 transition-colors cursor-pointer">
                {formData.logoSecundario ? (
                  <img src={formData.logoSecundario} alt="Logo Secundário" className="max-h-32 mx-auto" />
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-300">Clique para fazer upload</p>
                    <p className="text-xs text-gray-400">PNG, JPG até 2MB</p>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleFileUpload("logoSecundario")}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Logo
              </Button>
            </div>

            {/* Favicon */}
            <div className="space-y-2">
              <Label>Favicon</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                {formData.favicon ? (
                  <img src={formData.favicon} alt="Favicon" className="max-h-32 mx-auto" />
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-500">Clique para fazer upload</p>
                    <p className="text-xs text-gray-400">ICO, PNG 32x32</p>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleFileUpload("favicon")}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Favicon
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Paleta de Cores
          </CardTitle>
          <CardDescription>
            Defina as cores da identidade visual da sua clínica
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Cor Primária */}
            <div className="space-y-2">
              <Label htmlFor="corPrimaria">Cor Primária</Label>
              <div className="flex gap-2">
                <Input
                  id="corPrimaria"
                  type="color"
                  value={formData.corPrimaria}
                  onChange={(e) => setFormData({ ...formData, corPrimaria: e.target.value })}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  type="text"
                  value={formData.corPrimaria}
                  onChange={(e) => setFormData({ ...formData, corPrimaria: e.target.value })}
                  className="flex-1"
                  placeholder="#3B82F6"
                />
              </div>
              <div
                className="h-12 rounded-md border"
                style={{ backgroundColor: formData.corPrimaria }}
              />
            </div>

            {/* Cor Secundária */}
            <div className="space-y-2">
              <Label htmlFor="corSecundaria">Cor Secundária</Label>
              <div className="flex gap-2">
                <Input
                  id="corSecundaria"
                  type="color"
                  value={formData.corSecundaria}
                  onChange={(e) => setFormData({ ...formData, corSecundaria: e.target.value })}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  type="text"
                  value={formData.corSecundaria}
                  onChange={(e) => setFormData({ ...formData, corSecundaria: e.target.value })}
                  className="flex-1"
                  placeholder="#10B981"
                />
              </div>
              <div
                className="h-12 rounded-md border"
                style={{ backgroundColor: formData.corSecundaria }}
              />
            </div>

            {/* Cor de Texto */}
            <div className="space-y-2">
              <Label htmlFor="corTexto">Cor de Texto</Label>
              <div className="flex gap-2">
                <Input
                  id="corTexto"
                  type="color"
                  value={formData.corTexto}
                  onChange={(e) => setFormData({ ...formData, corTexto: e.target.value })}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  type="text"
                  value={formData.corTexto}
                  onChange={(e) => setFormData({ ...formData, corTexto: e.target.value })}
                  className="flex-1"
                  placeholder="#1F2937"
                />
              </div>
              <div
                className="h-12 rounded-md border flex items-center justify-center text-white font-medium"
                style={{ backgroundColor: formData.corTexto }}
              >
                Texto
              </div>
            </div>

            {/* Cor de Fundo */}
            <div className="space-y-2">
              <Label htmlFor="corFundo">Cor de Fundo</Label>
              <div className="flex gap-2">
                <Input
                  id="corFundo"
                  type="color"
                  value={formData.corFundo}
                  onChange={(e) => setFormData({ ...formData, corFundo: e.target.value })}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  type="text"
                  value={formData.corFundo}
                  onChange={(e) => setFormData({ ...formData, corFundo: e.target.value })}
                  className="flex-1"
                  placeholder="#F9FAFB"
                />
              </div>
              <div
                className="h-12 rounded-md border"
                style={{ backgroundColor: formData.corFundo }}
              />
            </div>
          </div>

          {/* Preview */}
          <div className="mt-6 p-6 rounded-lg border" style={{ backgroundColor: formData.corFundo }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: formData.corTexto }}>
              Pré-visualização
            </h3>
            <div className="flex gap-3">
              <Button style={{ backgroundColor: formData.corPrimaria, color: "white" }}>
                Botão Primário
              </Button>
              <Button style={{ backgroundColor: formData.corSecundaria, color: "white" }}>
                Botão Secundário
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tipografia */}
      <Card>
        <CardHeader>
          <CardTitle>Tipografia</CardTitle>
          <CardDescription>
            Escolha as fontes para o sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fontePrincipal">Fonte Principal</Label>
              <select
                id="fontePrincipal"
                value={formData.fontePrincipal}
                onChange={(e) => setFormData({ ...formData, fontePrincipal: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Lato">Lato</option>
                <option value="Poppins">Poppins</option>
                <option value="Montserrat">Montserrat</option>
              </select>
              <p className="text-sm text-gray-500" style={{ fontFamily: formData.fontePrincipal }}>
                Exemplo de texto com a fonte selecionada
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fonteSecundaria">Fonte Secundária</Label>
              <select
                id="fonteSecundaria"
                value={formData.fonteSecundaria}
                onChange={(e) => setFormData({ ...formData, fonteSecundaria: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="Roboto">Roboto</option>
                <option value="Inter">Inter</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Lato">Lato</option>
                <option value="Poppins">Poppins</option>
                <option value="Montserrat">Montserrat</option>
              </select>
              <p className="text-sm text-gray-500" style={{ fontFamily: formData.fonteSecundaria }}>
                Exemplo de texto com a fonte selecionada
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botão Salvar */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={salvarMutation.isPending}
          className="gap-2"
        >
          <Save className="w-4 h-4" />
          {salvarMutation.isPending ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  );
}

