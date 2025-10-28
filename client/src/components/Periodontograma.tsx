// @ts-nocheck
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Activity, AlertTriangle, TrendingUp } from "lucide-react";

interface MedicoesPeriodontais {
  numeroDente: string;
  profundidadeVestibular: [number, number, number];
  profundidadeLingual: [number, number, number];
  recessaoVestibular: [number, number, number];
  recessaoLingual: [number, number, number];
  sangramentoVestibular: [boolean, boolean, boolean];
  sangramentoLingual: [boolean, boolean, boolean];
  mobilidade: 0 | 1 | 2 | 3;
  furcacao: 0 | 1 | 2 | 3;
  presencaPlaca: boolean;
}

interface PeriodontogramaProps {
  utenteId: string;
  dataAvaliacao?: string;
  dados?: MedicoesPeriodontais[];
  onSalvar?: (dados: MedicoesPeriodontais[], dataAvaliacao: string) => void;
}

const DENTES = [
  "18", "17", "16", "15", "14", "13", "12", "11",
  "21", "22", "23", "24", "25", "26", "27", "28",
  "48", "47", "46", "45", "44", "43", "42", "41",
  "31", "32", "33", "34", "35", "36", "37", "38",
];

// Dentes com furcação (molares)
const DENTES_COM_FURCACAO = ["16", "17", "18", "26", "27", "28", "36", "37", "38", "46", "47", "48"];

export default function Periodontograma({ utenteId, dataAvaliacao, dados = [], onSalvar }: PeriodontogramaProps) {
  const [data, setData] = useState(dataAvaliacao || new Date().toISOString().split("T")[0]);
  const [medicoes, setMedicoes] = useState<Record<string, MedicoesPeriodontais>>(
    dados.reduce((acc, d) => ({ ...acc, [d.numeroDente]: d }), {})
  );
  const [denteSelecionado, setDenteSelecionado] = useState<string | null>(null);
  const [modoEdicao, setModoEdicao] = useState(false);

  const getMedicao = (numeroDente: string): MedicoesPeriodontais => {
    return (
      medicoes[numeroDente] || {
        numeroDente,
        profundidadeVestibular: [0, 0, 0],
        profundidadeLingual: [0, 0, 0],
        recessaoVestibular: [0, 0, 0],
        recessaoLingual: [0, 0, 0],
        sangramentoVestibular: [false, false, false],
        sangramentoLingual: [false, false, false],
        mobilidade: 0,
        furcacao: 0,
        presencaPlaca: false,
      }
    );
  };

  const updateMedicao = (numeroDente: string, campo: string, valor: any) => {
    setMedicoes((prev) => ({
      ...prev,
      [numeroDente]: {
        ...getMedicao(numeroDente),
        [campo]: valor,
      },
    }));
  };

  const getCorProfundidade = (prof: number) => {
    if (prof === 0) return "#E5E7EB";
    if (prof <= 3) return "#86EFAC"; // Verde - Saudável
    if (prof <= 5) return "#FDE047"; // Amarelo - Atenção
    return "#FCA5A5"; // Vermelho - Problema
  };

  // Calcular análise periodontal automática
  const calcularAnalise = () => {
    const todasMedicoes = Object.values(medicoes).filter(
      (m) => m.profundidadeVestibular.some((p) => p > 0) || m.profundidadeLingual.some((p) => p > 0)
    );

    if (todasMedicoes.length === 0) {
      return {
        profundidadeMedia: 0,
        percentualSangramento: 0,
        sitiosMaior5mm: 0,
        totalSitios: 0,
        furcacoes: 0,
        diagnostico: "Sem dados",
      };
    }

    let somaProfundidades = 0;
    let totalSitios = 0;
    let sitiosSangramento = 0;
    let sitiosMaior5mm = 0;
    let furcacoes = 0;

    todasMedicoes.forEach((m) => {
      // Profundidades
      m.profundidadeVestibular.forEach((p) => {
        if (p > 0) {
          somaProfundidades += p;
          totalSitios++;
          if (p > 5) sitiosMaior5mm++;
        }
      });
      m.profundidadeLingual.forEach((p) => {
        if (p > 0) {
          somaProfundidades += p;
          totalSitios++;
          if (p > 5) sitiosMaior5mm++;
        }
      });

      // Sangramento
      m.sangramentoVestibular.forEach((s) => {
        if (s) sitiosSangramento++;
      });
      m.sangramentoLingual.forEach((s) => {
        if (s) sitiosSangramento++;
      });

      // Furcações
      if (m.furcacao > 0) furcacoes++;
    });

    const profundidadeMedia = totalSitios > 0 ? somaProfundidades / totalSitios : 0;
    const percentualSangramento = totalSitios > 0 ? (sitiosSangramento / totalSitios) * 100 : 0;

    // Diagnóstico automático
    let diagnostico = "Saudável";
    if (profundidadeMedia > 5 || percentualSangramento > 50 || sitiosMaior5mm > 5) {
      diagnostico = "Periodontite Severa";
    } else if (profundidadeMedia > 4 || percentualSangramento > 30 || sitiosMaior5mm > 2) {
      diagnostico = "Periodontite Moderada";
    } else if (profundidadeMedia > 3 || percentualSangramento > 10) {
      diagnostico = "Gengivite";
    }

    return {
      profundidadeMedia: profundidadeMedia.toFixed(2),
      percentualSangramento: percentualSangramento.toFixed(1),
      sitiosMaior5mm,
      totalSitios,
      furcacoes,
      diagnostico,
    };
  };

  const analise = calcularAnalise();

  const handleSalvar = () => {
    const dadosArray = Object.values(medicoes).filter(
      (m) => m.profundidadeVestibular.some((p) => p > 0) || m.profundidadeLingual.some((p) => p > 0)
    );
    if (onSalvar) {
      onSalvar(dadosArray, data);
    }
    toast.success("Periodontograma salvo com sucesso!");
    setModoEdicao(false);
  };

  const renderDente = (numeroDente: string) => {
    const medicao = getMedicao(numeroDente);
    const maxProf = Math.max(...medicao.profundidadeVestibular, ...medicao.profundidadeLingual);
    const temSangramento =
      medicao.sangramentoVestibular.some((s) => s) || medicao.sangramentoLingual.some((s) => s);

    return (
      <div
        key={numeroDente}
        className={`flex flex-col items-center gap-1 p-2 rounded cursor-pointer transition-all ${
          denteSelecionado === numeroDente ? "bg-primary/10 ring-2 ring-primary" : "hover:bg-muted"
        }`}
        onClick={() => modoEdicao && setDenteSelecionado(numeroDente)}
      >
        {/* Profundidade Vestibular */}
        <div className="flex gap-px">
          {medicao.profundidadeVestibular.map((prof, idx) => (
            <div
              key={`v-${idx}`}
              className="w-6 h-10 flex flex-col items-center justify-end text-xs font-mono border relative"
              style={{ backgroundColor: getCorProfundidade(prof) }}
            >
              {prof > 0 && <span className="font-bold">{prof}</span>}
              {medicao.sangramentoVestibular[idx] && (
                <span className="absolute top-0 text-red-600 font-bold text-lg">•</span>
              )}
              {medicao.recessaoVestibular[idx] > 0 && (
                <span className="absolute bottom-0 text-xs text-blue-600">
                  -{medicao.recessaoVestibular[idx]}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Número do dente */}
        <div className="text-xs font-mono font-bold">{numeroDente}</div>

        {/* Indicadores */}
        <div className="flex gap-1">
          {medicao.mobilidade > 0 && (
            <Badge variant="destructive" className="text-xs px-1">
              M{medicao.mobilidade}
            </Badge>
          )}
          {medicao.furcacao > 0 && (
            <Badge variant="secondary" className="text-xs px-1">
              F{medicao.furcacao}
            </Badge>
          )}
          {medicao.presencaPlaca && (
            <Badge variant="outline" className="text-xs px-1">
              P
            </Badge>
          )}
        </div>

        {/* Profundidade Lingual */}
        <div className="flex gap-px">
          {medicao.profundidadeLingual.map((prof, idx) => (
            <div
              key={`l-${idx}`}
              className="w-6 h-10 flex flex-col items-center justify-start text-xs font-mono border relative"
              style={{ backgroundColor: getCorProfundidade(prof) }}
            >
              {prof > 0 && <span className="font-bold">{prof}</span>}
              {medicao.sangramentoLingual[idx] && (
                <span className="absolute bottom-0 text-red-600 font-bold text-lg">•</span>
              )}
              {medicao.recessaoLingual[idx] > 0 && (
                <span className="absolute top-0 text-xs text-blue-600">
                  -{medicao.recessaoLingual[idx]}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const medicaoAtual = denteSelecionado ? getMedicao(denteSelecionado) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Periodontograma</h3>
          <p className="text-sm text-muted-foreground">
            {modoEdicao
              ? "Clique em um dente para editar as medições"
              : "Clique em Editar para modificar o periodontograma"}
          </p>
        </div>
        <div className="flex gap-2">
          {!modoEdicao ? (
            <Button onClick={() => setModoEdicao(true)} className="gap-2">
              Editar
            </Button>
          ) : (
            <Button onClick={handleSalvar} className="gap-2 bg-green-600 hover:bg-green-700">
              Salvar
            </Button>
          )}
        </div>
      </div>

      {/* Análise Periodontal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Análise Periodontal Automática
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col p-4 rounded-lg border-2 border-blue-500">
              <div className="text-2xl font-bold text-blue-600">{analise.profundidadeMedia} mm</div>
              <div className="text-sm text-muted-foreground">Profundidade Média</div>
            </div>
            <div className="flex flex-col p-4 rounded-lg border-2 border-red-500">
              <div className="text-2xl font-bold text-red-600">{analise.percentualSangramento}%</div>
              <div className="text-sm text-muted-foreground">Sangramento à Sondagem</div>
            </div>
            <div className="flex flex-col p-4 rounded-lg border-2 border-orange-500">
              <div className="text-2xl font-bold text-orange-600">{analise.sitiosMaior5mm}</div>
              <div className="text-sm text-muted-foreground">Sítios &gt;5mm</div>
            </div>
            <div className="flex flex-col p-4 rounded-lg border-2 border-purple-500">
              <div className="text-2xl font-bold text-purple-600">{analise.totalSitios}</div>
              <div className="text-sm text-muted-foreground">Total de Sítios</div>
            </div>
            <div className="flex flex-col p-4 rounded-lg border-2 border-yellow-500">
              <div className="text-2xl font-bold text-yellow-600">{analise.furcacoes}</div>
              <div className="text-sm text-muted-foreground">Furcações Afetadas</div>
            </div>
            <div className="flex flex-col p-4 rounded-lg border-2 border-green-500">
              <div className="text-lg font-bold text-green-600">{analise.diagnostico}</div>
              <div className="text-sm text-muted-foreground">Diagnóstico Sugerido</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Periodontograma Visual */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>
              Profundidades de sondagem, recessão gengival e sangramento
            </CardDescription>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Data:</label>
              <Input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-auto"
                disabled={!modoEdicao}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Arcada Superior */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Arcada Superior</p>
            <div className="flex justify-center gap-1 flex-wrap">
              {DENTES.slice(0, 16).map(renderDente)}
            </div>
          </div>

          <div className="border-t" />

          {/* Arcada Inferior */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Arcada Inferior</p>
            <div className="flex justify-center gap-1 flex-wrap">
              {DENTES.slice(16).map(renderDente)}
            </div>
          </div>

          {/* Legenda */}
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-300 border" />
                  <span>1-3mm (Saudável)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-300 border" />
                  <span>4-5mm (Atenção)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-300 border" />
                  <span>&gt;5mm (Problema)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600 font-bold text-lg">•</span>
                  <span>Sangramento</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="text-xs">M</Badge>
                  <span>Mobilidade</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">F</Badge>
                  <span>Furcação</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">P</Badge>
                  <span>Placa</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 text-xs">-2</span>
                  <span>Recessão (mm)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Editor do Dente Selecionado */}
      {modoEdicao && denteSelecionado && medicaoAtual && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Editando Dente {denteSelecionado}</CardTitle>
            <CardDescription>Medições periodontais detalhadas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profundidades de Sondagem */}
            <div className="space-y-4">
              <h4 className="font-semibold">Profundidades de Sondagem (mm)</h4>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Vestibular:</label>
                <div className="flex gap-2">
                  {[0, 1, 2].map((idx) => (
                    <Input
                      key={`pv-${idx}`}
                      type="number"
                      min="0"
                      max="15"
                      value={medicaoAtual.profundidadeVestibular[idx]}
                      onChange={(e) => {
                        const newVals = [...medicaoAtual.profundidadeVestibular] as [number, number, number];
                        newVals[idx] = parseInt(e.target.value) || 0;
                        updateMedicao(denteSelecionado, "profundidadeVestibular", newVals);
                      }}
                      className="w-20 text-center"
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Lingual:</label>
                <div className="flex gap-2">
                  {[0, 1, 2].map((idx) => (
                    <Input
                      key={`pl-${idx}`}
                      type="number"
                      min="0"
                      max="15"
                      value={medicaoAtual.profundidadeLingual[idx]}
                      onChange={(e) => {
                        const newVals = [...medicaoAtual.profundidadeLingual] as [number, number, number];
                        newVals[idx] = parseInt(e.target.value) || 0;
                        updateMedicao(denteSelecionado, "profundidadeLingual", newVals);
                      }}
                      className="w-20 text-center"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Recessão Gengival */}
            <div className="space-y-4">
              <h4 className="font-semibold">Recessão Gengival (mm)</h4>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Vestibular:</label>
                <div className="flex gap-2">
                  {[0, 1, 2].map((idx) => (
                    <Input
                      key={`rv-${idx}`}
                      type="number"
                      min="0"
                      max="10"
                      value={medicaoAtual.recessaoVestibular[idx]}
                      onChange={(e) => {
                        const newVals = [...medicaoAtual.recessaoVestibular] as [number, number, number];
                        newVals[idx] = parseInt(e.target.value) || 0;
                        updateMedicao(denteSelecionado, "recessaoVestibular", newVals);
                      }}
                      className="w-20 text-center"
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Lingual:</label>
                <div className="flex gap-2">
                  {[0, 1, 2].map((idx) => (
                    <Input
                      key={`rl-${idx}`}
                      type="number"
                      min="0"
                      max="10"
                      value={medicaoAtual.recessaoLingual[idx]}
                      onChange={(e) => {
                        const newVals = [...medicaoAtual.recessaoLingual] as [number, number, number];
                        newVals[idx] = parseInt(e.target.value) || 0;
                        updateMedicao(denteSelecionado, "recessaoLingual", newVals);
                      }}
                      className="w-20 text-center"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Sangramento à Sondagem */}
            <div className="space-y-4">
              <h4 className="font-semibold">Sangramento à Sondagem</h4>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Vestibular:</label>
                <div className="flex gap-4">
                  {[0, 1, 2].map((idx) => (
                    <div key={`sv-${idx}`} className="flex items-center space-x-2">
                      <Checkbox
                        id={`sv-${idx}`}
                        checked={medicaoAtual.sangramentoVestibular[idx]}
                        onCheckedChange={(checked) => {
                          const newVals = [...medicaoAtual.sangramentoVestibular] as [boolean, boolean, boolean];
                          newVals[idx] = checked as boolean;
                          updateMedicao(denteSelecionado, "sangramentoVestibular", newVals);
                        }}
                      />
                      <label htmlFor={`sv-${idx}`} className="text-sm cursor-pointer">
                        Ponto {idx + 1}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Lingual:</label>
                <div className="flex gap-4">
                  {[0, 1, 2].map((idx) => (
                    <div key={`sl-${idx}`} className="flex items-center space-x-2">
                      <Checkbox
                        id={`sl-${idx}`}
                        checked={medicaoAtual.sangramentoLingual[idx]}
                        onCheckedChange={(checked) => {
                          const newVals = [...medicaoAtual.sangramentoLingual] as [boolean, boolean, boolean];
                          newVals[idx] = checked as boolean;
                          updateMedicao(denteSelecionado, "sangramentoLingual", newVals);
                        }}
                      />
                      <label htmlFor={`sl-${idx}`} className="text-sm cursor-pointer">
                        Ponto {idx + 1}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobilidade */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Mobilidade:</label>
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((mob) => (
                  <Button
                    key={mob}
                    variant={medicaoAtual.mobilidade === mob ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateMedicao(denteSelecionado, "mobilidade", mob)}
                  >
                    {mob === 0 ? "Grau 0 (Normal)" : `Grau ${mob}`}
                  </Button>
                ))}
              </div>
            </div>

            {/* Furcação (apenas para molares) */}
            {DENTES_COM_FURCACAO.includes(denteSelecionado) && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Furcação:</label>
                <Select
                  value={medicaoAtual.furcacao.toString()}
                  onValueChange={(value) => updateMedicao(denteSelecionado, "furcacao", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Grau 0 (Normal)</SelectItem>
                    <SelectItem value="1">Grau I (Início)</SelectItem>
                    <SelectItem value="2">Grau II (Moderado)</SelectItem>
                    <SelectItem value="3">Grau III (Severo)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Presença de Placa */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="presenca-placa"
                checked={medicaoAtual.presencaPlaca}
                onCheckedChange={(checked) =>
                  updateMedicao(denteSelecionado, "presencaPlaca", checked)
                }
              />
              <label htmlFor="presenca-placa" className="text-sm font-medium cursor-pointer">
                Presença de Placa
              </label>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
