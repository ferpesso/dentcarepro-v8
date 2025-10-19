#!/bin/bash

echo "🦷 DentCarePRO - Iniciando servidor..."
echo ""

# Verificar se dist existe
if [ ! -d "dist" ]; then
    echo "❌ Pasta 'dist' não encontrada!"
    echo "Execute primeiro: pnpm build"
    exit 1
fi

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "❌ Pasta 'node_modules' não encontrada!"
    echo "Execute primeiro: pnpm install"
    exit 1
fi

echo "✅ Verificações concluídas"
echo ""
echo "🚀 Iniciando servidor na porta 3000..."
echo "📍 Aceder em: http://localhost:3000"
echo ""
echo "⚠️  Para parar o servidor: Pressione Ctrl+C"
echo ""

# Iniciar servidor
PORT=3000 node dist/index.js
