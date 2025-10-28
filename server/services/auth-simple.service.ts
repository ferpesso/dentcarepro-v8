import { SignJWT, jwtVerify } from 'jose';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import { getDb } from '../db';

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

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

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

export async function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  const secret = new TextEncoder().encode(JWT_SECRET);
  
  const token = await new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secret);
  
  return token;
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
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
// SERVIÇO DE AUTENTICAÇÃO SIMPLIFICADO
// ========================================

export class AuthServiceSimple {
  /**
   * Login de usuário usando queries SQL diretas
   */
  static async login(credentials: LoginCredentials, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    const pool = await getDb();
    
    if (!pool) {
      throw new Error('Database not available');
    }
    
    try {
      // Buscar usuário
      const result = await pool.query(
        'SELECT id, name, email, password_hash, role, status, dentista_id FROM users WHERE email = $1',
        [credentials.email]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Email ou senha inválidos');
      }
      
      const user = result.rows[0];
      
      // Verificar se conta está bloqueada
      if (user.status === 'bloqueado') {
        throw new Error('Conta bloqueada. Entre em contato com o administrador.');
      }
      
      // Verificar senha
      const isValidPassword = await verifyPassword(credentials.password, user.password_hash);
      
      if (!isValidPassword) {
        throw new Error('Email ou senha inválidos');
      }
      
      // Atualizar último login
      await pool.query(
        'UPDATE users SET last_signed_in = NOW(), updated_at = NOW() WHERE id = $1',
        [user.id]
      );
      
      // Criar sessão
      const sessionId = nanoid();
      const token = await generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        sessionId,
      });
      
      const expiresAt = new Date(Date.now() + SESSION_EXPIRES_IN);
      
      // Salvar sessão no banco
      await pool.query(
        'INSERT INTO user_sessions (id, user_id, token, expires_at, ip_address, user_agent, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())',
        [sessionId, user.id, token, expiresAt, ipAddress || null, userAgent || null]
      );
      
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
    } catch (error: any) {
      console.error('[AuthServiceSimple] Login error:', error);
      throw error;
    }
  }
  
  /**
   * Registrar novo usuário
   */
  static async register(data: RegisterData): Promise<AuthResponse> {
    const pool = await getDb();
    
    if (!pool) {
      throw new Error('Database not available');
    }
    
    try {
      // Verificar se email já existe
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [data.email]
      );
      
      if (existingUser.rows.length > 0) {
        throw new Error('Email já cadastrado');
      }
      
      // Hash da senha
      const passwordHash = await hashPassword(data.password);
      
      // Criar usuário
      const userId = nanoid();
      await pool.query(
        'INSERT INTO users (id, name, email, password_hash, role, status, dentista_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())',
        [userId, data.name, data.email, passwordHash, data.role || 'user', 'ativo', data.dentistaId || null]
      );
      
      // Criar sessão
      const sessionId = nanoid();
      const token = await generateToken({
        userId,
        email: data.email,
        role: data.role || 'user',
        sessionId,
      });
      
      const expiresAt = new Date(Date.now() + SESSION_EXPIRES_IN);
      
      // Salvar sessão
      await pool.query(
        'INSERT INTO user_sessions (id, user_id, token, expires_at, created_at) VALUES ($1, $2, $3, $4, NOW())',
        [sessionId, userId, token, expiresAt]
      );
      
      return {
        user: {
          id: userId,
          email: data.email,
          name: data.name,
          role: data.role || 'user',
          dentistaId: data.dentistaId,
        },
        token,
        expiresAt,
      };
    } catch (error: any) {
      console.error('[AuthServiceSimple] Register error:', error);
      throw error;
    }
  }
  
  /**
   * Verificar sessão
   */
  static async verifySession(token: string): Promise<JWTPayload | null> {
    const payload = await verifyToken(token);
    
    if (!payload) {
      return null;
    }
    
    const pool = await getDb();
    
    if (!pool) {
      return payload; // Retornar payload mesmo sem verificar no banco
    }
    
    try {
      // Verificar se sessão existe e não expirou
      const result = await pool.query(
        'SELECT id FROM user_sessions WHERE id = $1 AND expires_at > NOW()',
        [payload.sessionId]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return payload;
    } catch (error) {
      console.error('[AuthServiceSimple] Session verification error:', error);
      return payload; // Retornar payload em caso de erro
    }
  }
  
  /**
   * Logout
   */
  static async logout(sessionId: string): Promise<void> {
    const pool = await getDb();
    
    if (!pool) {
      return;
    }
    
    try {
      await pool.query(
        'DELETE FROM user_sessions WHERE id = $1',
        [sessionId]
      );
    } catch (error) {
      console.error('[AuthServiceSimple] Logout error:', error);
    }
  }
}
