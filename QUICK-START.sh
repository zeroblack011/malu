#!/bin/bash

# 🚀 QUICK START SCRIPT - MALU DIGITAL SERVICES
# Execute este script para setup rápido

set -e

echo "🚀 MALU DIGITAL SERVICES - QUICK START"
echo "======================================"
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler não encontrado!"
    echo "📦 Instalando Wrangler globalmente..."
    npm install -g wrangler
    echo "✅ Wrangler instalado!"
else
    echo "✅ Wrangler já instalado"
fi

echo ""
echo "🔐 Fazendo login no Cloudflare..."
echo "   (Uma aba do navegador vai abrir)"
echo ""

wrangler login

echo ""
echo "✅ Login completo!"
echo ""
echo "👤 Verificando usuário..."
wrangler whoami

echo ""
echo "📦 Criando KV Namespaces..."
echo ""

echo "1️⃣ Criando USERS_KV..."
wrangler kv:namespace create "USERS_KV"

echo ""
echo "2️⃣ Criando ORDERS_KV..."
wrangler kv:namespace create "ORDERS_KV"

echo ""
echo "3️⃣ Criando Preview USERS_KV..."
wrangler kv:namespace create "USERS_KV" --preview

echo ""
echo "4️⃣ Criando Preview ORDERS_KV..."
wrangler kv:namespace create "ORDERS_KV" --preview

echo ""
echo "⚠️  ATENÇÃO! Copie os IDs acima e cole em wrangler.toml"
echo ""
read -p "Pressione ENTER após atualizar wrangler.toml..."

echo ""
echo "🔑 Configurando Secrets..."
echo ""

echo "Digite a API Key do Asaas:"
wrangler secret put ASAAS_API_KEY

echo ""
echo "Digite o JWT Secret (32+ caracteres aleatórios):"
wrangler secret put JWT_SECRET

echo ""
echo "✅ Setup completo!"
echo ""
echo "🧪 Testando localmente..."
echo "   Pressione Ctrl+C para parar o servidor"
echo ""

wrangler dev

