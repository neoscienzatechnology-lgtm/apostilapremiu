# Script de Deploy Automático
# Repositório: https://github.com/neoscienzatechnology-lgtm/apostilapremiu.git

Write-Host "🚀 Iniciando deploy para GitHub Pages..." -ForegroundColor Cyan
Write-Host "📦 Repositório: neoscienzatechnology-lgtm/apostilapremiu" -ForegroundColor Yellow
Write-Host ""

# 1. Verificar se Node.js está instalado
Write-Host "🔍 Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js não encontrado!" -ForegroundColor Red
    Write-Host "Instale em: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Node.js $nodeVersion" -ForegroundColor Green

# 2. Instalar dependências (se necessário)
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao instalar dependências!" -ForegroundColor Red
        exit 1
    }
}

# 3. Build do CSS
Write-Host "🎨 Compilando Tailwind CSS..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao compilar CSS!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ CSS compilado com sucesso!" -ForegroundColor Green

# 4. Verificar se está em um repositório Git
if (-not (Test-Path .git)) {
    Write-Host "📁 Inicializando repositório Git..." -ForegroundColor Yellow
    git init
    git branch -M main
}

# 5. Verificar remote
$remoteUrl = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "🔗 Adicionando remote..." -ForegroundColor Yellow
    git remote add origin https://github.com/neoscienzatechnology-lgtm/apostilapremiu.git
} else {
    Write-Host "✅ Remote já configurado: $remoteUrl" -ForegroundColor Green
}

# 6. Adicionar arquivos
Write-Host "📝 Adicionando arquivos..." -ForegroundColor Yellow
git add .

# 7. Verificar se há mudanças
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "ℹ️ Nenhuma mudança para commitar" -ForegroundColor Cyan
} else {
    # 8. Commit
    Write-Host "💾 Criando commit..." -ForegroundColor Yellow
    $commit_msg = Read-Host "Mensagem do commit (ou Enter para usar padrão)"
    if ([string]::IsNullOrWhiteSpace($commit_msg)) {
        $commit_msg = "Deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    }
    git commit -m $commit_msg
}

# 9. Push
Write-Host "🌐 Enviando para GitHub..." -ForegroundColor Yellow
Write-Host "📍 Destino: https://github.com/neoscienzatechnology-lgtm/apostilapremiu.git" -ForegroundColor Cyan

git push -u origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Erro no push. Tentando forçar..." -ForegroundColor Yellow
    $resposta = Read-Host "Deseja forçar o push? (s/n)"
    if ($resposta -eq "s") {
        git push -u origin main --force
    }
}

Write-Host ""
Write-Host "✅ Deploy concluído com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📌 PRÓXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Acesse o repositório:" -ForegroundColor White
Write-Host "   https://github.com/neoscienzatechnology-lgtm/apostilapremiu" -ForegroundColor Cyan
Write-Host ""
Write-Host "2️⃣  Vá em: Settings → Pages" -ForegroundColor White
Write-Host ""
Write-Host "3️⃣  Configure:" -ForegroundColor White
Write-Host "   • Source: Deploy from a branch" -ForegroundColor Gray
Write-Host "   • Branch: main" -ForegroundColor Gray
Write-Host "   • Folder: / (root)" -ForegroundColor Gray
Write-Host ""
Write-Host "4️⃣  Clique em 'Save'" -ForegroundColor White
Write-Host ""
Write-Host "5️⃣  Aguarde 2-3 minutos" -ForegroundColor White
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🌐 SEU SITE ESTARÁ DISPONÍVEL EM:" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "   https://neoscienzatechnology-lgtm.github.io/apostilapremiu/" -ForegroundColor Green -BackgroundColor Black
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Dica: Adicione aos favoritos!" -ForegroundColor Yellow
Write-Host ""
