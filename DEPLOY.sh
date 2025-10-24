#!/bin/bash

# 🚀 DEPLOY SCRIPT - MALU DIGITAL SERVICES

set -e

echo "🚀 MALU DIGITAL SERVICES - DEPLOY"
echo "================================="
echo ""

# Check if logged in
echo "🔐 Verificando login..."
if ! wrangler whoami &> /dev/null; then
    echo "❌ Não está logado no Wrangler!"
    echo "Execute primeiro: wrangler login"
    exit 1
fi

echo "✅ Login OK"
echo ""

# Check if secrets are set
echo "🔑 Verificando secrets..."
if ! wrangler secret list | grep -q "ASAAS_API_KEY"; then
    echo "❌ ASAAS_API_KEY não configurado!"
    echo "Execute: wrangler secret put ASAAS_API_KEY"
    exit 1
fi

if ! wrangler secret list | grep -q "JWT_SECRET"; then
    echo "❌ JWT_SECRET não configurado!"
    echo "Execute: wrangler secret put JWT_SECRET"
    exit 1
fi

echo "✅ Secrets OK"
echo ""

# Deploy
echo "🚀 Fazendo deploy..."
echo ""

wrangler publish

echo ""
echo "✅ Deploy completo!"
echo ""
echo "🌐 Seu app está disponível em:"
echo "   https://malu-digital-services.<seu-usuario>.workers.dev"
echo ""
echo "📊 Ver logs:"
echo "   wrangler tail"
echo ""

