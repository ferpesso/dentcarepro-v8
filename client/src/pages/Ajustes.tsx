// @ts-nocheck
import { useState } from "react";
import { Settings, Users, DollarSign, Palette, FileText, Database } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConfiguracoesBasicas from "@/components/ajustes/ConfiguracoesBasicas";
import GestaoDentistas from "@/components/ajustes/GestaoDentistas";
import ConfiguracoesFinanceiras from "@/components/ajustes/ConfiguracoesFinanceiras";

export default function Ajustes() {
  const [activeTab, setActiveTab] = useState("basicas");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-blue-600" />
            Ajustes e Configurações
          </h1>
          <p className="text-gray-600 mt-2">
            Personalize o sistema de acordo com as necessidades da sua clínica
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-2">
            <TabsTrigger value="basicas" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Básicas</span>
            </TabsTrigger>
            <TabsTrigger value="dentistas" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Dentistas</span>
            </TabsTrigger>
            <TabsTrigger value="financeiro" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Financeiro</span>
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Branding</span>
            </TabsTrigger>
            <TabsTrigger value="documentos" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Documentos</span>
            </TabsTrigger>
            <TabsTrigger value="avancado" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Avançado</span>
            </TabsTrigger>
          </TabsList>

          {/* Configurações Básicas */}
          <TabsContent value="basicas">
            <ConfiguracoesBasicas />
          </TabsContent>

          {/* Gestão de Dentistas */}
          <TabsContent value="dentistas">
            <GestaoDentistas />
          </TabsContent>

          {/* Configurações Financeiras */}
          <TabsContent value="financeiro">
            <ConfiguracoesFinanceiras />
          </TabsContent>

          {/* Branding */}
          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle>Branding e Personalização</CardTitle>
                <CardDescription>
                  Personalize a identidade visual da sua clínica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documentos */}
          <TabsContent value="documentos">
            <Card>
              <CardHeader>
                <CardTitle>Templates de Documentos</CardTitle>
                <CardDescription>
                  Configure templates para faturas, recibos e outros documentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Avançado */}
          <TabsContent value="avancado">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Avançadas</CardTitle>
                <CardDescription>
                  Base de dados, backup, integrações e notificações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

