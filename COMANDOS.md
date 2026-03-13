# 🚀 Comandos Rápidos - GitHub Pages

## Primeiro Deploy

```bash
# 1. Instalar dependências
npm install

# 2. Compilar CSS
npm run build

# 3. Inicializar Git (se necessário)
git init

# 4. Adicionar arquivos
git add .

# 5. Primeiro commit
git commit -m "Initial commit"

# 6. Adicionar remote (SUBSTITUA SEU_USUARIO e SEU_REPO)
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git

# 7. Push
git branch -M main
git push -u origin main
```

## Atualizações

```bash
# Método 1: Automático
npm run deploy:manual

# Método 2: Manual
npm run build
git add .
git commit -m "Atualização"
git push
```

## Verificar Status

```bash
# Ver status do Git
git status

# Ver último commit
git log -1

# Ver remote
git remote -v
```

## Configurar GitHub Pages

1. Acesse: `https://github.com/SEU_USUARIO/SEU_REPO/settings/pages`
2. Source: `Deploy from a branch`
3. Branch: `main` → `/root`
4. Save

## URL do Site

```
https://SEU_USUARIO.github.io/SEU_REPO/
```

## Problemas Comuns

### CSS não carrega
```bash
npm run build
git add css/output.css
git commit -m "Update CSS"
git push
```

### Mudanças não aparecem
```bash
# Limpar cache do navegador
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### Erro de permissão
```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

## Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento com watch
npm run build        # Build para produção
npm run serve        # Servidor local
npm run start        # Dev + servidor
npm run deploy       # Deploy com gh-pages
npm run deploy:manual # Build + commit + push
```

## Atalhos Windows

```powershell
# Deploy rápido
.\deploy.ps1

# Ou criar alias
Set-Alias deploy .\deploy.ps1
```

## Atalhos Linux/Mac

```bash
# Deploy rápido
bash deploy.sh

# Ou criar alias no ~/.bashrc
alias deploy="bash deploy.sh"
```

## Monitorar Deploy

```bash
# Ver actions no GitHub
https://github.com/SEU_USUARIO/SEU_REPO/actions

# Ver logs
git log --oneline -10
```

## Rollback (Desfazer)

```bash
# Voltar 1 commit
git reset --hard HEAD~1
git push -f

# Voltar para commit específico
git reset --hard COMMIT_HASH
git push -f
```

## Backup

```bash
# Criar branch de backup
git checkout -b backup
git push origin backup

# Voltar para main
git checkout main
```

---

**Dica:** Salve este arquivo como favorito! 📌
