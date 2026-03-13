#!/bin/bash

# Script de Deploy Automático
# Repositório: https://github.com/neoscienzatechnology-lgtm/apostilapremiu.git

echo "🚀 Iniciando deploy para GitHub Pages..."
echo "📦 Repositório: neoscienzatechnology-lgtm/apostilapremiu"
echo ""

# 1. Verificar se Node.js está instalado
echo "🔍 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado!"
    echo "Instale em: https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js $(node --version)"

# 2. Instalar dependências (se necessário)
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Erro ao instalar dependências!"
        exit 1
    fi
fi

# 3. Build do CSS
echo "🎨 Compilando Tailwind CSS..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro ao compilar CSS!"
    exit 1
fi
echo "✅ CSS compilado com sucesso!"

# 4. Verificar se está em um repositório Git
if [ ! -d .git ]; then
    echo "📁 Inicializando repositório Git..."
    git init
    git branch -M main
fi

# 5. Verificar remote
if ! git remote get-url origin &> /dev/null; then
    echo "🔗 Adicionando remote..."
    git remote add origin https://github.com/neoscienzatechnology-lgtm/apostilapremiu.git
else
    echo "✅ Remote já configurado: $(git remote get-url origin)"
fi

# 6. Adicionar arquivos
echo "📝 Adicionando arquivos..."
git add .

# 7. Verificar se há mudanças
if git diff-index --quiet HEAD --; then
    echo "ℹ️ Nenhuma mudança para commitar"
else
    # 8. Commit
    echo "💾 Criando commit..."
    read -p "Mensagem do commit (ou Enter para usar padrão): " commit_msg
    if [ -z "$commit_msg" ]; then
        commit_msg="Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
    fi
    git commit -m "$commit_msg"
fi

# 9. Push
echo "🌐 Enviando para GitHub..."
echo "📍 Destino: https://github.com/neoscienzatechnology-lgtm/apostilapremiu.git"

git push -u origin main

if [ $? -ne 0 ]; then
    echo "⚠️ Erro no push. Tentando forçar..."
    read -p "Deseja forçar o push? (s/n): " resposta
    if [ "$resposta" = "s" ]; then
        git push -u origin main --force
    fi
fi

echo ""
echo "✅ Deploy concluído com sucesso!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📌 PRÓXIMOS PASSOS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1️⃣  Acesse o repositório:"
echo "   https://github.com/neoscienzatechnology-lgtm/apostilapremiu"
echo ""
echo "2️⃣  Vá em: Settings → Pages"
echo ""
echo "3️⃣  Configure:"
echo "   • Source: Deploy from a branch"
echo "   • Branch: main"
echo "   • Folder: / (root)"
echo ""
echo "4️⃣  Clique em 'Save'"
echo ""
echo "5️⃣  Aguarde 2-3 minutos"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 SEU SITE ESTARÁ DISPONÍVEL EM:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "   https://neoscienzatechnology-lgtm.github.io/apostilapremiu/"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Dica: Adicione aos favoritos!"
echo ""
