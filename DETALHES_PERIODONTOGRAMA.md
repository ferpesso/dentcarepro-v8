# 📊 Detalhes do Periodontograma - Sistema de Referência

**Data:** 28 de Outubro de 2025

---

## 🎨 Layout Visual

### Legenda de Cores:
- 🟢 **1-3mm** (Saudável) - Verde
- 🟡 **4-5mm** (Atenção) - Amarelo/Laranja
- 🔴 **6+mm** (Problema) - Vermelho
- 🔴 **Sangramento** - Marcador vermelho (ponto)

### Estrutura por Dente:

Cada dente é representado por um **grid 3x2** (6 pontos de sondagem):

```
┌─────┬─────┬─────┐
│  M  │  C  │  D  │  ← Vestibular
├─────┼─────┼─────┤
│  M  │  C  │  D  │  ← Lingual/Palatino
└─────┴─────┴─────┘

M = Mesial
C = Central
D = Distal
```

**Exemplo do dente 18:**
```
┌─────┬─────┬─────┐
│  3  │  2  │  3  │  ← Vestibular
├─────┼─────┼─────┤
│  3  │  2  │  3  │  ← Palatino
└─────┴─────┴─────┘
```

### Marcadores Adicionais:

**Sangramento:**
- Pontos vermelhos abaixo do dente
- Numerados (-1, -2, -3) indicando posição
- Marcador "F1" ou "F2" para furcação

**Mobilidade:**
- Triângulo amarelo acima do dente (⚠️)
- Indica mobilidade dentária

**Recessão Gengival:**
- Números negativos abaixo dos valores de sondagem
- Ex: -1, -2, -3 (mm de recessão)

---

## 📈 Análise Periodontal (Resumo)

O sistema calcula automaticamente:

### Métricas Principais:
1. **Profundidade Média:** 2.6mm (calculada de todos os pontos)
2. **Sangramento:** 14.6% (percentual de sítios com sangramento)
3. **Sítios >5mm:** 4 (número de pontos com profundidade crítica)
4. **Furcações:** 2 (número de dentes com envolvimento de furca)

### Diagnóstico Sugerido:
- "Diagnóstico Sugerido:" (campo de texto)
- Baseado nas métricas calculadas

---

## 🔧 Funcionalidades Observadas

### Modo de Edição:
1. Botão "Editar" ativa o modo de edição
2. Ao clicar em um dente, abre painel lateral com:
   - 6 campos para profundidades de sondagem
   - 6 campos para recessão gengival
   - Checkboxes para sangramento (6 posições)
   - Dropdown para furcação (Grau 0/I/II/III)
   - Dropdown para mobilidade (Grau 0/1/2/3)
   - Checkbox para presença de placa

### Salvamento:
- Botão "Salvar" persiste as alterações
- Recalcula automaticamente as métricas

---

## 💾 Estrutura de Dados

### Schema Proposto:

```typescript
interface PeriodontalExam {
  id: string;
  patientId: string;
  examDate: string;
  teeth: ToothPeriodontalData[];
  summary: {
    averageDepth: number;
    bleedingPercentage: number;
    sitesOver5mm: number;
    furcations: number;
  };
  diagnosis: string;
}

interface ToothPeriodontalData {
  toothNumber: number; // 11-48 (FDI)
  
  // Profundidades de sondagem (mm)
  probingDepths: {
    vestibular: {
      mesial: number;
      central: number;
      distal: number;
    };
    lingual: {
      mesial: number;
      central: number;
      distal: number;
    };
  };
  
  // Recessão gengival (mm)
  gingivalRecession: {
    vestibular: {
      mesial: number;
      central: number;
      distal: number;
    };
    lingual: {
      mesial: number;
      central: number;
      distal: number;
    };
  };
  
  // Sangramento à sondagem
  bleeding: {
    vestibular: {
      mesial: boolean;
      central: boolean;
      distal: boolean;
    };
    lingual: {
      mesial: boolean;
      central: boolean;
      distal: boolean;
    };
  };
  
  // Furcação (apenas molares)
  furcation: 0 | 1 | 2 | 3; // Grau 0 (normal) a 3 (severo)
  
  // Mobilidade
  mobility: 0 | 1 | 2 | 3; // Grau 0 (normal) a 3 (severo)
  
  // Presença de placa
  plaque: boolean;
}
```

---

## 🎯 Implementação Necessária

### Componentes React:

1. **PeriodontalChart.tsx**
   - Grid visual de todos os dentes
   - Código de cores automático
   - Marcadores de sangramento
   - Indicadores de mobilidade

2. **ToothPeriodontalCell.tsx**
   - Grid 3x2 para cada dente
   - Cores baseadas em valores
   - Clicável para edição

3. **PeriodontalEditPanel.tsx**
   - Formulário lateral de edição
   - 6 inputs para profundidades
   - 6 inputs para recessão
   - 6 checkboxes para sangramento
   - Dropdowns para furcação e mobilidade

4. **PeriodontalSummary.tsx**
   - Cálculo automático de métricas
   - Exibição de estatísticas
   - Diagnóstico sugerido

### Lógica de Cálculo:

```typescript
// Calcular profundidade média
function calculateAverageDepth(teeth: ToothPeriodontalData[]): number {
  let total = 0;
  let count = 0;
  
  teeth.forEach(tooth => {
    const depths = [
      tooth.probingDepths.vestibular.mesial,
      tooth.probingDepths.vestibular.central,
      tooth.probingDepths.vestibular.distal,
      tooth.probingDepths.lingual.mesial,
      tooth.probingDepths.lingual.central,
      tooth.probingDepths.lingual.distal,
    ];
    
    depths.forEach(depth => {
      if (depth > 0) {
        total += depth;
        count++;
      }
    });
  });
  
  return count > 0 ? total / count : 0;
}

// Calcular percentual de sangramento
function calculateBleedingPercentage(teeth: ToothPeriodontalData[]): number {
  let totalSites = 0;
  let bleedingSites = 0;
  
  teeth.forEach(tooth => {
    const bleeding = [
      tooth.bleeding.vestibular.mesial,
      tooth.bleeding.vestibular.central,
      tooth.bleeding.vestibular.distal,
      tooth.bleeding.lingual.mesial,
      tooth.bleeding.lingual.central,
      tooth.bleeding.lingual.distal,
    ];
    
    bleeding.forEach(isBleeding => {
      totalSites++;
      if (isBleeding) bleedingSites++;
    });
  });
  
  return totalSites > 0 ? (bleedingSites / totalSites) * 100 : 0;
}

// Contar sítios com profundidade >5mm
function countSitesOver5mm(teeth: ToothPeriodontalData[]): number {
  let count = 0;
  
  teeth.forEach(tooth => {
    const depths = [
      tooth.probingDepths.vestibular.mesial,
      tooth.probingDepths.vestibular.central,
      tooth.probingDepths.vestibular.distal,
      tooth.probingDepths.lingual.mesial,
      tooth.probingDepths.lingual.central,
      tooth.probingDepths.lingual.distal,
    ];
    
    depths.forEach(depth => {
      if (depth > 5) count++;
    });
  });
  
  return count;
}

// Contar dentes com furcação
function countFurcations(teeth: ToothPeriodontalData[]): number {
  return teeth.filter(tooth => tooth.furcation > 0).length;
}

// Determinar cor baseada na profundidade
function getColorForDepth(depth: number): string {
  if (depth <= 3) return 'bg-green-500'; // Saudável
  if (depth <= 5) return 'bg-yellow-500'; // Atenção
  return 'bg-red-500'; // Problema
}
```

---

## 📋 Checklist de Implementação

### Fase 1: Estrutura Base
- [ ] Criar schema de dados no banco
- [ ] Criar tipos TypeScript
- [ ] Preparar componentes base

### Fase 2: Visualização
- [ ] Grid de dentes (32 dentes)
- [ ] Células 3x2 por dente
- [ ] Código de cores automático
- [ ] Marcadores de sangramento
- [ ] Indicadores de mobilidade

### Fase 3: Edição
- [ ] Painel lateral de edição
- [ ] Inputs para profundidades
- [ ] Inputs para recessão
- [ ] Checkboxes para sangramento
- [ ] Dropdowns para furcação/mobilidade

### Fase 4: Cálculos
- [ ] Profundidade média
- [ ] Percentual de sangramento
- [ ] Sítios >5mm
- [ ] Contagem de furcações
- [ ] Atualização automática

### Fase 5: Persistência
- [ ] Salvar dados no banco
- [ ] Carregar dados existentes
- [ ] Histórico de exames
- [ ] Comparação entre exames

---

**Status:** Análise completa ✅  
**Próximo:** Verificar o que já existe no DentCare PRO v8
