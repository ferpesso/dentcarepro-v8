// @ts-nocheck
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Edit, Save } from "lucide-react";

// Numeração FDI dos dentes
const DENTES_SUPERIORES = {
  direita: ["18", "17", "16", "15", "14", "13", "12", "11"],
  esquerda: ["21", "22", "23", "24", "25", "26", "27", "28"],
};

const DENTES_INFERIORES = {
  direita: ["48", "47", "46", "45", "44", "43", "42", "41"],
  esquerda: ["31", "32", "33", "34", "35", "36", "37", "38"],
};

const ESTADOS_DENTE = [
  { value: "sadio", label: "Sadio", cor: "#10B981", corClara: "#D1FAE5" },
  { value: "cariado", label: "Cariado", cor: "#EF4444", corClara: "#FEE2E2" },
  { value: "restaurado", label: "Restaurado", cor: "#3B82F6", corClara: "#DBEAFE" },
  { value: "tratado", label: "Tratado", cor: "#8B5CF6", corClara: "#EDE9FE" },
  { value: "ausente", label: "Ausente", cor: "#6B7280", corClara: "#F3F4F6" },
  { value: "implante", label: "Implante", cor: "#F59E0B", corClara: "#FEF3C7" },
  { value: "incluso", label: "Incluso", cor: "#EC4899", corClara: "#FCE7F3" },
  { value: "fraturado", label: "Fraturado", cor: "#DC2626", corClara: "#FEE2E2" },
];

interface FacesDente {
  mesial: string;
  distal: string;
  oclusal: string;
  vestibular: string;
  lingual: string;
}

interface DenteEstado {
  numeroDente: string;
  faces: FacesDente;
  observacoes?: string;
}

interface Odontograma3DProps {
  utenteId: string;
  dados?: DenteEstado[];
  onSalvar?: (dados: DenteEstado[]) => void;
}

export default function Odontograma3D({ utenteId, dados = [], onSalvar }: Odontograma3DProps) {
  const [modoEdicao, setModoEdicao] = useState(false);
  const [denteSelecionado, setDenteSelecionado] = useState<string | null>(null);
  const [faceSelecionada, setFaceSelecionada] = useState<keyof FacesDente | null>(null);
  const [estadosDentes, setEstadosDentes] = useState<Record<string, DenteEstado>>({});

  // Queries
  const { data: odontograma, refetch } = trpc.odontograma.obter.useQuery(
    { utenteId },
    { enabled: !!utenteId }
  );

  // Mutations
  const salvarMutation = trpc.odontograma.salvar.useMutation({
    onSuccess: () => {
      toast.success("Odontograma salvo com sucesso!");
      refetch();
      setModoEdicao(false);
      if (onSalvar) {
        onSalvar(Object.values(estadosDentes));
      }
    },
    onError: (error) => {
      toast.error(`Erro ao salvar: ${error.message}`);
    },
  });

  // Inicializar estados dos dentes
  useEffect(() => {
    const todosOsDentes = [
      ...DENTES_SUPERIORES.direita,
      ...DENTES_SUPERIORES.esquerda,
      ...DENTES_INFERIORES.direita,
      ...DENTES_INFERIORES.esquerda,
    ];

    const estadosIniciais: Record<string, DenteEstado> = {};
    todosOsDentes.forEach((num) => {
      estadosIniciais[num] = {
        numeroDente: num,
        faces: {
          mesial: "sadio",
          distal: "sadio",
          oclusal: "sadio",
          vestibular: "sadio",
          lingual: "sadio",
        },
        observacoes: "",
      };
    });

    setEstadosDentes(estadosIniciais);
  }, []);

  // Carregar dados do backend
  useEffect(() => {
    if (odontograma?.dentes) {
      const dentesMap: Record<string, DenteEstado> = {};
      odontograma.dentes.forEach((d) => {
        dentesMap[d.numeroDente] = d;
      });
      setEstadosDentes((prev) => ({ ...prev, ...dentesMap }));
    }
  }, [odontograma]);

  const getCorEstado = (estado: string) => {
    return ESTADOS_DENTE.find((e) => e.value === estado) || ESTADOS_DENTE[0];
  };

  const handleDenteClick = (numeroDente: string) => {
    if (modoEdicao) {
      setDenteSelecionado(numeroDente);
      setFaceSelecionada(null);
    }
  };

  const handleFaceClick = (face: keyof FacesDente) => {
    if (modoEdicao && denteSelecionado) {
      setFaceSelecionada(face);
    }
  };

  const handleAplicarEstado = (estado: string) => {
    if (!denteSelecionado || !faceSelecionada) return;

    setEstadosDentes((prev) => ({
      ...prev,
      [denteSelecionado]: {
        ...prev[denteSelecionado],
        faces: {
          ...prev[denteSelecionado].faces,
          [faceSelecionada]: estado,
        },
      },
    }));

    toast.success(`Estado aplicado: ${getCorEstado(estado).label}`);
  };

  const handleSalvar = () => {
    const dadosArray = Object.values(estadosDentes);
    salvarMutation.mutate({
      utenteId,
      dentes: dadosArray,
    });
  };

  // Calcular estatísticas
  const calcularEstatisticas = () => {
    const stats: Record<string, number> = {};
    ESTADOS_DENTE.forEach((e) => {
      stats[e.value] = 0;
    });

    Object.values(estadosDentes).forEach((dente) => {
      Object.values(dente.faces).forEach((estado) => {
        stats[estado] = (stats[estado] || 0) + 1;
      });
    });

    return stats;
  };

  const estatisticas = calcularEstatisticas();

  const renderDenteComFaces = (numeroDente: string) => {
    const dente = estadosDentes[numeroDente];
    if (!dente) return null;

    const selecionado = denteSelecionado === numeroDente;
    const faces = dente.faces;

    return (
      <div
        key={numeroDente}
        className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
          selecionado ? "scale-110" : "hover:scale-105"
        }`}
        onClick={() => handleDenteClick(numeroDente)}
      >
        {/* Representação visual das 5 faces */}
        <div className="relative w-12 h-12">
          {/* Face Oclusal (centro) */}
          <div
            className={`absolute inset-0 m-auto w-6 h-6 border-2 transition-all ${
              faceSelecionada === "oclusal" && selecionado ? "ring-2 ring-blue-500" : ""
            }`}
            style={{
              backgroundColor: getCorEstado(faces.oclusal).corClara,
              borderColor: getCorEstado(faces.oclusal).cor,
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleFaceClick("oclusal");
            }}
          />

          {/* Face Mesial (esquerda) */}
          <div
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-3 h-6 border-2 transition-all ${
              faceSelecionada === "mesial" && selecionado ? "ring-2 ring-blue-500" : ""
            }`}
            style={{
              backgroundColor: getCorEstado(faces.mesial).corClara,
              borderColor: getCorEstado(faces.mesial).cor,
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleFaceClick("mesial");
            }}
          />

          {/* Face Distal (direita) */}
          <div
            className={`absolute right-0 top-1/2 -translate-y-1/2 w-3 h-6 border-2 transition-all ${
              faceSelecionada === "distal" && selecionado ? "ring-2 ring-blue-500" : ""
            }`}
            style={{
              backgroundColor: getCorEstado(faces.distal).corClara,
              borderColor: getCorEstado(faces.distal).cor,
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleFaceClick("distal");
            }}
          />

          {/* Face Vestibular (cima) */}
          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 w-6 h-3 border-2 transition-all ${
              faceSelecionada === "vestibular" && selecionado ? "ring-2 ring-blue-500" : ""
            }`}
            style={{
              backgroundColor: getCorEstado(faces.vestibular).corClara,
              borderColor: getCorEstado(faces.vestibular).cor,
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleFaceClick("vestibular");
            }}
          />

          {/* Face Lingual (baixo) */}
          <div
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-3 border-2 transition-all ${
              faceSelecionada === "lingual" && selecionado ? "ring-2 ring-blue-500" : ""
            }`}
            style={{
              backgroundColor: getCorEstado(faces.lingual).corClara,
              borderColor: getCorEstado(faces.lingual).cor,
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleFaceClick("lingual");
            }}
          />
        </div>

        <span
          className={`text-xs font-mono ${
            selecionado ? "font-bold text-primary" : "text-muted-foreground"
          }`}
        >
          {numeroDente}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header com botões */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Odontograma Interativo</h3>
          <p className="text-sm text-muted-foreground">
            {modoEdicao
              ? "Clique em um dente e depois na face para editar"
              : "Clique em Editar para modificar o odontograma"}
          </p>
        </div>
        <div className="flex gap-2">
          {!modoEdicao ? (
            <Button onClick={() => setModoEdicao(true)} className="gap-2">
              <Edit className="h-4 w-4" />
              Editar
            </Button>
          ) : (
            <Button onClick={handleSalvar} className="gap-2 bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4" />
              Salvar
            </Button>
          )}
        </div>
      </div>

      {/* Legenda */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Legenda:</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {ESTADOS_DENTE.map((estado) => (
              <Badge
                key={estado.value}
                variant="outline"
                style={{
                  backgroundColor: estado.corClara,
                  borderColor: estado.cor,
                  color: "#000",
                }}
              >
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: estado.cor }}
                />
                {estado.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Odontograma Visual */}
      <Card>
        <CardContent className="pt-6 space-y-8">
          {/* Arcada Superior */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-center">Arcada Superior</p>
            <div className="flex justify-center gap-8">
              <div className="flex gap-2">
                {DENTES_SUPERIORES.direita.map(renderDenteComFaces)}
              </div>
              <div className="w-px bg-border" />
              <div className="flex gap-2">
                {DENTES_SUPERIORES.esquerda.map(renderDenteComFaces)}
              </div>
            </div>
          </div>

          {/* Linha divisória */}
          <div className="border-t-2 border-dashed border-border" />

          {/* Arcada Inferior */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-center">Arcada Inferior</p>
            <div className="flex justify-center gap-8">
              <div className="flex gap-2">
                {DENTES_INFERIORES.direita.map(renderDenteComFaces)}
              </div>
              <div className="w-px bg-border" />
              <div className="flex gap-2">
                {DENTES_INFERIORES.esquerda.map(renderDenteComFaces)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Painel de Edição */}
      {modoEdicao && denteSelecionado && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Editando Dente {denteSelecionado}</CardTitle>
            <CardDescription>
              {faceSelecionada
                ? `Face selecionada: ${faceSelecionada.toUpperCase()}`
                : "Selecione uma face do dente"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status:</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {ESTADOS_DENTE.map((estado) => (
                  <Button
                    key={estado.value}
                    variant="outline"
                    className="justify-start gap-2"
                    style={{
                      backgroundColor: estado.corClara,
                      borderColor: estado.cor,
                    }}
                    onClick={() => handleAplicarEstado(estado.value)}
                    disabled={!faceSelecionada}
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: estado.cor }}
                    />
                    {estado.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Observações</label>
              <Textarea
                value={estadosDentes[denteSelecionado]?.observacoes || ""}
                onChange={(e) =>
                  setEstadosDentes((prev) => ({
                    ...prev,
                    [denteSelecionado]: {
                      ...prev[denteSelecionado],
                      observacoes: e.target.value,
                    },
                  }))
                }
                placeholder="Notas sobre este dente..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumo do Estado Bucal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumo do Estado Bucal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ESTADOS_DENTE.map((estado) => (
              <div
                key={estado.value}
                className="flex flex-col items-center p-4 rounded-lg border-2"
                style={{ borderColor: estado.cor }}
              >
                <div className="text-3xl font-bold" style={{ color: estado.cor }}>
                  {estatisticas[estado.value] || 0}
                </div>
                <div className="text-sm text-muted-foreground">{estado.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
