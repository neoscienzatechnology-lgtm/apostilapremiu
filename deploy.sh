#!/bin/bash

# Script de Deploy para GitHub Pages
# Execute: bash deploy.sh

echo "🚀 Iniciando deploy para GitHub Pages..."

# 1. Build do CSS
echo "📦 Compilando Tailwind CSS..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro ao compilar CSS!"
    exit 1
fi

echo "✅ CSS compilado com sucesso!"

# 2. Verificar se está em um repositório Git
if [ ! -d .git ]; then
    echo "❌ Este não é um repositório Git!"
    echo "Execute: git init"
    exit 1
fi

# 3. Adicionar arquivos
echo "📝 Adicionando arquivos..."
git add .

# 4. Commit
echo "💾 Criando commit..."
read -p "Mensagem do commit (ou Enter para usar padrão): " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
fi
git commit -m "$commit_msg"

# 5. Push
echo "🌐 Enviando para GitHub..."
git push origin main

if [ $? -ne 0 ]; then
    echo "⚠️ Tentando push para branch master..."
    git push origin master
fi

echo ""
echo "✅ Deploy concluído!"
echo ""
echo "📌 Próximos passos:"
echo "1. Acesse: https://github.com/SEU_USUARIO/SEU_REPO/settings/pages"
echo "2. Em 'Source', selecione: Deploy from a branch"
echo "3. Em 'Branch', selecione: main (ou master) / root"
echo "4. Clique em 'Save'"
echo ""
echo "🌐 Seu site estará disponível em:"
echo "https://SEU_USUARIO.github.io/SEU_REPO/"
echo ""
