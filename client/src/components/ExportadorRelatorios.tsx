// @ts-nocheck
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, FileSpreadsheet, Loader2 } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DadosRelatorio {
  receitas?: any[];
  despesas?: any[];
  comissoes?: any[];
  metricas?: {
    receitaTotal: number;
    despesaTotal: number;
    lucroLiquido: number;
    margemLucro: number;
  };
}

interface ExportadorRelatoriosProps {
  dados?: DadosRelatorio;
  periodo?: { inicio: string; fim: string };
}

export default function ExportadorRelatorios({ dados, periodo }: ExportadorRelatoriosProps) {
  const [tipoRelatorio, setTipoRelatorio] = useState("completo");
  const [exportando, setExportando] = useState(false);

  // Formatar moeda
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(valor);
  };

  // Formatar data
  const formatarData = (data: string) => {
    try {
      return format(new Date(data), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return data;
    }
  };

  // Gerar PDF
  const gerarPDF = () => {
    setExportando(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Cabeçalho
      doc.setFontSize(20);
      doc.setTextColor(139, 92, 246); // Roxo
      doc.text("DentCare PRO", pageWidth / 2, 20, { align: "center" });
      
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("Relatório Financeiro", pageWidth / 2, 30, { align: "center" });
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      if (periodo) {
        doc.text(
          `Período: ${formatarData(periodo.inicio)} a ${formatarData(periodo.fim)}`,
          pageWidth / 2,
          38,
          { align: "center" }
        );
      }
      doc.text(
        `Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`,
        pageWidth / 2,
        44,
        { align: "center" }
      );

      let yPos = 55;

      // Resumo Executivo
      if (dados?.metricas) {
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("Resumo Executivo", 14, yPos);
        yPos += 10;

        const resumoData = [
          ["Receita Total", formatarMoeda(dados.metricas.receitaTotal)],
          ["Despesa Total", formatarMoeda(dados.metricas.despesaTotal)],
          ["Lucro Líquido", formatarMoeda(dados.metricas.lucroLiquido)],
          ["Margem de Lucro", `${dados.metricas.margemLucro.toFixed(1)}%`],
        ];

        autoTable(doc, {
          startY: yPos,
          head: [["Métrica", "Valor"]],
          body: resumoData,
          theme: "grid",
          headStyles: { fillColor: [139, 92, 246], textColor: 255 },
          styles: { fontSize: 10 },
          columnStyles: {
            0: { fontStyle: "bold" },
            1: { halign: "right" },
          },
        });

        yPos = (doc as any).lastAutoTable.finalY + 15;
      }

      // Receitas
      if (tipoRelatorio === "completo" || tipoRelatorio === "receitas") {
        if (dados?.receitas && dados.receitas.length > 0) {
          doc.setFontSize(14);
          doc.text("Receitas Detalhadas", 14, yPos);
          yPos += 10;

          const receitasData = dados.receitas.map((r) => [
            formatarData(r.data),
            r.descricao || "-",
            r.categoria || "-",
            formatarMoeda(r.valor),
          ]);

          autoTable(doc, {
            startY: yPos,
            head: [["Data", "Descrição", "Categoria", "Valor"]],
            body: receitasData,
            theme: "striped",
            headStyles: { fillColor: [16, 185, 129], textColor: 255 },
            styles: { fontSize: 9 },
            columnStyles: {
              3: { halign: "right", fontStyle: "bold" },
            },
          });

          yPos = (doc as any).lastAutoTable.finalY + 15;
        }
      }

      // Despesas
      if (tipoRelatorio === "completo" || tipoRelatorio === "despesas") {
        if (dados?.despesas && dados.despesas.length > 0) {
          // Adicionar nova página se necessário
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }

          doc.setFontSize(14);
          doc.text("Despesas Detalhadas", 14, yPos);
          yPos += 10;

          const despesasData = dados.despesas.map((d) => [
            formatarData(d.data),
            d.descricao || "-",
            d.categoria || "-",
            formatarMoeda(d.valor),
          ]);

          autoTable(doc, {
            startY: yPos,
            head: [["Data", "Descrição", "Categoria", "Valor"]],
            body: despesasData,
            theme: "striped",
            headStyles: { fillColor: [239, 68, 68], textColor: 255 },
            styles: { fontSize: 9 },
            columnStyles: {
              3: { halign: "right", fontStyle: "bold" },
            },
          });

          yPos = (doc as any).lastAutoTable.finalY + 15;
        }
      }

      // Comissões
      if (tipoRelatorio === "completo" || tipoRelatorio === "comissoes") {
        if (dados?.comissoes && dados.comissoes.length > 0) {
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }

          doc.setFontSize(14);
          doc.text("Comissões de Dentistas", 14, yPos);
          yPos += 10;

          const comissoesData = dados.comissoes.map((c) => [
            c.dentista || "-",
            c.procedimento || "-",
            formatarMoeda(c.valor),
            formatarMoeda(c.comissao),
          ]);

          autoTable(doc, {
            startY: yPos,
            head: [["Dentista", "Procedimento", "Valor", "Comissão"]],
            body: comissoesData,
            theme: "striped",
            headStyles: { fillColor: [139, 92, 246], textColor: 255 },
            styles: { fontSize: 9 },
            columnStyles: {
              2: { halign: "right" },
              3: { halign: "right", fontStyle: "bold" },
            },
          });
        }
      }

      // Rodapé em todas as páginas
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Página ${i} de ${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      }

      // Salvar PDF
      const nomeArquivo = `relatorio-financeiro-${format(new Date(), "yyyy-MM-dd")}.pdf`;
      doc.save(nomeArquivo);
      
      toast.success("Relatório PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar relatório PDF");
    } finally {
      setExportando(false);
    }
  };

  // Gerar Excel
  const gerarExcel = () => {
    setExportando(true);
    
    try {
      const workbook = XLSX.utils.book_new();

      // Aba: Resumo
      if (dados?.metricas) {
        const resumoData = [
          ["DentCare PRO - Relatório Financeiro"],
          [""],
          periodo ? [`Período: ${formatarData(periodo.inicio)} a ${formatarData(periodo.fim)}`] : [],
          [`Gerado em: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}`],
          [""],
          ["Métrica", "Valor"],
          ["Receita Total", dados.metricas.receitaTotal],
          ["Despesa Total", dados.metricas.despesaTotal],
          ["Lucro Líquido", dados.metricas.lucroLiquido],
          ["Margem de Lucro (%)", dados.metricas.margemLucro],
        ];

        const wsResumo = XLSX.utils.aoa_to_sheet(resumoData);
        
        // Estilizar cabeçalho
        wsResumo["!cols"] = [{ wch: 20 }, { wch: 15 }];
        
        XLSX.utils.book_append_sheet(workbook, wsResumo, "Resumo");
      }

      // Aba: Receitas
      if (dados?.receitas && dados.receitas.length > 0) {
        const receitasData = [
          ["Data", "Descrição", "Categoria", "Valor"],
          ...dados.receitas.map((r) => [
            formatarData(r.data),
            r.descricao || "-",
            r.categoria || "-",
            r.valor,
          ]),
        ];

        const wsReceitas = XLSX.utils.aoa_to_sheet(receitasData);
        wsReceitas["!cols"] = [{ wch: 12 }, { wch: 30 }, { wch: 15 }, { wch: 12 }];
        
        XLSX.utils.book_append_sheet(workbook, wsReceitas, "Receitas");
      }

      // Aba: Despesas
      if (dados?.despesas && dados.despesas.length > 0) {
        const despesasData = [
          ["Data", "Descrição", "Categoria", "Valor"],
          ...dados.despesas.map((d) => [
            formatarData(d.data),
            d.descricao || "-",
            d.categoria || "-",
            d.valor,
          ]),
        ];

        const wsDespesas = XLSX.utils.aoa_to_sheet(despesasData);
        wsDespesas["!cols"] = [{ wch: 12 }, { wch: 30 }, { wch: 15 }, { wch: 12 }];
        
        XLSX.utils.book_append_sheet(workbook, wsDespesas, "Despesas");
      }

      // Aba: Comissões
      if (dados?.comissoes && dados.comissoes.length > 0) {
        const comissoesData = [
          ["Dentista", "Procedimento", "Valor", "Comissão"],
          ...dados.comissoes.map((c) => [
            c.dentista || "-",
            c.procedimento || "-",
            c.valor,
            c.comissao,
          ]),
        ];

        const wsComissoes = XLSX.utils.aoa_to_sheet(comissoesData);
        wsComissoes["!cols"] = [{ wch: 20 }, { wch: 25 }, { wch: 12 }, { wch: 12 }];
        
        XLSX.utils.book_append_sheet(workbook, wsComissoes, "Comissões");
      }

      // Salvar Excel
      const nomeArquivo = `relatorio-financeiro-${format(new Date(), "yyyy-MM-dd")}.xlsx`;
      XLSX.writeFile(workbook, nomeArquivo);
      
      toast.success("Relatório Excel gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar Excel:", error);
      toast.error("Erro ao gerar relatório Excel");
    } finally {
      setExportando(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Download className="w-5 h-5 text-purple-600" />
          <CardTitle>Exportar Relatórios</CardTitle>
        </div>
        <CardDescription>
          Gere relatórios profissionais em PDF ou Excel
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo de Relatório</label>
          <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="completo">Relatório Completo</SelectItem>
              <SelectItem value="receitas">Apenas Receitas</SelectItem>
              <SelectItem value="despesas">Apenas Despesas</SelectItem>
              <SelectItem value="comissoes">Apenas Comissões</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={gerarPDF}
            disabled={exportando}
            className="gap-2"
            variant="default"
          >
            {exportando ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            Exportar PDF
          </Button>

          <Button
            onClick={gerarExcel}
            disabled={exportando}
            className="gap-2"
            variant="outline"
          >
            {exportando ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-4 h-4" />
            )}
            Exportar Excel
          </Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <p>• PDF: Relatório formatado e profissional</p>
          <p>• Excel: Dados editáveis com fórmulas</p>
          {periodo && (
            <p>
              • Período: {formatarData(periodo.inicio)} a {formatarData(periodo.fim)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

