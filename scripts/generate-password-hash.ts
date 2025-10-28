/**
 * Script para gerar hash de senha
 * Uso: tsx scripts/generate-password-hash.ts "SuaSenha"
 */

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + JWT_SECRET);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

async function main() {
  const password = process.argv[2] || 'Admin@123';
  
  console.log('='.repeat(60));
  console.log('🔐 Gerador de Hash de Senha - DentCarePRO');
  console.log('='.repeat(60));
  console.log('');
  console.log(`Senha: ${password}`);
  console.log('');
  
  const hash = await hashPassword(password);
  
  console.log('Hash gerado:');
  console.log(hash);
  console.log('');
  console.log('⚠️  IMPORTANTE:');
  console.log('Este é um hash temporário usando SHA-256.');
  console.log('Em produção, use bcrypt ou argon2!');
  console.log('');
  console.log('Para usar bcrypt:');
  console.log('1. Instalar: pnpm add bcrypt @types/bcrypt');
  console.log('2. Usar: bcrypt.hash(password, 10)');
  console.log('');
  console.log('='.repeat(60));
}

main().catch(console.error);
