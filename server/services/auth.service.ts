import { SignJWT, jwtVerify } from 'jose';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import type { User } from '../../drizzle/schema';

// ========================================
// CONFIGURAÇÕES
// ========================================

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // 7 dias
const SESSION_EXPIRES_IN = 7 * 24 * 60 * 60 * 1000; // 7 dias em ms

// ========================================
// TIPOS
// ========================================

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  sessionId: string;
  iat?: number;
  exp?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'dentista' | 'recepcionista' | 'user';
  dentistaId?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    dentistaId?: string;
  };
  token: string;
  expiresAt: Date;
}

// ========================================
// FUNÇÕES DE HASH (bcrypt)
// ========================================

const SALT_ROUNDS = 10;

/**
 * Hash de senha usando bcrypt
 */
async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verificar senha usando bcrypt
 */
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Erro ao verificar senha:', error);
    return false;
  }
}

// ========================================
// FUNÇÕES JWT
// ========================================

/**
 * Gerar token JWT
 */
export async function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  const secret = new TextEncoder().encode(JWT_SECRET);
  
  const token = await new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secret);
  
  return token;
}

/**
 * Verificar e decodificar token JWT
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    // Verificar se o payload tem os campos necessários
    if (!payload.userId || !payload.email || !payload.role || !payload.sessionId) {
      return null;
    }
    
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// ========================================
// SERVIÇOS DE AUTENTICAÇÃO
// ========================================

export class AuthService {
  private db: any;
  
  constructor(db: any) {
    this.db = db;
  }
  
  /**
   * Registrar novo usuário
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    // Verificar se email já existe
    const existingUser = await this.db.query.users.findFirst({
      where: (users: any, { eq }: any) => eq(users.email, data.email)
    });
    
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }
    
    // Hash da senha
    const passwordHash = await hashPassword(data.password);
    
    // Criar usuário
    const userId = nanoid();
    const newUser = {
      id: userId,
      email: data.email,
      password_hash: passwordHash,
      name: data.name,
      role: data.role || 'user',
      status: 'ativo',
      email_verified: 0,
      dentista_id: data.dentistaId || null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    
    await this.db.insert(this.db.schema.users).values(newUser);
    
    // Criar sessão
    const sessionId = nanoid();
    const token = await generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      sessionId,
    });
    
    const expiresAt = new Date(Date.now() + SESSION_EXPIRES_IN);
    
    await this.db.insert(this.db.schema.user_sessions).values({
      id: sessionId,
      user_id: userId,
      token,
      expires_at: expiresAt,
      is_active: 1,
      created_at: new Date(),
    });
    
    // Criar permissões padrão baseadas no role
    await this.createDefaultPermissions(userId, data.role || 'user');
    
    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        dentistaId: newUser.dentista_id || undefined,
      },
      token,
      expiresAt,
    };
  }
  
  /**
   * Login de usuário
   */
  async login(credentials: LoginCredentials, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    // Buscar usuário - usar query SQL direta se db.query não estiver disponível
    let user;
    try {
      if (this.db && this.db.query && this.db.query.users) {
        user = await this.db.query.users.findFirst({
          where: (users: any, { eq }: any) => eq(users.email, credentials.email)
        });
      } else if (this.db) {
        // Fallback para query SQL direta
        const result = await this.db.select().from(this.db.schema.users).where((users: any, { eq }: any) => eq(users.email, credentials.email)).limit(1);
        user = result[0];
      } else {
        throw new Error('Database not available');
      }
    } catch (error) {
      console.error('[AuthService] Error querying user:', error);
      throw new Error('Erro ao buscar usuário');
    }
    
    if (!user) {
      throw new Error('Email ou senha inválidos');
    }
    
    // Verificar se conta está bloqueada
    if (user.status === 'bloqueado') {
      throw new Error('Conta bloqueada. Entre em contato com o administrador.');
    }
    
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      throw new Error('Conta temporariamente bloqueada. Tente novamente mais tarde.');
    }
    
    // Verificar senha
    const isValidPassword = await verifyPassword(credentials.password, user.passwordHash || user.password_hash);
    
    if (!isValidPassword) {
      throw new Error('Email ou senha inválidos');
    }
    
    // Atualizar último login
    try {
      const { eq } = await import('drizzle-orm');
      await this.db.update(this.db.schema.users)
        .set({
          lastSignedIn: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(this.db.schema.users.id, user.id));
    } catch (error) {
      console.error('[AuthService] Error updating last sign in:', error);
      // Não bloquear o login se falhar a atualização
    }
    
    // Criar sessão
    const sessionId = nanoid();
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId,
    });
    
    const expiresAt = new Date(Date.now() + SESSION_EXPIRES_IN);
    
    await this.db.insert(this.db.schema.user_sessions).values({
      id: sessionId,
      user_id: user.id,
      token,
      ip_address: ipAddress,
      user_agent: userAgent,
      expires_at: expiresAt,
      is_active: 1,
      created_at: new Date(),
      last_activity: new Date(),
    });
    
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        dentistaId: user.dentista_id || undefined,
      },
      token,
      expiresAt,
    };
  }
  
  /**
   * Logout
   */
  async logout(token: string): Promise<void> {
    const payload = await verifyToken(token);
    if (!payload) {
      throw new Error('Token inválido');
    }
    
    // Desativar sessão
    await this.db.update(this.db.schema.user_sessions)
      .set({ is_active: 0 })
      .where((sessions: any, { eq }: any) => eq(sessions.id, payload.sessionId));
  }
  
  /**
   * Verificar token e retornar usuário
   */
  async verifySession(token: string): Promise<User | null> {
    const payload = await verifyToken(token);
    if (!payload) {
      return null;
    }
    
    // Verificar se sessão está ativa
    const session = await this.db.query.user_sessions.findFirst({
      where: (sessions: any, { eq, and }: any) => and(
        eq(sessions.id, payload.sessionId),
        eq(sessions.is_active, 1)
      )
    });
    
    if (!session) {
      return null;
    }
    
    // Verificar se sessão expirou
    if (new Date(session.expires_at) < new Date()) {
      await this.db.update(this.db.schema.user_sessions)
        .set({ is_active: 0 })
        .where((sessions: any, { eq }: any) => eq(sessions.id, session.id));
      return null;
    }
    
    // Atualizar última atividade
    await this.db.update(this.db.schema.user_sessions)
      .set({ last_activity: new Date() })
      .where((sessions: any, { eq }: any) => eq(sessions.id, session.id));
    
    // Buscar usuário
    const user = await this.db.query.users.findFirst({
      where: (users: any, { eq }: any) => eq(users.id, payload.userId)
    });
    
    return user || null;
  }
  
  /**
   * Criar permissões padrão baseadas no role
   */
  private async createDefaultPermissions(userId: string, role: string): Promise<void> {
    const permissions: any[] = [];
    
    if (role === 'admin') {
      // Admin tem acesso total - não precisa criar permissões (será gerenciado via código)
      return;
    }
    
    if (role === 'dentista') {
      const modules = [
        'agenda', 'utentes', 'odontograma', 'periodontograma',
        'endodontia', 'implantes', 'ortodontia', 'prescricoes',
        'imagens', 'comissoes'
      ];
      
      for (const module of modules) {
        permissions.push({
          id: nanoid(),
          user_id: userId,
          module,
          action: 'read',
          granted: 1,
          created_at: new Date(),
        });
        
        permissions.push({
          id: nanoid(),
          user_id: userId,
          module,
          action: 'create',
          granted: 1,
          created_at: new Date(),
        });
        
        permissions.push({
          id: nanoid(),
          user_id: userId,
          module,
          action: 'update',
          granted: 1,
          created_at: new Date(),
        });
      }
    }
    
    if (role === 'recepcionista') {
      const readModules = [
        'agenda', 'utentes', 'faturacao', 'relatorios'
      ];
      
      for (const module of readModules) {
        permissions.push({
          id: nanoid(),
          user_id: userId,
          module,
          action: 'read',
          granted: 1,
          created_at: new Date(),
        });
      }
      
      // Recepcionista pode criar/editar agenda e utentes
      const writeModules = ['agenda', 'utentes'];
      for (const module of writeModules) {
        permissions.push({
          id: nanoid(),
          user_id: userId,
          module,
          action: 'create',
          granted: 1,
          created_at: new Date(),
        });
        
        permissions.push({
          id: nanoid(),
          user_id: userId,
          module,
          action: 'update',
          granted: 1,
          created_at: new Date(),
        });
      }
    }
    
    if (permissions.length > 0) {
      await this.db.insert(this.db.schema.user_permissions).values(permissions);
    }
  }
  
  /**
   * Verificar se usuário tem permissão
   */
  async hasPermission(userId: string, module: string, action: string): Promise<boolean> {
    // Buscar usuário
    const user = await this.db.query.users.findFirst({
      where: (users: any, { eq }: any) => eq(users.id, userId)
    });
    
    if (!user) {
      return false;
    }
    
    // Admin tem acesso total
    if (user.role === 'admin') {
      return true;
    }
    
    // Verificar permissão específica
    const permission = await this.db.query.user_permissions.findFirst({
      where: (permissions: any, { eq, and }: any) => and(
        eq(permissions.user_id, userId),
        eq(permissions.module, module),
        eq(permissions.action, action),
        eq(permissions.granted, 1)
      )
    });
    
    return !!permission;
  }
}
