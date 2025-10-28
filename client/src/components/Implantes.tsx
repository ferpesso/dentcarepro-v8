// @ts-nocheck
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Calendar, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ControleOsseointegra {
  id: string;
  data: string;
  semana: number;
  dor: "ausente" | "leve" | "moderada" | "severa";
  edema: "ausente" | "leve" | "moderado" | "severo";
  observacoes: string;
  status: "normal" | "atencao" | "problema";
}

interface DadosProtese {
  tipo: string; // Coroa Cimentada, Coroa Parafusada, Prótese Híbrida, etc
  material: string; // Zircônia, Metalocerâmica, etc
  moldagem: string;
  prova: string;
  instalacao: string;
  observacoes: string;
}

interface Implante {
  id?: string;
  posicao: string;
  
  // Planejamento
  indicacao: string;
  alturaOssea: string;
  larguraOssea: string;
  densidadeOssea: string; // D1, D2, D3, D4
  guiaCirurgico: boolean;
  
  // Dados do Implante
  marca?: string;
  modelo?: string;
  diametro?: string;
  comprimento?: string;
  lote?: string;
  
  // Cirurgia
  dataColocacao?: string;
  torqueInsercao?: string;
  estabilidadePrimaria?: string; // ISQ
  enxertoOsseo?: boolean;
  membrana?: boolean;
  
  // Osseointegração
  dataCarga?: string;
  diasOsseointegração?: number;
  controles: ControleOsseointegra[];
  
  // Prótese
  protese?: DadosProtese;
  
  // Status
  status: "planejado" | "cirurgia" | "osseointegração" | "protese" | "concluido" | "falha";
  observacoes?: string;
}

interface ImplantesProps {
  utenteId: string;
  implantes?: Implante[];
  onSalvar?: (implantes: Implante[]) => void;
}

const STATUS_LABELS = {
  planejado: "Planejado",
  cirurgia: "Cirurgia",
  osseointegração: "Osseointegração",
  protese: "Prótese",
  concluido: "Concluído",
  falha: "Falha",
};

const STATUS_COLORS = {
  planejado: "bg-gray-200",
  cirurgia: "bg-yellow-400",
  osseointegração: "bg-orange-400",
  protese: "bg-blue-400",
  concluido: "bg-green-500",
  falha: "bg-red-500",
};

export default function Implantes({ utenteId, implantes = [], onSalvar }: ImplantesProps) {
  const [lista, setLista] = useState<Implante[]>(implantes);
  const [editando, setEditando] = useState<Implante | null>(null);
  const [novo, setNovo] = useState(false);

  const handleNovo = () => {
    setEditando({
      posicao: "",
      status: "planejado",
      indicacao: "",
      alturaOssea: "",
      larguraOssea: "",
      densidadeOssea: "D2",
      guiaCirurgico: false,
      enxertoOsseo: false,
      membrana: false,
      controles: [],
    });
    setNovo(true);
  };

  const handleSalvar = () => {
    if (!editando?.posicao) {
      toast.error("Preencha a posição!");
      return;
    }
    
    // Calcular dias de osseointegração
    if (editando.dataColocacao && editando.dataCarga) {
      const inicio = new Date(editando.dataColocacao);
      const fim = new Date(editando.dataCarga);
      const dias = Math.floor((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
      editando.diasOsseointegração = dias;
    }
    
    if (novo) {
      setLista([...lista, { ...editando, id: Date.now().toString() }]);
    } else {
      setLista(lista.map((i) => (i.id === editando.id ? editando : i)));
    }
    setEditando(null);
    setNovo(false);
    toast.success("Implante salvo!");
  };

  const handleRemover = (id: string) => {
    if (confirm("Remover este implante?")) {
      setLista(lista.filter((i) => i.id !== id));
      toast.success("Implante removido!");
    }
  };

  const handleNovoControle = () => {
    if (!editando) return;
    const novoControle: ControleOsseointegra = {
      id: Date.now().toString(),
      data: new Date().toISOString().split("T")[0],
      semana: editando.controles.length + 1,
      dor: "ausente",
      edema: "ausente",
      observacoes: "",
      status: "normal",
    };
    setEditando({
      ...editando,
      controles: [...editando.controles, novoControle],
    });
  };

  const calcularProgresso = (status: string) => {
    const etapas = ["planejado", "cirurgia", "osseointegração", "protese", "concluido"];
    const indice = etapas.indexOf(status);
    return ((indice + 1) / etapas.length) * 100;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Módulo de Implantes</CardTitle>
              <CardDescription>Gestão completa de implantes dentários</CardDescription>
            </div>
            <Button onClick={handleNovo} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Controle
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {lista.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum implante registado</p>
          ) : (
            <div className="space-y-4">
              {lista.map((imp) => (
                <Card key={imp.id} className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Posição {imp.posicao}</CardTitle>
                        <CardDescription>
                          {imp.marca} {imp.modelo} • {imp.diametro} × {imp.comprimento}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={imp.status === "concluido" ? "default" : "secondary"}>
                          {STATUS_LABELS[imp.status]}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditando(imp);
                            setNovo(false);
                          }}
                        >
                          Editar
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleRemover(imp.id!)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Cronograma Visual */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Progresso do Tratamento</span>
                        <span className="text-muted-foreground">
                          {imp.diasOsseointegração
                            ? `Osseointegração: ${imp.diasOsseointegração} dias`
                            : ""}
                        </span>
                      </div>
                      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            imp.status === "falha" ? "bg-red-500" : "bg-green-500"
                          }`}
                          style={{ width: `${calcularProgresso(imp.status)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Planejamento</span>
                        <span>Cirurgia</span>
                        <span>Osseointegração</span>
                        <span>Prótese</span>
                        <span>Concluído</span>
                      </div>
                    </div>

                    {/* Informações Resumidas */}
                    <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                      {imp.dataColocacao && (
                        <div>
                          <span className="text-muted-foreground">Cirurgia:</span>{" "}
                          {new Date(imp.dataColocacao).toLocaleDateString("pt-PT")}
                        </div>
                      )}
                      {imp.dataCarga && (
                        <div>
                          <span className="text-muted-foreground">Carga:</span>{" "}
                          {new Date(imp.dataCarga).toLocaleDateString("pt-PT")}
                        </div>
                      )}
                      {imp.controles.length > 0 && (
                        <div>
                          <span className="text-muted-foreground">Controles:</span>{" "}
                          {imp.controles.length}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {editando && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {novo ? "Novo Implante" : `Editando Implante - Posição ${editando.posicao}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Planejamento */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Planejamento</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Posição (Dente) *</label>
                  <Input
                    value={editando.posicao}
                    onChange={(e) => setEditando({ ...editando, posicao: e.target.value })}
                    placeholder="Ex: 16"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Indicação:</label>
                  <Select
                    value={editando.indicacao}
                    onValueChange={(v) => setEditando({ ...editando, indicacao: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unitario">Unitário</SelectItem>
                      <SelectItem value="multiplos">Múltiplos</SelectItem>
                      <SelectItem value="protocolo">Protocolo</SelectItem>
                      <SelectItem value="overdenture">Overdenture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Altura Óssea (mm):</label>
                  <Input
                    value={editando.alturaOssea}
                    onChange={(e) => setEditando({ ...editando, alturaOssea: e.target.value })}
                    placeholder="12.5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Largura Óssea (mm):</label>
                  <Input
                    value={editando.larguraOssea}
                    onChange={(e) => setEditando({ ...editando, larguraOssea: e.target.value })}
                    placeholder="7.2"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Densidade Óssea:</label>
                  <Select
                    value={editando.densidadeOssea}
                    onValueChange={(v) => setEditando({ ...editando, densidadeOssea: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="D1">D1 - Osso cortical espesso</SelectItem>
                      <SelectItem value="D2">D2 - Osso cortical espesso com medular densa</SelectItem>
                      <SelectItem value="D3">D3 - Osso cortical fino com medular densa</SelectItem>
                      <SelectItem value="D4">D4 - Osso cortical fino com medular pouco densa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="guia"
                    checked={editando.guiaCirurgico}
                    onChange={(e) => setEditando({ ...editando, guiaCirurgico: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="guia" className="text-sm font-medium cursor-pointer">
                    Guia Cirúrgico
                  </label>
                </div>
              </div>
            </div>

            {/* Dados do Implante */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dados do Implante</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Marca:</label>
                  <Input
                    value={editando.marca || ""}
                    onChange={(e) => setEditando({ ...editando, marca: e.target.value })}
                    placeholder="Ex: Straumann"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Modelo:</label>
                  <Input
                    value={editando.modelo || ""}
                    onChange={(e) => setEditando({ ...editando, modelo: e.target.value })}
                    placeholder="Ex: BLT"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Lote:</label>
                  <Input
                    value={editando.lote || ""}
                    onChange={(e) => setEditando({ ...editando, lote: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Diâmetro:</label>
                  <Input
                    value={editando.diametro || ""}
                    onChange={(e) => setEditando({ ...editando, diametro: e.target.value })}
                    placeholder="4.1mm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Comprimento:</label>
                  <Input
                    value={editando.comprimento || ""}
                    onChange={(e) => setEditando({ ...editando, comprimento: e.target.value })}
                    placeholder="10mm"
                  />
                </div>
              </div>
            </div>

            {/* Cirurgia */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Cirurgia</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Colocação:</label>
                  <Input
                    type="date"
                    value={editando.dataColocacao || ""}
                    onChange={(e) => setEditando({ ...editando, dataColocacao: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Torque Inserção (Ncm):</label>
                  <Input
                    value={editando.torqueInsercao || ""}
                    onChange={(e) => setEditando({ ...editando, torqueInsercao: e.target.value })}
                    placeholder="35"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estabilidade Primária (ISQ):</label>
                  <Input
                    value={editando.estabilidadePrimaria || ""}
                    onChange={(e) =>
                      setEditando({ ...editando, estabilidadePrimaria: e.target.value })
                    }
                    placeholder="70"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enxerto"
                    checked={editando.enxertoOsseo}
                    onChange={(e) => setEditando({ ...editando, enxertoOsseo: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="enxerto" className="text-sm font-medium cursor-pointer">
                    Enxerto Ósseo
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="membrana"
                    checked={editando.membrana}
                    onChange={(e) => setEditando({ ...editando, membrana: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="membrana" className="text-sm font-medium cursor-pointer">
                    Membrana
                  </label>
                </div>
              </div>
            </div>

            {/* Controles de Osseointegração */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Controles de Osseointegração</h3>
                <Button variant="outline" size="sm" onClick={handleNovoControle} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Controle
                </Button>
              </div>

              {editando.controles.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum controle registado</p>
              ) : (
                <div className="space-y-2">
                  {editando.controles.map((controle, idx) => (
                    <Card key={controle.id}>
                      <CardHeader>
                        <CardTitle className="text-sm">
                          Controle {idx + 1} - {new Date(controle.data).toLocaleDateString("pt-PT")}{" "}
                          ({controle.semana}ª semana)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Dor:</label>
                          <Select
                            value={controle.dor}
                            onValueChange={(v: any) => {
                              const novosControles = [...editando.controles];
                              novosControles[idx].dor = v;
                              setEditando({ ...editando, controles: novosControles });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ausente">Ausente</SelectItem>
                              <SelectItem value="leve">Leve</SelectItem>
                              <SelectItem value="moderada">Moderada</SelectItem>
                              <SelectItem value="severa">Severa</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Edema:</label>
                          <Select
                            value={controle.edema}
                            onValueChange={(v: any) => {
                              const novosControles = [...editando.controles];
                              novosControles[idx].edema = v;
                              setEditando({ ...editando, controles: novosControles });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ausente">Ausente</SelectItem>
                              <SelectItem value="leve">Leve</SelectItem>
                              <SelectItem value="moderado">Moderado</SelectItem>
                              <SelectItem value="severo">Severo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Status:</label>
                          <Badge
                            variant={
                              controle.status === "normal"
                                ? "default"
                                : controle.status === "atencao"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {controle.status === "normal"
                              ? "Normal"
                              : controle.status === "atencao"
                              ? "Atenção"
                              : "Problema"}
                          </Badge>
                        </div>
                        <div className="col-span-3 space-y-2">
                          <label className="text-sm font-medium">Observações:</label>
                          <Textarea
                            value={controle.observacoes}
                            onChange={(e) => {
                              const novosControles = [...editando.controles];
                              novosControles[idx].observacoes = e.target.value;
                              setEditando({ ...editando, controles: novosControles });
                            }}
                            rows={2}
                            placeholder="Cicatrização dentro da normalidade..."
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Carga:</label>
                  <Input
                    type="date"
                    value={editando.dataCarga || ""}
                    onChange={(e) => setEditando({ ...editando, dataCarga: e.target.value })}
                  />
                </div>
                {editando.diasOsseointegração && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Dias de Osseointegração:</label>
                    <Input value={editando.diasOsseointegração} disabled />
                  </div>
                )}
              </div>
            </div>

            {/* Dados da Prótese */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dados da Prótese</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo:</label>
                  <Select
                    value={editando.protese?.tipo || ""}
                    onValueChange={(v) =>
                      setEditando({
                        ...editando,
                        protese: { ...editando.protese, tipo: v } as DadosProtese,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coroa_cimentada">Coroa Cimentada</SelectItem>
                      <SelectItem value="coroa_parafusada">Coroa Parafusada</SelectItem>
                      <SelectItem value="protese_hibrida">Prótese Híbrida</SelectItem>
                      <SelectItem value="overdenture">Overdenture</SelectItem>
                      <SelectItem value="protocolo">Protocolo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Material:</label>
                  <Select
                    value={editando.protese?.material || ""}
                    onValueChange={(v) =>
                      setEditando({
                        ...editando,
                        protese: { ...editando.protese, material: v } as DadosProtese,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zirconia">Zircônia</SelectItem>
                      <SelectItem value="metaloceramic">Metalocerâmica</SelectItem>
                      <SelectItem value="pmma">PMMA</SelectItem>
                      <SelectItem value="resina">Resina</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Moldagem:</label>
                  <Input
                    type="date"
                    value={editando.protese?.moldagem || ""}
                    onChange={(e) =>
                      setEditando({
                        ...editando,
                        protese: { ...editando.protese, moldagem: e.target.value } as DadosProtese,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prova:</label>
                  <Input
                    type="date"
                    value={editando.protese?.prova || ""}
                    onChange={(e) =>
                      setEditando({
                        ...editando,
                        protese: { ...editando.protese, prova: e.target.value } as DadosProtese,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Instalação:</label>
                  <Input
                    type="date"
                    value={editando.protese?.instalacao || ""}
                    onChange={(e) =>
                      setEditando({
                        ...editando,
                        protese: {
                          ...editando.protese,
                          instalacao: e.target.value,
                        } as DadosProtese,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Status e Observações */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status:</label>
                <Select
                  value={editando.status}
                  onValueChange={(v: any) => setEditando({ ...editando, status: v })}
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
              <div className="space-y-2">
                <label className="text-sm font-medium">Observações Gerais:</label>
                <Textarea
                  value={editando.observacoes || ""}
                  onChange={(e) => setEditando({ ...editando, observacoes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSalvar} className="flex-1">
                Salvar Implante
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditando(null);
                  setNovo(false);
                }}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {lista.length > 0 && !editando && (
        <Button onClick={() => onSalvar?.(lista)} className="w-full" size="lg">
          Guardar Todas as Alterações
        </Button>
      )}
    </div>
  );
}
