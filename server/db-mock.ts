// Mock database for development/demo purposes
import type { InsertUser } from "../drizzle/schema";

// In-memory storage
const mockUsers = new Map<string, any>();
const mockUtentes = new Map<string, any>();

// Initialize with demo user
mockUsers.set("demo-user-001", {
  id: "demo-user-001",
  name: "Utilizador de Desenvolvimento",
  email: "demo@dentcarepro.local",
  loginMethod: "demo",
  lastSignedIn: new Date().toISOString(),
});

// Initialize with demo utentes
const demoUtentes = [
  {
    id: "utente-001",
    codigo: "U001",
    nome: "Maria Silva Santos",
    dataNascimento: "1983-05-15",
    sexo: "F",
    nif: "912345678",
    numeroSNS: "123456789",
    telefone: "912345678",
    email: "maria.silva@email.pt",
    morada: "Rua das Flores, 123",
    codigoPostal: "1000-100",
    localidade: "Lisboa",
    estadoCivil: "Casado(a)",
    profissao: "Professora",
    observacoes: "Alergia a penicilina",
    consentimentoRGPD: true,
    estado: "ativo",
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: "utente-002",
    codigo: "U002",
    nome: "João Pedro Costa",
    dataNascimento: "1990-08-22",
    sexo: "M",
    nif: "923456789",
    numeroSNS: "234567890",
    telefone: "923456789",
    email: "joao.costa@email.pt",
    morada: "Av. da Liberdade, 456",
    codigoPostal: "1200-200",
    localidade: "Porto",
    estadoCivil: "Solteiro(a)",
    profissao: "Engenheiro",
    observacoes: "",
    consentimentoRGPD: true,
    estado: "ativo",
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: "utente-003",
    codigo: "U003",
    nome: "Ana Rita Ferreira",
    dataNascimento: "1978-12-03",
    sexo: "F",
    nif: "934567890",
    numeroSNS: "345678901",
    telefone: "934567890",
    email: "ana.ferreira@email.pt",
    morada: "Praça do Comércio, 789",
    codigoPostal: "1300-300",
    localidade: "Coimbra",
    estadoCivil: "Divorciado(a)",
    profissao: "Médica",
    observacoes: "Preferência por consultas de manhã",
    consentimentoRGPD: true,
    estado: "ativo",
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: "utente-004",
    codigo: "U004",
    nome: "Carlos Manuel Oliveira",
    dataNascimento: "1965-03-18",
    sexo: "M",
    nif: "945678901",
    numeroSNS: "456789012",
    telefone: "945678901",
    email: "carlos.oliveira@email.pt",
    morada: "Rua do Norte, 321",
    codigoPostal: "1400-400",
    localidade: "Braga",
    estadoCivil: "Casado(a)",
    profissao: "Empresário",
    observacoes: "",
    consentimentoRGPD: true,
    estado: "ativo",
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: "utente-005",
    codigo: "U005",
    nome: "Sofia Marques Rodrigues",
    dataNascimento: "2000-07-25",
    sexo: "F",
    nif: "956789012",
    numeroSNS: "567890123",
    telefone: "956789012",
    email: "sofia.rodrigues@email.pt",
    morada: "Alameda dos Oceanos, 654",
    codigoPostal: "1500-500",
    localidade: "Faro",
    estadoCivil: "Solteiro(a)",
    profissao: "Estudante",
    observacoes: "Tratamento ortodôntico em curso",
    consentimentoRGPD: true,
    estado: "ativo",
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
];

demoUtentes.forEach(utente => mockUtentes.set(utente.id, utente));

export async function getDb() {
  return {}; // Mock db object
}

export async function getUser(userId: string) {
  return mockUsers.get(userId) || null;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }
  
  const existing = mockUsers.get(user.id);
  mockUsers.set(user.id, {
    ...existing,
    ...user,
    lastSignedIn: user.lastSignedIn || new Date().toISOString(),
  });
}

export async function listarUtentes() {
  return Array.from(mockUtentes.values());
}

export async function obterUtente(id: string) {
  return mockUtentes.get(id) || null;
}

export async function pesquisarUtentes(termo: string) {
  const termoLower = termo.toLowerCase();
  return Array.from(mockUtentes.values()).filter(utente =>
    utente.nome.toLowerCase().includes(termoLower) ||
    utente.nif?.includes(termo) ||
    utente.numeroSNS?.includes(termo) ||
    utente.email?.toLowerCase().includes(termoLower)
  );
}

export async function criarUtente(dados: any) {
  const id = `utente-${Date.now()}`;
  const novoUtente = {
    id,
    codigo: `U${String(mockUtentes.size + 1).padStart(3, '0')}`,
    ...dados,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  };
  mockUtentes.set(id, novoUtente);
  return novoUtente;
}

export async function atualizarUtente(id: string, dados: any) {
  const existing = mockUtentes.get(id);
  if (!existing) {
    throw new Error("Utente não encontrado");
  }
  const updated = {
    ...existing,
    ...dados,
    atualizadoEm: new Date().toISOString(),
  };
  mockUtentes.set(id, updated);
  return updated;
}

export async function removerUtente(id: string) {
  mockUtentes.delete(id);
  return { sucesso: true };
}

export async function obterEstatisticasUtentes() {
  const total = mockUtentes.size;
  const ativos = Array.from(mockUtentes.values()).filter(u => u.estado === 'ativo').length;
  const inativos = Array.from(mockUtentes.values()).filter(u => u.estado === 'inativo').length;
  const arquivados = Array.from(mockUtentes.values()).filter(u => u.estado === 'arquivado').length;
  
  return { total, ativos, inativos, arquivados };
}

// Mock implementations for other entities
export const listarConsultas = async () => [];
export const obterConsulta = async (id: string) => null;
export const criarConsulta = async (dados: any) => ({ id: `CON-${Date.now()}` });
export const atualizarConsulta = async (id: string, dados: any) => ({ sucesso: true });
export const removerConsulta = async (id: string) => ({ sucesso: true });

export const listarDentistas = async () => [];
export const obterDentista = async (id: string) => null;
export const criarDentista = async (dados: any) => ({ id: `DEN-${Date.now()}` });
export const atualizarDentista = async (id: string, dados: any) => ({ sucesso: true });
export const removerDentista = async (id: string) => ({ sucesso: true });

export const listarComissoes = async () => [];
export const obterComissao = async (id: string) => null;

export const listarLaboratorios = async () => [];
export const obterLaboratorio = async (id: string) => null;
export const criarLaboratorio = async (dados: any) => ({ id: `LAB-${Date.now()}` });
export const atualizarLaboratorio = async (id: string, dados: any) => ({ sucesso: true });
export const removerLaboratorio = async (id: string) => ({ sucesso: true });

export const listarContasPagar = async () => [];
export const obterContaPagar = async (id: string) => null;
export const criarContaPagar = async (dados: any) => ({ id: `CP-${Date.now()}` });
export const atualizarContaPagar = async (id: string, dados: any) => ({ sucesso: true });
export const removerContaPagar = async (id: string) => ({ sucesso: true });
export const marcarContaPaga = async (id: string) => ({ sucesso: true });

export const listarFaturas = async () => [];
export const obterFatura = async (id: string) => null;
export const criarFatura = async (dados: any) => ({ id: `FAT-${Date.now()}` });
export const atualizarFatura = async (id: string, dados: any) => ({ sucesso: true });
export const removerFatura = async (id: string) => ({ sucesso: true });

export const obterDashboardFinanceiro = async () => ({
  receitasMes: 15000,
  despesasMes: 8000,
  lucroMes: 7000,
  contasPendentes: 5,
  faturasEmitidas: 42,
});

