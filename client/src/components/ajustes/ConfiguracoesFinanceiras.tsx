// @ts-nocheck
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export default function ConfiguracoesFinanceiras() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Configurações Financeiras
          </CardTitle>
          <CardDescription>
            Formas de pagamento, comissões, impostos e numeração de faturas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Em desenvolvimento...</p>
          <p className="text-sm text-gray-400 mt-2">
            Aqui será possível configurar:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-400 mt-2 space-y-1">
            <li>Formas de pagamento aceites</li>
            <li>Taxas e comissões</li>
            <li>Configurações de IVA</li>
            <li>Numeração de faturas e recibos</li>
            <li>Descontos padrão</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

