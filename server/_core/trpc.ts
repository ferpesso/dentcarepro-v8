import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from '@shared/const';
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";
import * as db from "../db";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const requireUser = t.middleware(async opts => {
  const { ctx, next } = opts;
  
  console.log('[AUTH] requireUser middleware - user:', ctx.user ? 'exists' : 'null');

  // Development mode: create demo user if not authenticated
  if (!ctx.user) {
    console.log('[AUTH] Creating demo user...');
    const demoUserId = "demo-user-001";
    
    let demoUser = await db.getUser(demoUserId);
    console.log('[AUTH] Demo user from DB:', demoUser ? 'found' : 'not found');
    
    if (!demoUser) {
      console.log('[AUTH] Upserting demo user...');
      await db.upsertUser({
        id: demoUserId,
        name: "Utilizador de Desenvolvimento",
        email: "demo@dentcarepro.local",
        loginMethod: "demo",
        lastSignedIn: new Date(),
      });
      demoUser = await db.getUser(demoUserId);
      console.log('[AUTH] Demo user after upsert:', demoUser ? 'created' : 'failed');
    }
    
    if (demoUser) {
      console.log('[AUTH] Using demo user:', demoUser.id);
      return next({
        ctx: {
          ...ctx,
          user: demoUser,
        },
      });
    }
    
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(requireUser);

export const adminProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;

    if (!ctx.user || ctx.user.role !== 'admin') {
      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  }),
);
