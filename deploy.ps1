# Script de Deploy para GitHub Pages (Windows)
# Execute: .\deploy.ps1

Write-Host "🚀 Iniciando deploy para GitHub Pages..." -ForegroundColor Cyan

# 1. Build do CSS
Write-Host "📦 Compilando Tailwind CSS..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao compilar CSS!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ CSS compilado com sucesso!" -ForegroundColor Green

# 2. Verificar se está em um repositório Git
if (-not (Test-Path .git)) {
    Write-Host "❌ Este não é um repositório Git!" -ForegroundColor Red
    Write-Host "Execute: git init" -ForegroundColor Yellow
    exit 1
}

# 3. Adicionar arquivos
Write-Host "📝 Adicionando arquivos..." -ForegroundColor Yellow
git add .

# 4. Commit
Write-Host "💾 Criando commit..." -ForegroundColor Yellow
$commit_msg = Read-Host "Mensagem do commit (ou Enter para usar padrão)"
if ([string]::IsNullOrWhiteSpace($commit_msg)) {
    $commit_msg = "Deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
}
git commit -m $commit_msg

# 5. Push
Write-Host "🌐 Enviando para GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Tentando push para branch master..." -ForegroundColor Yellow
    git push origin master
}

Write-Host ""
Write-Host "✅ Deploy concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "📌 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Acesse: https://github.com/SEU_USUARIO/SEU_REPO/settings/pages"
Write-Host "2. Em 'Source', selecione: Deploy from a branch"
Write-Host "3. Em 'Branch', selecione: main (ou master) / root"
Write-Host "4. Clique em 'Save'"
Write-Host ""
Write-Host "🌐 Seu site estará disponível em:" -ForegroundColor Cyan
Write-Host "https://SEU_USUARIO.github.io/SEU_REPO/"
Write-Host ""
