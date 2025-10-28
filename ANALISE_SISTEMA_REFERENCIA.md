# 📋 Análise do Sistema de Referência - DentCare Pro

**Data:** 28 de Outubro de 2025  
**URL:** https://dentcare-cjlgjq.manus.space/  
**Objetivo:** Replicar módulos clínicos no DentCare PRO v8 com adaptações para Portugal

---

## 🦷 Módulos Clínicos Identificados

### 1. **Odontograma Interativo** ✅ ANALISADO

**Características:**
- Visualização de 32 dentes (arcada superior e inferior)
- Representação gráfica em formato de cruz (5 faces por dente)
- Estados disponíveis:
  - 🟢 Sadio (verde)
  - 🔴 Cariado (vermelho)
  - 🔵 Restaurado (azul)
  - 🟣 Tratado (roxo)
  - ⚫ Ausente (cinza)
  - 🟠 Implante (laranja)
  - 🟣 Incluso (rosa)
  - 🔴 Fraturado (vermelho escuro)

**Funcionalidades:**
- Modo de edição (botão "Editar")
- Painel de edição ao selecionar dente
- Aplicar status por face do dente
- Resumo do estado bucal com contadores
- Botão "Salvar" para persistir alterações

**Layout:**
- Legenda no topo
- Arcada Superior (dentes 18-28)
- Arcada Inferior (dentes 48-38)
- Resumo estatístico no rodapé

---

### 2. **Periodontograma** 📊

**Características Observadas nas Imagens:**
- Profundidades de sondagem (mm) - 6 pontos por dente
- Recessão gengival (mm)
- Furcação (graus)
- Mobilidade (graus 0-3)
- Sangramento à sondagem (marcadores vermelhos)
- Código de cores:
  - 🟢 1-3mm (Saudável)
  - 🟡 4-5mm (Atenção)
  - 🔴 6+mm (Problema)

**Painel de Edição:**
- Profundidades de sondagem (6 campos por dente)
- Recessão gengival (6 campos)
- Furcação (dropdown)
- Mobilidade (dropdown)
- Presença de placa (checkbox)

---

### 3. **Endodontia** 🦷

**Seções Identificadas:**

**Diagnóstico:**
- Diagnóstico Principal (dropdown)
- Sintomas Apresenta (checkboxes múltiplos):
  - Dor Espontânea
  - Sensibilidade ao Frio
  - Dor Provocada
  - Sensibilidade ao Calor
  - Dor à Mastigação
  - Edema
  - Fístula
  - Mobilidade Dentária

**Testes de Vitalidade:**
- Teste ao Frio (dropdown: Positivo Prolongado/Intenso/Baixo/Negativo)
- Teste ao Calor (dropdown)
- Teste Elétrico (dropdown)
- Percussão Vertical (dropdown)
- Percussão Horizontal (dropdown)
- Palpação (dropdown)

**Anatomia dos Canais:**
- Número de Canais (input)
- Canal Mesio-vestibular:
  - Comprimento de Trabalho (mm)
  - Diâmetro Apical
  - Curvatura (dropdown)
  - Instrumentação (text)
- Canal Disto-vestibular (mesmos campos)

**Status do Tratamento:**
- Status (dropdown: Em Andamento/Concluído/Abandonado)
- Prognóstico (dropdown: Favorável/Reservado/Desfavorável)
- Sessões Realizadas (contador)

**Histórico de Sessões:**
- Lista de sessões com data e procedimentos

---

### 4. **Implantes** 🔩

**Cronograma do Tratamento:**
- Barra de progresso visual com 3 fases:
  - ✅ Planejamento (verde - concluído)
  - 🔶 Cirurgia (laranja - em andamento)
  - ⚪ Prótese (cinza - pendente)
- Status: Osseointegração (X de Y dias)
- Dias restantes

**Planejamento:**
- Indicação (dropdown: Unitário/Múltiplo/Protocolo)
- Tipo de Prótese (dropdown: Coroa Unitária/Ponte/Protocolo)
- Altura Óssea (mm)
- Largura Óssea (mm)
- Densidade Óssea (dropdown: D1-D4)
- Guia Cirúrgico (checkbox)

**Dados do Implante:**
- Marca (dropdown: Straumann/Neodent/etc)
- Modelo (dropdown)
- Diâmetro (mm)
- Comprimento (mm)
- Torque de Inserção (N.cm)

**Controles de Osseointegração:**
- Lista de controles com:
  - Data
  - Semana
  - Dor (ausente/leve/moderada)
  - Edema (ausente/leve/moderada)
  - Observações
  - Status (normal/atenção)

**Dados da Prótese:**
- Tipo (dropdown)
- Material (dropdown)
- Moldagem (data)
- Prova (data)
- Instalação (data)

---

### 5. **Ortodontia** 📏

**Progresso do Tratamento:**
- Barra de progresso visual
- Meses Decorridos
- Progresso Geral (%)
- Meses Restantes
- Fase Atual (texto)
- Próximo Fio (data)

**Diagnóstico Ortodôntico:**
- Classificação de Ângulo (dropdown: Classe I/II/III)
- Tipo de Má Oclusão (dropdown)
- Gravidade (dropdown: Leve/Moderada/Severa)

**Análise Dentária:**
- Sobrejeto (mm)
- Sobremordida (mm)
- Curva de Spee (mm)
- Forma do Arco (dropdown)

**Análise Esquelética (Cefalometria):**
- SNA (°)
- SNB (°)
- ANB (°)

**Sequência de Fios:**
- Lista ordenada de fios com:
  - Número da sequência
  - Especificação do fio (ex: 0.014 NiTi)
  - Data de instalação
  - Status (Instalado/Planejado)

---

## 🇵🇹 Adaptações para Portugal

### Campos a Alterar:

**Dados Gerais:**
- ❌ CPF → ✅ NIF (Número de Identificação Fiscal)
- ❌ Telefone brasileiro → ✅ Telefone português (+351)
- ❌ CEP → ✅ Código Postal (XXXX-XXX)
- ✅ Adicionar: Número SNS (Serviço Nacional de Saúde)
- ✅ Adicionar: Número de Utente (interno da clínica)

**Terminologia:**
- ❌ Paciente → ✅ Utente
- ❌ Consulta → ✅ Consulta (mantém)
- ✅ Usar terminologia portuguesa em todos os campos

**Moeda:**
- ❌ R$ → ✅ € (Euro)

---

## 📊 Estrutura de Dados Necessária

### Schema do Odontograma:
```typescript
interface ToothStatus {
  toothNumber: number; // 11-48 (notação FDI)
  faces: {
    mesial: string;
    distal: string;
    oclusal: string;
    vestibular: string;
    lingual: string;
  };
  notes?: string;
}
```

### Schema do Periodontograma:
```typescript
interface PeriodontalData {
  toothNumber: number;
  probingDepths: number[]; // 6 valores (mm)
  gingivalRecession: number[]; // 6 valores (mm)
  furcation: string;
  mobility: string;
  bleeding: boolean[];
  plaque: boolean;
}
```

### Schema da Endodontia:
```typescript
interface EndodonticSession {
  id: string;
  patientId: string;
  toothNumber: number;
  diagnosis: string;
  symptoms: string[];
  vitalityTests: {
    cold: string;
    heat: string;
    electric: string;
    verticalPercussion: string;
    horizontalPercussion: string;
    palpation: string;
  };
  canals: {
    number: number;
    mesioVestibular?: CanalData;
    distoVestibular?: CanalData;
  };
  status: string;
  prognosis: string;
  sessions: SessionRecord[];
}
```

### Schema de Implantes:
```typescript
interface ImplantTreatment {
  id: string;
  patientId: string;
  toothPosition: number;
  status: string; // planejamento/cirurgia/protese
  planning: {
    indication: string;
    prosthesisType: string;
    boneHeight: number;
    boneWidth: number;
    boneDensity: string;
    surgicalGuide: boolean;
  };
  implant: {
    brand: string;
    model: string;
    diameter: number;
    length: number;
    insertionTorque: number;
  };
  osseointegrationControls: OsseoControl[];
  prosthesis: ProsthesisData;
}
```

### Schema de Ortodontia:
```typescript
interface OrthodonticTreatment {
  id: string;
  patientId: string;
  startDate: string;
  estimatedDuration: number; // meses
  progress: number; // %
  currentPhase: string;
  diagnosis: {
    angleClassification: string;
    malocclusion: string;
    severity: string;
  };
  dentalAnalysis: {
    overjet: number;
    overbite: number;
    speesCurve: number;
    archForm: string;
  };
  cephalometricAnalysis: {
    sna: number;
    snb: number;
    anb: number;
  };
  wireSequence: WireRecord[];
}
```

---

## 🎯 Plano de Implementação

### Fase 1: Preparação (1-2 dias)
- ✅ Analisar sistema de referência (CONCLUÍDO)
- [ ] Criar schemas de banco de dados
- [ ] Adaptar campos para Portugal (NIF, SNS, etc)
- [ ] Preparar componentes base

### Fase 2: Odontograma (2-3 dias)
- [ ] Criar componente visual do odontograma
- [ ] Implementar interatividade (clique nos dentes)
- [ ] Painel de edição de status
- [ ] Persistência de dados
- [ ] Resumo estatístico

### Fase 3: Periodontograma (2-3 dias)
- [ ] Grid de profundidades de sondagem
- [ ] Código de cores automático
- [ ] Campos de recessão gengival
- [ ] Furcação e mobilidade
- [ ] Marcadores de sangramento

### Fase 4: Endodontia (2-3 dias)
- [ ] Formulário de diagnóstico
- [ ] Testes de vitalidade
- [ ] Anatomia dos canais
- [ ] Status do tratamento
- [ ] Histórico de sessões

### Fase 5: Implantes (2-3 dias)
- [ ] Cronograma visual
- [ ] Formulário de planejamento
- [ ] Dados do implante
- [ ] Controles de osseointegração
- [ ] Dados da prótese

### Fase 6: Ortodontia (2-3 dias)
- [ ] Barra de progresso
- [ ] Diagnóstico ortodôntico
- [ ] Análises dentária e esquelética
- [ ] Sequência de fios
- [ ] Cálculo automático de progresso

### Fase 7: Integração e Testes (2-3 dias)
- [ ] Integrar todos os módulos
- [ ] Navegação entre tabs
- [ ] Persistência de dados
- [ ] Testes completos
- [ ] Ajustes finais

---

## 📝 Notas Importantes

1. **Sistema de referência usa CPF** - Precisamos adaptar para NIF português
2. **Todos os módulos estão em tabs** dentro da ficha do utente
3. **Cada módulo tem botões "Editar" e "Salvar"** separados
4. **Odontograma usa notação FDI** (11-48) - padrão internacional
5. **Cores e layout são consistentes** em todos os módulos
6. **Há alertas médicos** no topo da ficha (alergias, medicamentos)

---

**Próximo Passo:** Verificar o que já existe no DentCare PRO v8 e começar a implementação dos módulos faltantes.
