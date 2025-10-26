#!/bin/bash

# 🚀 Deploy Script - Malu Digital Services Worker
# Execute este script para fazer deploy das correções

set -e  # Exit on error

echo "════════════════════════════════════════════════════════════════"
echo "  🚀 MALU DIGITAL SERVICES - DEPLOY SCRIPT"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Step 1: Pull latest changes
echo "📥 Step 1/5: Pulling latest changes from git..."
git pull origin claude/digital-services-pwa-011CUSg9CSdwDz4e8L2UFEdL
echo "✅ Git pull completed"
echo ""

# Step 2: Clean install dependencies
echo "🧹 Step 2/5: Cleaning old dependencies..."
rm -rf node_modules package-lock.json
echo "✅ Clean completed"
echo ""

# Step 3: Install dependencies
echo "📦 Step 3/5: Installing fresh dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Step 4: Verify build
echo "🔍 Step 4/5: Verifying Worker code..."
if [ -f "worker/index.js" ] && [ -f "worker/utils/auth.js" ]; then
    echo "✅ All required files present"
else
    echo "❌ ERROR: Missing required Worker files!"
    exit 1
fi
echo ""

# Step 5: Deploy to Cloudflare
echo "☁️  Step 5/5: Deploying to Cloudflare Workers..."
echo ""
echo "⚠️  IMPORTANTE: Certifique-se de estar autenticado no Cloudflare!"
echo "    Se não estiver, execute: wrangler login"
echo ""
read -p "Pressione ENTER para continuar com o deploy..."

wrangler deploy

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  ✅ DEPLOY COMPLETO!"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "🔗 Seu Worker está disponível em:"
echo "   https://malu.picoo.workers.dev"
echo ""
echo "📊 Para monitorar logs em tempo real:"
echo "   wrangler tail --format pretty"
echo ""
echo "🧪 Para testar o endpoint de registro:"
echo "   curl -X POST https://malu.picoo.workers.dev/api/auth/register \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"name\":\"Test\",\"email\":\"test@example.com\",\"password\":\"test123\"}'"
echo ""
echo "════════════════════════════════════════════════════════════════"
