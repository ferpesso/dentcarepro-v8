// @ts-nocheck
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Calendar, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface AnaliseCefalometrica {
  sna: string;
  snb: string;
  anb: string;
  fma: string;
  impa: string;
  overjet: string;
  overbite: string;
}

interface FioArco {
  id: string;
  data: string;
  tipo: string; // NiTi, Aço, TMA
  espessura: string; // 0.014, 0.016, 0.018, etc
  arcada: "superior" | "inferior" | "ambas";
  observacoes: string;
}

interface Ortodontia {
  id?: string;
  
  // Diagnóstico
  classificacaoAngulo: string; // Classe I, II div 1, II div 2, III
  tipoFacial: string; // Dolicofacial, Mesofacial, Braquifacial
  relacaoMolar: string;
  relacaoCanino: string;
  overjet: string;
  overbite: string;
  linhaMedia: string;
  apinhamento: string;
  diastemas: string;
  
  // Análise Cefalométrica
  cefalometria?: AnaliseCefalometrica;
  
  // Análise Dentária
  ausencias: string;
  supranumerarios: string;
  anomaliasDentarias: string;
  
  // Análise Esquelética
  padraoEsqueletico: string; // Classe I, II, III
  padraoVertical: string; // Normal, Aumentado, Diminuído
  
  // Tratamento
  tipoAparelho?: string;
  dataInicio?: string;
  previsaoTermino?: string;
  dataTermino?: string;
  mesesDecorridos?: number;
  mesesRestantes?: number;
  planoTratamento?: string;
  
  // Sequência de Fios
  fios: FioArco[];
  
  // Status
  status: "planejamento" | "ativo" | "contencao" | "concluido";
  observacoes?: string;
  
  consultas: Array<{
    id: string;
    dataConsulta: string;
    procedimentos?: string;
    observacoes?: string;
    proximaConsulta?: string;
  }>;
}

interface OrtodontiaProps {
  utenteId: string;
  dados?: Ortodontia;
  onSalvar?: (dados: Ortodontia) => void;
}

const STATUS_LABELS = {
  planejamento: "Planejamento",
  ativo: "Em Tratamento",
  contencao: "Contenção",
  concluido: "Concluído",
};

export default function Ortodontia({ utenteId, dados, onSalvar }: OrtodontiaProps) {
  const [tratamento, setTratamento] = useState<Ortodontia>(
    dados || {
      status: "planejamento",
      classificacaoAngulo: "",
      tipoFacial: "",
      relacaoMolar: "",
      relacaoCanino: "",
      overjet: "",
      overbite: "",
      linhaMedia: "",
      apinhamento: "",
      diastemas: "",
      ausencias: "",
      supranumerarios: "",
      anomaliasDentarias: "",
      padraoEsqueletico: "",
      padraoVertical: "",
      fios: [],
      consultas: [],
    }
  );

  const [novaConsulta, setNovaConsulta] = useState({
    dataConsulta: new Date().toISOString().split("T")[0],
    procedimentos: "",
    observacoes: "",
    proximaConsulta: "",
  });

  const [novoFio, setNovoFio] = useState({
    tipo: "",
    espessura: "",
    arcada: "ambas" as "superior" | "inferior" | "ambas",
    observacoes: "",
  });

  // Calcular progresso
  const calcularProgresso = () => {
    if (!tratamento.dataInicio) return 0;
    
    const inicio = new Date(tratamento.dataInicio);
    const hoje = new Date();
    const fim = tratamento.previsaoTermino
      ? new Date(tratamento.previsaoTermino)
      : new Date(inicio.getTime() + 24 * 30 * 24 * 60 * 60 * 1000); // 24 meses padrão

    const totalDias = fim.getTime() - inicio.getTime();
    const diasDecorridos = hoje.getTime() - inicio.getTime();
    
    const mesesDecorridos = Math.floor(diasDecorridos / (30 * 24 * 60 * 60 * 1000));
    const mesesTotais = Math.floor(totalDias / (30 * 24 * 60 * 60 * 1000));
    const mesesRestantes = Math.max(0, mesesTotais - mesesDecorridos);
    
    const progresso = Math.min(100, (diasDecorridos / totalDias) * 100);
    
    return {
      progresso: progresso.toFixed(1),
      mesesDecorridos,
      mesesRestantes,
    };
  };

  const progresso = calcularProgresso();

  const handleAdicionarConsulta = () => {
    if (!novaConsulta.dataConsulta) {
      toast.error("Preencha a data da consulta!");
      return;
    }
    setTratamento({
      ...tratamento,
      consultas: [
        ...tratamento.consultas,
        { ...novaConsulta, id: Date.now().toString() },
      ],
    });
    setNovaConsulta({
      dataConsulta: new Date().toISOString().split("T")[0],
      procedimentos: "",
      observacoes: "",
      proximaConsulta: "",
    });
    toast.success("Consulta adicionada!");
  };

  const handleAdicionarFio = () => {
    if (!novoFio.tipo || !novoFio.espessura) {
      toast.error("Preencha tipo e espessura do fio!");
      return;
    }
    setTratamento({
      ...tratamento,
      fios: [
        ...tratamento.fios,
        {
          ...novoFio,
          id: Date.now().toString(),
          data: new Date().toISOString().split("T")[0],
        },
      ],
    });
    setNovoFio({
      tipo: "",
      espessura: "",
      arcada: "ambas",
      observacoes: "",
    });
    toast.success("Fio/arco adicionado!");
  };

  const handleSalvar = () => {
    if (onSalvar) {
      onSalvar({
        ...tratamento,
        mesesDecorridos: progresso.mesesDecorridos,
        mesesRestantes: progresso.mesesRestantes,
      });
    }
    toast.success("Ortodontia salva com sucesso!");
  };

  return (
    <div className="space-y-6">
      {/* Progresso do Tratamento */}
      <Card>
        <CardHeader>
          <CardTitle>Módulo de Ortodontia</CardTitle>
          <CardDescription>
            Status: <Badge>{STATUS_LABELS[tratamento.status]}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tratamento.dataInicio && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Progresso do Tratamento</span>
                </div>
                <span className="text-2xl font-bold text-primary">{progresso.progresso}%</span>
              </div>
              
              <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all"
                  style={{ width: `${progresso.progresso}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {progresso.mesesDecorridos}
                  </div>
                  <div className="text-sm text-muted-foreground">Meses Decorridos</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">25%</div>
                  <div className="text-sm text-muted-foreground">Progresso Geral</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {progresso.mesesRestantes}
                  </div>
                  <div className="text-sm text-muted-foreground">Meses Restantes</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Fase Atual: <strong>Alinhamento e Nivelamento</strong>
                </span>
                <span>
                  Próximo Fio: <strong>0.016 NiTi</strong>
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diagnóstico Ortodôntico */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Diagnóstico Ortodôntico</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Classificação */}
          <div className="space-y-4">
            <h4 className="font-semibold">Classificação</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Classificação de Angle:</label>
                <Select
                  value={tratamento.classificacaoAngulo}
                  onValueChange={(v) => setTratamento({ ...tratamento, classificacaoAngulo: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classe_i">Classe I (Neutroclusão)</SelectItem>
                    <SelectItem value="classe_ii_div1">Classe II Divisão 1</SelectItem>
                    <SelectItem value="classe_ii_div2">Classe II Divisão 2</SelectItem>
                    <SelectItem value="classe_iii">Classe III</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo Facial:</label>
                <Select
                  value={tratamento.tipoFacial}
                  onValueChange={(v) => setTratamento({ ...tratamento, tipoFacial: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dolicofacial">Dolicofacial</SelectItem>
                    <SelectItem value="mesofacial">Mesofacial</SelectItem>
                    <SelectItem value="braquifacial">Braquifacial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Análise Dentária */}
          <div className="space-y-4">
            <h4 className="font-semibold">Análise Dentária</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Relação Molar:</label>
                <Input
                  value={tratamento.relacaoMolar}
                  onChange={(e) => setTratamento({ ...tratamento, relacaoMolar: e.target.value })}
                  placeholder="Ex: Classe I bilateral"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Relação Canino:</label>
                <Input
                  value={tratamento.relacaoCanino}
                  onChange={(e) => setTratamento({ ...tratamento, relacaoCanino: e.target.value })}
                  placeholder="Ex: Classe II à direita"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Overjet (mm):</label>
                <Input
                  value={tratamento.overjet}
                  onChange={(e) => setTratamento({ ...tratamento, overjet: e.target.value })}
                  placeholder="4.5"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Overbite (mm):</label>
                <Input
                  value={tratamento.overbite}
                  onChange={(e) => setTratamento({ ...tratamento, overbite: e.target.value })}
                  placeholder="3.2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Linha Média:</label>
                <Input
                  value={tratamento.linhaMedia}
                  onChange={(e) => setTratamento({ ...tratamento, linhaMedia: e.target.value })}
                  placeholder="Desviada 2mm à direita"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Apinhamento:</label>
                <Input
                  value={tratamento.apinhamento}
                  onChange={(e) => setTratamento({ ...tratamento, apinhamento: e.target.value })}
                  placeholder="Moderado anterior inferior"
                />
              </div>
            </div>
          </div>

          {/* Análise Cefalométrica */}
          <div className="space-y-4">
            <h4 className="font-semibold">Análise Cefalométrica</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">SNA (°):</label>
                <Input
                  value={tratamento.cefalometria?.sna || ""}
                  onChange={(e) =>
                    setTratamento({
                      ...tratamento,
                      cefalometria: { ...tratamento.cefalometria, sna: e.target.value } as AnaliseCefalometrica,
                    })
                  }
                  placeholder="82"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">SNB (°):</label>
                <Input
                  value={tratamento.cefalometria?.snb || ""}
                  onChange={(e) =>
                    setTratamento({
                      ...tratamento,
                      cefalometria: { ...tratamento.cefalometria, snb: e.target.value } as AnaliseCefalometrica,
                    })
                  }
                  placeholder="78"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">ANB (°):</label>
                <Input
                  value={tratamento.cefalometria?.anb || ""}
                  onChange={(e) =>
                    setTratamento({
                      ...tratamento,
                      cefalometria: { ...tratamento.cefalometria, anb: e.target.value } as AnaliseCefalometrica,
                    })
                  }
                  placeholder="4"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">FMA (°):</label>
                <Input
                  value={tratamento.cefalometria?.fma || ""}
                  onChange={(e) =>
                    setTratamento({
                      ...tratamento,
                      cefalometria: { ...tratamento.cefalometria, fma: e.target.value } as AnaliseCefalometrica,
                    })
                  }
                  placeholder="25"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">IMPA (°):</label>
                <Input
                  value={tratamento.cefalometria?.impa || ""}
                  onChange={(e) =>
                    setTratamento({
                      ...tratamento,
                      cefalometria: { ...tratamento.cefalometria, impa: e.target.value } as AnaliseCefalometrica,
                    })
                  }
                  placeholder="90"
                />
              </div>
            </div>
          </div>

          {/* Análise Esquelética */}
          <div className="space-y-4">
            <h4 className="font-semibold">Análise Esquelética</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Padrão Esquelético:</label>
                <Select
                  value={tratamento.padraoEsqueletico}
                  onValueChange={(v) => setTratamento({ ...tratamento, padraoEsqueletico: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classe_i">Classe I Esquelética</SelectItem>
                    <SelectItem value="classe_ii">Classe II Esquelética</SelectItem>
                    <SelectItem value="classe_iii">Classe III Esquelética</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Padrão Vertical:</label>
                <Select
                  value={tratamento.padraoVertical}
                  onValueChange={(v) => setTratamento({ ...tratamento, padraoVertical: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="aumentado">Aumentado</SelectItem>
                    <SelectItem value="diminuido">Diminuído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plano de Tratamento */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Plano de Tratamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Aparelho:</label>
              <Input
                value={tratamento.tipoAparelho || ""}
                onChange={(e) => setTratamento({ ...tratamento, tipoAparelho: e.target.value })}
                placeholder="Ex: Fixo metálico"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status:</label>
              <Select
                value={tratamento.status}
                onValueChange={(v: any) => setTratamento({ ...tratamento, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Início:</label>
              <Input
                type="date"
                value={tratamento.dataInicio || ""}
                onChange={(e) => setTratamento({ ...tratamento, dataInicio: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Previsão Término:</label>
              <Input
                type="date"
                value={tratamento.previsaoTermino || ""}
                onChange={(e) => setTratamento({ ...tratamento, previsaoTermino: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Término:</label>
              <Input
                type="date"
                value={tratamento.dataTermino || ""}
                onChange={(e) => setTratamento({ ...tratamento, dataTermino: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Plano de Tratamento:</label>
            <Textarea
              value={tratamento.planoTratamento || ""}
              onChange={(e) => setTratamento({ ...tratamento, planoTratamento: e.target.value })}
              placeholder="Extrações, expansão, alinhamento, fechamento de espaços..."
              rows={4}
            />
          </div>

          <Button onClick={handleSalvar} className="w-full">
            Guardar Plano de Tratamento
          </Button>
        </CardContent>
      </Card>

      {/* Sequência de Fios */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sequência de Fios/Arcos</CardTitle>
          <CardDescription>Histórico de trocas de fios ortodônticos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {tratamento.fios.length > 0 && (
            <div className="space-y-2">
              {tratamento.fios.map((fio, idx) => (
                <div key={fio.id} className="p-3 border rounded-lg flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">#{idx + 1}</Badge>
                      <span className="font-medium">
                        {fio.tipo} {fio.espessura}
                      </span>
                      <Badge>{fio.arcada === "ambas" ? "Ambas" : fio.arcada === "superior" ? "Superior" : "Inferior"}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(fio.data).toLocaleDateString("pt-PT")}
                      {fio.observacoes && ` • ${fio.observacoes}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t pt-4 space-y-4">
            <p className="text-sm font-medium">Adicionar Novo Fio/Arco</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo *</label>
                <Select
                  value={novoFio.tipo}
                  onValueChange={(v) => setNovoFio({ ...novoFio, tipo: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NiTi">NiTi (Níquel-Titânio)</SelectItem>
                    <SelectItem value="Aço">Aço Inoxidável</SelectItem>
                    <SelectItem value="TMA">TMA (Beta-Titânio)</SelectItem>
                    <SelectItem value="Estético">Estético</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Espessura *</label>
                <Select
                  value={novoFio.espessura}
                  onValueChange={(v) => setNovoFio({ ...novoFio, espessura: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.014">0.014"</SelectItem>
                    <SelectItem value="0.016">0.016"</SelectItem>
                    <SelectItem value="0.018">0.018"</SelectItem>
                    <SelectItem value="0.016x0.022">0.016" x 0.022"</SelectItem>
                    <SelectItem value="0.019x0.025">0.019" x 0.025"</SelectItem>
                    <SelectItem value="0.021x0.025">0.021" x 0.025"</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Arcada</label>
                <Select
                  value={novoFio.arcada}
                  onValueChange={(v: any) => setNovoFio({ ...novoFio, arcada: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ambas">Ambas</SelectItem>
                    <SelectItem value="superior">Superior</SelectItem>
                    <SelectItem value="inferior">Inferior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Observações</label>
              <Textarea
                value={novoFio.observacoes}
                onChange={(e) => setNovoFio({ ...novoFio, observacoes: e.target.value })}
                placeholder="Início da fase de alinhamento..."
                rows={2}
              />
            </div>
            <Button onClick={handleAdicionarFio} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Fio/Arco
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Consultas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Consultas de Ortodontia</CardTitle>
          <CardDescription>Registo de consultas e procedimentos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {tratamento.consultas.length > 0 && (
            <div className="space-y-2">
              {tratamento.consultas.map((consulta) => (
                <div key={consulta.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">
                      {new Date(consulta.dataConsulta).toLocaleDateString("pt-PT")}
                    </span>
                    {consulta.proximaConsulta && (
                      <Badge variant="outline">
                        Próxima: {new Date(consulta.proximaConsulta).toLocaleDateString("pt-PT")}
                      </Badge>
                    )}
                  </div>
                  {consulta.procedimentos && (
                    <p className="text-sm text-muted-foreground">{consulta.procedimentos}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="border-t pt-4 space-y-4">
            <p className="text-sm font-medium">Nova Consulta</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Data *</label>
                <Input
                  type="date"
                  value={novaConsulta.dataConsulta}
                  onChange={(e) =>
                    setNovaConsulta({ ...novaConsulta, dataConsulta: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Próxima Consulta</label>
                <Input
                  type="date"
                  value={novaConsulta.proximaConsulta}
                  onChange={(e) =>
                    setNovaConsulta({ ...novaConsulta, proximaConsulta: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Procedimentos</label>
              <Textarea
                value={novaConsulta.procedimentos}
                onChange={(e) =>
                  setNovaConsulta({ ...novaConsulta, procedimentos: e.target.value })
                }
                placeholder="Troca de arco, ativação, colagem de braquetes..."
                rows={2}
              />
            </div>
            <Button onClick={handleAdicionarConsulta} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Consulta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
