// @ts-nocheck
/**
 * Página de Relatórios
 * DentCare PRO v8
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";
import RelatorioDentista from "@/components/RelatorioDentista";
import RelatorioClinica from "@/components/RelatorioClinica";

export default function Relatorios() {
  const [dentistaSelecionado, setDentistaSelecionado] = useState("dent-001");

  // Mock de dentistas
  const dentistas = [
    { id: "dent-001", nome: "Dr. João Costa" },
    { id: "dent-002", nome: "Dra. Ana Martins" },
    { id: "dent-003", nome: "Dr. Pedro Silva" },
  ];

  const dentistaAtual = dentistas.find((d) => d.id === dentistaSelecionado);

  return (
    <div className="container py-8 space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground">
          Análise financeira e operacional completa da clínica e dentistas
        </p>
      </div>

      {/* Cards de Resumo Rápido */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Faturação Mensal</p>
                <p className="text-2xl font-bold">€45.000</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lucro Líquido</p>
                <p className="text-2xl font-bold">€19.000</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Procedimentos</p>
                <p className="text-2xl font-bold">115</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Comissões</p>
                <p className="text-2xl font-bold">€13.500</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Relatórios */}
      <Tabs defaultValue="clinica" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="clinica">Relatório da Clínica</TabsTrigger>
          <TabsTrigger value="dentista">Relatório do Dentista</TabsTrigger>
        </TabsList>

        <TabsContent value="clinica" className="space-y-6 mt-6">
          <RelatorioClinica />
        </TabsContent>

        <TabsContent value="dentista" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Selecionar Dentista</CardTitle>
              <CardDescription>
                Escolha o dentista para visualizar o relatório individual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={dentistaSelecionado} onValueChange={setDentistaSelecionado}>
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dentistas.map((dentista) => (
                    <SelectItem key={dentista.id} value={dentista.id}>
                      {dentista.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {dentistaAtual && (
            <RelatorioDentista
              dentistaId={dentistaAtual.id}
              dentistaNome={dentistaAtual.nome}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
