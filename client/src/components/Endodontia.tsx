// @ts-nocheck
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Clock } from "lucide-react";
import { toast } from "sonner";

interface CanalData {
  comprimentoTrabalho: string;
  diametroApical: string;
  curvatura: string;
  instrumentacao: string;
}

interface SessaoEndo {
  id: string;
  data: string;
  procedimentos: string;
  observacoes: string;
}

interface TratamentoEndodontico {
  id?: string;
  numeroDente: string;
  
  // Diagnóstico
  diagnosticoPrincipal: string;
  sintomas: string[];
  
  // Testes de Vitalidade
  testesVitalidade: {
    testeFrio: string;
    testeCalor: string;
    testeEletrico: string;
    percussaoVertical: string;
    percussaoHorizontal: string;
    palpacao: string;
  };
  
  // Anatomia dos Canais
  numeroCanais: number;
  canais: {
    mesioVestibular?: CanalData;
    distoVestibular?: CanalData;
    palatino?: CanalData;
    outros?: CanalData[];
  };
  
  // Status do Tratamento
  status: "em_andamento" | "concluido" | "abandonado";
  prognostico: "favoravel" | "reservado" | "desfavoravel";
  sessoesRealizadas: number;
  
  // Histórico
  sessoes: SessaoEndo[];
  
  dataInicio?: string;
  dataFinalizacao?: string;
  observacoes?: string;
}

interface EndodontiaProps {
  utenteId: string;
  tratamentos?: TratamentoEndodontico[];
  onSalvar?: (tratamentos: TratamentoEndodontico[]) => void;
}

const DIAGNOSTICOS = [
  "Pulpite Irreversível",
  "Necrose Pulpar",
  "Periodontite Apical Aguda",
  "Periodontite Apical Crônica",
  "Abscesso Periapical",
  "Retratamento Endodôntico",
];

const SINTOMAS = [
  "Dor Espontânea",
  "Sensibilidade ao Frio",
  "Dor Provocada",
  "Sensibilidade ao Calor",
  "Dor à Mastigação",
  "Edema",
  "Fístula",
  "Mobilidade Dentária",
];

const RESULTADOS_TESTE = [
  "Positivo Prolongado",
  "Positivo Intenso",
  "Positivo Baixo",
  "Negativo",
  "Levemente Positivo",
];

const CURVATURAS = ["Reta", "Leve", "Moderada", "Severa"];

export default function Endodontia({ utenteId, tratamentos = [], onSalvar }: EndodontiaProps) {
  const [lista, setLista] = useState<TratamentoEndodontico[]>(tratamentos);
  const [editando, setEditando] = useState<TratamentoEndodontico | null>(null);
  const [novoTratamento, setNovoTratamento] = useState(false);

  const tratamentoVazio = (): TratamentoEndodontico => ({
    numeroDente: "",
    diagnosticoPrincipal: "",
    sintomas: [],
    testesVitalidade: {
      testeFrio: "",
      testeCalor: "",
      testeEletrico: "",
      percussaoVertical: "",
      percussaoHorizontal: "",
      palpacao: "",
    },
    numeroCanais: 1,
    canais: {},
    status: "em_andamento",
    prognostico: "favoravel",
    sessoesRealizadas: 0,
    sessoes: [],
  });

  const handleNovo = () => {
    setEditando(tratamentoVazio());
    setNovoTratamento(true);
  };

  const handleEditar = (tratamento: TratamentoEndodontico) => {
    setEditando({ ...tratamento });
    setNovoTratamento(false);
  };

  const handleSalvar = () => {
    if (!editando || !editando.numeroDente) {
      toast.error("Preencha o número do dente!");
      return;
    }

    if (novoTratamento) {
      setLista([...lista, { ...editando, id: Date.now().toString() }]);
      toast.success("Tratamento criado!");
    } else {
      setLista(lista.map((t) => (t.id === editando.id ? editando : t)));
      toast.success("Tratamento atualizado!");
    }

    setEditando(null);
    setNovoTratamento(false);
  };

  const handleRemover = (id: string) => {
    if (confirm("Remover este tratamento?")) {
      setLista(lista.filter((t) => t.id !== id));
      toast.success("Tratamento removido!");
    }
  };

  const handleSalvarTodos = () => {
    if (onSalvar) {
      onSalvar(lista);
    }
    toast.success("Endodontia salva com sucesso!");
  };

  const toggleSintoma = (sintoma: string) => {
    if (!editando) return;
    const sintomas = editando.sintomas.includes(sintoma)
      ? editando.sintomas.filter((s) => s !== sintoma)
      : [...editando.sintomas, sintoma];
    setEditando({ ...editando, sintomas });
  };

  const handleNovaSessao = () => {
    if (!editando) return;
    const novaSessao: SessaoEndo = {
      id: Date.now().toString(),
      data: new Date().toISOString().split("T")[0],
      procedimentos: "",
      observacoes: "",
    };
    setEditando({
      ...editando,
      sessoes: [...editando.sessoes, novaSessao],
      sessoesRealizadas: editando.sessoesRealizadas + 1,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Módulo de Endodontia</CardTitle>
              <CardDescription>Gestão completa de tratamentos endodônticos</CardDescription>
            </div>
            <Button onClick={handleNovo} className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Sessão
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {lista.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum tratamento endodôntico registado
            </div>
          ) : (
            <div className="space-y-4">
              {lista.map((tratamento) => (
                <Card key={tratamento.id} className="border-2">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Dente {tratamento.numeroDente}</CardTitle>
                        <CardDescription>{tratamento.diagnosticoPrincipal}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge
                          variant={
                            tratamento.status === "concluido"
                              ? "default"
                              : tratamento.status === "em_andamento"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {tratamento.status === "em_andamento"
                            ? "Em Andamento"
                            : tratamento.status === "concluido"
                            ? "Concluído"
                            : "Abandonado"}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditar(tratamento)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemover(tratamento.id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Canais:</span>{" "}
                        {tratamento.numeroCanais}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Sessões:</span>{" "}
                        {tratamento.sessoesRealizadas}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Prognóstico:</span>{" "}
                        {tratamento.prognostico === "favoravel"
                          ? "Favorável"
                          : tratamento.prognostico === "reservado"
                          ? "Reservado"
                          : "Desfavorável"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Formulário de Edição */}
      {editando && (
        <Card>
          <CardHeader>
            <CardTitle>
              {novoTratamento ? "Novo Tratamento Endodôntico" : `Editando Dente ${editando.numeroDente}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dados Básicos */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Número do Dente *</label>
                <Input
                  value={editando.numeroDente}
                  onChange={(e) => setEditando({ ...editando, numeroDente: e.target.value })}
                  placeholder="Ex: 16"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Número de Canais</label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={editando.numeroCanais}
                  onChange={(e) =>
                    setEditando({ ...editando, numeroCanais: parseInt(e.target.value) || 1 })
                  }
                />
              </div>
            </div>

            {/* Diagnóstico */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Diagnóstico</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium">Diagnóstico Principal:</label>
                <Select
                  value={editando.diagnosticoPrincipal}
                  onValueChange={(value) =>
                    setEditando({ ...editando, diagnosticoPrincipal: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o diagnóstico" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIAGNOSTICOS.map((diag) => (
                      <SelectItem key={diag} value={diag}>
                        {diag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sintomas Apresenta:</label>
                <div className="grid grid-cols-2 gap-3">
                  {SINTOMAS.map((sintoma) => (
                    <div key={sintoma} className="flex items-center space-x-2">
                      <Checkbox
                        id={sintoma}
                        checked={editando.sintomas.includes(sintoma)}
                        onCheckedChange={() => toggleSintoma(sintoma)}
                      />
                      <label htmlFor={sintoma} className="text-sm cursor-pointer">
                        {sintoma}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Testes de Vitalidade */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Testes de Vitalidade</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Teste ao Frio:</label>
                  <Select
                    value={editando.testesVitalidade.testeFrio}
                    onValueChange={(value) =>
                      setEditando({
                        ...editando,
                        testesVitalidade: { ...editando.testesVitalidade, testeFrio: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {RESULTADOS_TESTE.map((res) => (
                        <SelectItem key={res} value={res}>
                          {res}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Teste ao Calor:</label>
                  <Select
                    value={editando.testesVitalidade.testeCalor}
                    onValueChange={(value) =>
                      setEditando({
                        ...editando,
                        testesVitalidade: { ...editando.testesVitalidade, testeCalor: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {RESULTADOS_TESTE.map((res) => (
                        <SelectItem key={res} value={res}>
                          {res}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Teste Elétrico:</label>
                  <Select
                    value={editando.testesVitalidade.testeEletrico}
                    onValueChange={(value) =>
                      setEditando({
                        ...editando,
                        testesVitalidade: { ...editando.testesVitalidade, testeEletrico: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {RESULTADOS_TESTE.map((res) => (
                        <SelectItem key={res} value={res}>
                          {res}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Percussão Vertical:</label>
                  <Select
                    value={editando.testesVitalidade.percussaoVertical}
                    onValueChange={(value) =>
                      setEditando({
                        ...editando,
                        testesVitalidade: {
                          ...editando.testesVitalidade,
                          percussaoVertical: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {RESULTADOS_TESTE.map((res) => (
                        <SelectItem key={res} value={res}>
                          {res}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Percussão Horizontal:</label>
                  <Select
                    value={editando.testesVitalidade.percussaoHorizontal}
                    onValueChange={(value) =>
                      setEditando({
                        ...editando,
                        testesVitalidade: {
                          ...editando.testesVitalidade,
                          percussaoHorizontal: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {RESULTADOS_TESTE.map((res) => (
                        <SelectItem key={res} value={res}>
                          {res}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Palpação:</label>
                  <Select
                    value={editando.testesVitalidade.palpacao}
                    onValueChange={(value) =>
                      setEditando({
                        ...editando,
                        testesVitalidade: { ...editando.testesVitalidade, palpacao: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {RESULTADOS_TESTE.map((res) => (
                        <SelectItem key={res} value={res}>
                          {res}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Anatomia dos Canais */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Anatomia dos Canais</h3>
              
              {/* Canal Mesio-vestibular */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Canal Mesio-vestibular</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Comprimento de Trabalho (mm):</label>
                    <Input
                      value={editando.canais.mesioVestibular?.comprimentoTrabalho || ""}
                      onChange={(e) =>
                        setEditando({
                          ...editando,
                          canais: {
                            ...editando.canais,
                            mesioVestibular: {
                              ...editando.canais.mesioVestibular,
                              comprimentoTrabalho: e.target.value,
                            } as CanalData,
                          },
                        })
                      }
                      placeholder="21.5"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Diâmetro Apical:</label>
                    <Input
                      value={editando.canais.mesioVestibular?.diametroApical || ""}
                      onChange={(e) =>
                        setEditando({
                          ...editando,
                          canais: {
                            ...editando.canais,
                            mesioVestibular: {
                              ...editando.canais.mesioVestibular,
                              diametroApical: e.target.value,
                            } as CanalData,
                          },
                        })
                      }
                      placeholder="25"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Curvatura:</label>
                    <Select
                      value={editando.canais.mesioVestibular?.curvatura || ""}
                      onValueChange={(value) =>
                        setEditando({
                          ...editando,
                          canais: {
                            ...editando.canais,
                            mesioVestibular: {
                              ...editando.canais.mesioVestibular,
                              curvatura: value,
                            } as CanalData,
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {CURVATURAS.map((curv) => (
                          <SelectItem key={curv} value={curv}>
                            {curv}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Instrumentação:</label>
                    <Input
                      value={editando.canais.mesioVestibular?.instrumentacao || ""}
                      onChange={(e) =>
                        setEditando({
                          ...editando,
                          canais: {
                            ...editando.canais,
                            mesioVestibular: {
                              ...editando.canais.mesioVestibular,
                              instrumentacao: e.target.value,
                            } as CanalData,
                          },
                        })
                      }
                      placeholder="ProTaper Next X2"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status do Tratamento */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Status do Tratamento</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status:</label>
                  <Select
                    value={editando.status}
                    onValueChange={(value: any) => setEditando({ ...editando, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="em_andamento">Em Andamento</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                      <SelectItem value="abandonado">Abandonado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prognóstico:</label>
                  <Select
                    value={editando.prognostico}
                    onValueChange={(value: any) => setEditando({ ...editando, prognostico: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="favoravel">Favorável</SelectItem>
                      <SelectItem value="reservado">Reservado</SelectItem>
                      <SelectItem value="desfavoravel">Desfavorável</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sessões Realizadas:</label>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="text-2xl font-bold">{editando.sessoesRealizadas}</span>
                </div>
              </div>
            </div>

            {/* Histórico de Sessões */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Histórico de Sessões</h3>
                <Button variant="outline" size="sm" onClick={handleNovaSessao} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Sessão
                </Button>
              </div>
              {editando.sessoes.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma sessão registada</p>
              ) : (
                <div className="space-y-2">
                  {editando.sessoes.map((sessao, idx) => (
                    <Card key={sessao.id}>
                      <CardHeader>
                        <CardTitle className="text-sm">
                          Sessão {idx + 1} - {new Date(sessao.data).toLocaleDateString("pt-PT")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Input
                          placeholder="Procedimentos realizados"
                          value={sessao.procedimentos}
                          onChange={(e) => {
                            const novasSessoes = [...editando.sessoes];
                            novasSessoes[idx].procedimentos = e.target.value;
                            setEditando({ ...editando, sessoes: novasSessoes });
                          }}
                        />
                        <Textarea
                          placeholder="Observações"
                          value={sessao.observacoes}
                          onChange={(e) => {
                            const novasSessoes = [...editando.sessoes];
                            novasSessoes[idx].observacoes = e.target.value;
                            setEditando({ ...editando, sessoes: novasSessoes });
                          }}
                          rows={2}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Observações Gerais */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Observações Gerais:</label>
              <Textarea
                value={editando.observacoes || ""}
                onChange={(e) => setEditando({ ...editando, observacoes: e.target.value })}
                placeholder="Notas adicionais sobre o tratamento..."
                rows={4}
              />
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-2">
              <Button onClick={handleSalvar} className="flex-1">
                Salvar Tratamento
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditando(null);
                  setNovoTratamento(false);
                }}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botão Salvar Todos */}
      {lista.length > 0 && !editando && (
        <div className="flex justify-end">
          <Button onClick={handleSalvarTodos} size="lg" className="gap-2">
            Salvar Todos os Tratamentos
          </Button>
        </div>
      )}
    </div>
  );
}
