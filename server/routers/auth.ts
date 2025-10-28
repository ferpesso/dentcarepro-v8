import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import { AuthService } from '../services/auth.service';
import { TRPCError } from '@trpc/server';

// ========================================
// SCHEMAS DE VALIDAÇÃO
// ========================================

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
    .regex(/[^A-Za-z0-9]/, 'Senha deve conter pelo menos um caractere especial'),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  role: z.enum(['admin', 'dentista', 'recepcionista', 'user']).optional(),
  dentistaId: z.string().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
    .regex(/[^A-Za-z0-9]/, 'Senha deve conter pelo menos um caractere especial'),
});

const requestPasswordResetSchema = z.object({
  email: z.string().email('Email inválido'),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres'),
});

// ========================================
// ROUTER DE AUTENTICAÇÃO
// ========================================

export const authRouter = router({
  /**
   * Login
   */
  login: publicProcedure
    .input(loginSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const authService = new AuthService(ctx.db);
        
        // Extrair IP e User Agent do contexto (se disponível)
        const ipAddress = ctx.req?.ip || ctx.req?.socket?.remoteAddress;
        const userAgent = ctx.req?.headers?.['user-agent'];
        
        const result = await authService.login(input, ipAddress, userAgent);
        
        return {
          success: true,
          data: result,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: error.message || 'Erro ao fazer login',
        });
      }
    }),
  
  /**
   * Registrar novo usuário
   */
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const authService = new AuthService(ctx.db);
        const result = await authService.register(input);
        
        return {
          success: true,
          data: result,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message || 'Erro ao registrar usuário',
        });
      }
    }),
  
  /**
   * Logout
   */
  logout: publicProcedure
    .input(z.object({
      token: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const authService = new AuthService(ctx.db);
        await authService.logout(input.token);
        
        return {
          success: true,
          message: 'Logout realizado com sucesso',
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message || 'Erro ao fazer logout',
        });
      }
    }),
  
  /**
   * Verificar sessão atual
   */
  verifySession: publicProcedure
    .input(z.object({
      token: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      try {
        const authService = new AuthService(ctx.db);
        const user = await authService.verifySession(input.token);
        
        if (!user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Sessão inválida ou expirada',
          });
        }
        
        return {
          success: true,
          data: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            dentistaId: user.dentista_id || undefined,
          },
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: error.message || 'Sessão inválida',
        });
      }
    }),
  
  /**
   * Obter usuário atual
   */
  me: publicProcedure
    .input(z.object({
      token: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      try {
        const authService = new AuthService(ctx.db);
        const user = await authService.verifySession(input.token);
        
        if (!user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Não autenticado',
          });
        }
        
        // Buscar permissões do usuário
        const permissions = await ctx.db.query.user_permissions.findMany({
          where: (perms: any, { eq, and }: any) => and(
            eq(perms.user_id, user.id),
            eq(perms.granted, 1)
          )
        });
        
        return {
          success: true,
          data: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            status: user.status,
            dentistaId: user.dentista_id || undefined,
            emailVerified: user.email_verified === 1,
            lastLogin: user.last_login,
            permissions: permissions.map((p: any) => ({
              module: p.module,
              action: p.action,
            })),
          },
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: error.message || 'Não autenticado',
        });
      }
    }),
  
  /**
   * Alterar senha
   */
  changePassword: publicProcedure
    .input(changePasswordSchema.extend({
      token: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const authService = new AuthService(ctx.db);
        const user = await authService.verifySession(input.token);
        
        if (!user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Não autenticado',
          });
        }
        
        // Verificar senha atual (implementar lógica)
        // TODO: Implementar verificação de senha atual
        
        // Atualizar senha (implementar lógica)
        // TODO: Implementar atualização de senha
        
        return {
          success: true,
          message: 'Senha alterada com sucesso',
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message || 'Erro ao alterar senha',
        });
      }
    }),
  
  /**
   * Solicitar recuperação de senha
   */
  requestPasswordReset: publicProcedure
    .input(requestPasswordResetSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // TODO: Implementar lógica de envio de email
        // 1. Gerar token de recuperação
        // 2. Salvar token no banco com expiração
        // 3. Enviar email com link de recuperação
        
        return {
          success: true,
          message: 'Se o email existir, você receberá instruções para recuperação de senha',
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Erro ao solicitar recuperação de senha',
        });
      }
    }),
  
  /**
   * Resetar senha com token
   */
  resetPassword: publicProcedure
    .input(resetPasswordSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // TODO: Implementar lógica de reset de senha
        // 1. Verificar token
        // 2. Verificar expiração
        // 3. Atualizar senha
        // 4. Invalidar token
        
        return {
          success: true,
          message: 'Senha resetada com sucesso',
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Token inválido ou expirado',
        });
      }
    }),
  
  /**
   * Verificar permissão
   */
  checkPermission: publicProcedure
    .input(z.object({
      token: z.string(),
      module: z.string(),
      action: z.enum(['read', 'create', 'update', 'delete', 'export']),
    }))
    .query(async ({ input, ctx }) => {
      try {
        const authService = new AuthService(ctx.db);
        const user = await authService.verifySession(input.token);
        
        if (!user) {
          return { success: true, data: { hasPermission: false } };
        }
        
        const hasPermission = await authService.hasPermission(
          user.id,
          input.module,
          input.action
        );
        
        return {
          success: true,
          data: { hasPermission },
        };
      } catch (error: any) {
        return {
          success: true,
          data: { hasPermission: false },
        };
      }
    }),
  
  /**
   * Listar sessões ativas
   */
  listSessions: publicProcedure
    .input(z.object({
      token: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      try {
        const authService = new AuthService(ctx.db);
        const user = await authService.verifySession(input.token);
        
        if (!user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Não autenticado',
          });
        }
        
        const sessions = await ctx.db.query.user_sessions.findMany({
          where: (sessions: any, { eq, and }: any) => and(
            eq(sessions.user_id, user.id),
            eq(sessions.is_active, 1)
          ),
          orderBy: (sessions: any, { desc }: any) => [desc(sessions.last_activity)],
        });
        
        return {
          success: true,
          data: sessions.map((s: any) => ({
            id: s.id,
            ipAddress: s.ip_address,
            userAgent: s.user_agent,
            lastActivity: s.last_activity,
            expiresAt: s.expires_at,
            createdAt: s.created_at,
          })),
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: error.message || 'Não autenticado',
        });
      }
    }),
  
  /**
   * Revogar sessão
   */
  revokeSession: publicProcedure
    .input(z.object({
      token: z.string(),
      sessionId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const authService = new AuthService(ctx.db);
        const user = await authService.verifySession(input.token);
        
        if (!user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Não autenticado',
          });
        }
        
        // Verificar se a sessão pertence ao usuário
        const session = await ctx.db.query.user_sessions.findFirst({
          where: (sessions: any, { eq, and }: any) => and(
            eq(sessions.id, input.sessionId),
            eq(sessions.user_id, user.id)
          )
        });
        
        if (!session) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Sessão não encontrada',
          });
        }
        
        // Desativar sessão
        await ctx.db.update(ctx.db.schema.user_sessions)
          .set({ is_active: 0 })
          .where((sessions: any, { eq }: any) => eq(sessions.id, input.sessionId));
        
        return {
          success: true,
          message: 'Sessão revogada com sucesso',
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message || 'Erro ao revogar sessão',
        });
      }
    }),
});
