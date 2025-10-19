// @ts-nocheck
import { useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, PieChart as PieChartIcon, BarChart3 } from "lucide-react";

interface DadosFinanceiros {
  mes: string;
  receitas: number;
  despesas: number;
  lucro: number;
}

interface GraficosFinanceirosProps {
  dados?: DadosFinanceiros[];
  periodo?: string;
}

const CORES = {
  receitas: "#10B981",
  despesas: "#EF4444",
  lucro: "#3B82F6",
  comissoes: "#8B5CF6",
  laboratorios: "#F59E0B",
};

const CORES_PIE = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

export default function GraficosFinanceiros({ dados = [], periodo = "Últimos 6 meses" }: GraficosFinanceirosProps) {
  // Gerar dados de exemplo se não houver dados
  const dadosGrafico = useMemo(() => {
    if (dados.length > 0) return dados;
    
    // Dados de exemplo para demonstração
    const meses = ["Mai", "Jun", "Jul", "Ago", "Set", "Out"];
    return meses.map((mes, idx) => ({
      mes,
      receitas: 15000 + Math.random() * 10000,
      despesas: 8000 + Math.random() * 5000,
      lucro: 7000 + Math.random() * 5000,
    }));
  }, [dados]);

  // Dados para gráfico de pizza (distribuição de receitas)
  const dadosPizza = useMemo(() => {
    return [
      { nome: "Consultas", valor: 45, cor: CORES_PIE[0] },
      { nome: "Tratamentos", valor: 30, cor: CORES_PIE[1] },
      { nome: "Ortodontia", valor: 15, cor: CORES_PIE[2] },
      { nome: "Implantes", valor: 10, cor: CORES_PIE[3] },
    ];
  }, []);

  // Dados para gráfico de barras (comissões por dentista)
  const dadosComissoes = useMemo(() => {
    return [
      { dentista: "Dr. Silva", valor: 3500 },
      { dentista: "Dra. Costa", valor: 4200 },
      { dentista: "Dr. Santos", valor: 2800 },
      { dentista: "Dra. Oliveira", valor: 3900 },
    ];
  }, []);

  // Formatador de moeda
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);
  };

  // Tooltip customizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatarMoeda(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Gráfico de Linha - Evolução Mensal */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <CardTitle>Evolução Financeira</CardTitle>
          </div>
          <CardDescription>{periodo}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dadosGrafico}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="mes" 
                stroke="#6B7280"
                style={{ fontSize: "12px" }}
              />
              <YAxis 
                stroke="#6B7280"
                style={{ fontSize: "12px" }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: "14px" }}
                iconType="line"
              />
              <Line
                type="monotone"
                dataKey="receitas"
                name="Receitas"
                stroke={CORES.receitas}
                strokeWidth={2}
                dot={{ fill: CORES.receitas, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="despesas"
                name="Despesas"
                stroke={CORES.despesas}
                strokeWidth={2}
                dot={{ fill: CORES.despesas, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="lucro"
                name="Lucro"
                stroke={CORES.lucro}
                strokeWidth={2}
                dot={{ fill: CORES.lucro, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Área - Receitas vs Despesas */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <CardTitle className="text-base">Receitas vs Despesas</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="mes" 
                  stroke="#6B7280"
                  style={{ fontSize: "11px" }}
                />
                <YAxis 
                  stroke="#6B7280"
                  style={{ fontSize: "11px" }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Area
                  type="monotone"
                  dataKey="receitas"
                  name="Receitas"
                  stackId="1"
                  stroke={CORES.receitas}
                  fill={CORES.receitas}
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="despesas"
                  name="Despesas"
                  stackId="2"
                  stroke={CORES.despesas}
                  fill={CORES.despesas}
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza - Distribuição de Receitas */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-base">Distribuição de Receitas</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dadosPizza}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nome, percent }) => `${nome} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {dadosPizza.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `${value}%`}
                  contentStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Barras - Comissões por Dentista */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <CardTitle className="text-base">Comissões por Dentista</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dadosComissoes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="dentista" 
                  stroke="#6B7280"
                  style={{ fontSize: "12px" }}
                />
                <YAxis 
                  stroke="#6B7280"
                  style={{ fontSize: "12px" }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                />
                <Bar 
                  dataKey="valor" 
                  name="Comissão"
                  fill={CORES.comissoes}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

