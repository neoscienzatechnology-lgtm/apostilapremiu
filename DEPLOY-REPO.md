# 🚀 Deploy para GitHub Pages

## 📍 Repositório
**https://github.com/neoscienzatechnology-lgtm/apostilapremiu**

## 🌐 URL do Site (após deploy)
**https://neoscienzatechnology-lgtm.github.io/apostilapremiu/**

---

## ⚡ Deploy Rápido (Recomendado)

### Windows (PowerShell)

```powershell
.\deploy-now.ps1
```

### Linux/Mac (Bash)

```bash
bash deploy-now.sh
```

---

## 📋 Deploy Manual (Passo a Passo)

### 1️⃣ Preparar Projeto

```bash
# Instalar dependências
npm install

# Compilar CSS
npm run build
```

### 2️⃣ Configurar Git

```bash
# Inicializar (se necessário)
git init

# Configurar usuário
git config user.name "Seu Nome"
git config user.email "seu@email.com"

# Adicionar remote
git remote add origin https://github.com/neoscienzatechnology-lgtm/apostilapremiu.git

# Verificar
git remote -v
```

### 3️⃣ Fazer Commit

```bash
# Adicionar arquivos
git add .

# Commit
git commit -m "Deploy inicial"

# Push
git branch -M main
git push -u origin main
```

### 4️⃣ Ativar GitHub Pages

1. Acesse: https://github.com/neoscienzatechnology-lgtm/apostilapremiu/settings/pages

2. Configure:
   - **Source**: Deploy from a branch
   - **Branch**: main
   - **Folder**: / (root)

3. Clique em **Save**

4. Aguarde 2-3 minutos

5. Acesse: https://neoscienzatechnology-lgtm.github.io/apostilapremiu/

---

## 🔄 Atualizações Futuras

```bash
# 1. Fazer mudanças no código

# 2. Compilar CSS
npm run build

# 3. Commit e push
git add .
git commit -m "Descrição da mudança"
git push
```

Ou use o script:
```powershell
.\deploy-now.ps1
```

---

## ✅ Checklist de Verificação

- [ ] Node.js instalado (`node --version`)
- [ ] Dependências instaladas (`npm install`)
- [ ] CSS compilado (`npm run build`)
- [ ] Git configurado
- [ ] Remote adicionado
- [ ] Primeiro push feito
- [ ] GitHub Pages ativado
- [ ] Aguardou 2-3 minutos
- [ ] Site acessível

---

## 🐛 Solução de Problemas

### Erro: "Permission denied"

```bash
# Configurar credenciais
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"

# Ou usar token de acesso pessoal
# GitHub → Settings → Developer settings → Personal access tokens
```

### Erro: "CSS não carrega"

```bash
# Recompilar
npm run build

# Verificar se foi gerado
dir css\output.css  # Windows
ls css/output.css   # Linux/Mac

# Commit e push
git add css/output.css
git commit -m "Update CSS"
git push
```

### Site mostra 404

1. Verifique se GitHub Pages está ativado
2. Aguarde 5 minutos
3. Limpe cache do navegador (Ctrl+Shift+R)
4. Verifique se o repositório é público

### Mudanças não aparecem

```bash
# Limpar cache do navegador
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)

# Ou abrir em modo anônimo
Ctrl + Shift + N
```

---

## 📊 Monitorar Deploy

### Ver Status do Deploy

https://github.com/neoscienzatechnology-lgtm/apostilapremiu/actions

### Ver Commits

https://github.com/neoscienzatechnology-lgtm/apostilapremiu/commits/main

### Ver Site

https://neoscienzatechnology-lgtm.github.io/apostilapremiu/

---

## 🎯 Comandos Úteis

```bash
# Ver status
git status

# Ver histórico
git log --oneline -5

# Ver remote
git remote -v

# Ver branch atual
git branch

# Desfazer último commit (local)
git reset --soft HEAD~1

# Forçar push (cuidado!)
git push --force
```

---

## 📱 Testar em Dispositivos

### Desktop
- Chrome: https://neoscienzatechnology-lgtm.github.io/apostilapremiu/
- Firefox: https://neoscienzatechnology-lgtm.github.io/apostilapremiu/
- Edge: https://neoscienzatechnology-lgtm.github.io/apostilapremiu/

### Mobile
1. Abra o link no celular
2. Menu → Adicionar à tela inicial
3. Use como PWA

---

## 🔐 Segurança

### Token de Acesso Pessoal (se necessário)

1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token
4. Selecione: `repo` (todos)
5. Copie o token
6. Use no lugar da senha:

```bash
git remote set-url origin https://TOKEN@github.com/neoscienzatechnology-lgtm/apostilapremiu.git
```

---

## 📞 Suporte

### Problemas com o Deploy?

1. Verifique o console (F12)
2. Veja os logs do GitHub Actions
3. Leia a documentação: https://docs.github.com/pages

### Problemas com o Código?

1. Abra uma issue: https://github.com/neoscienzatechnology-lgtm/apostilapremiu/issues
2. Descreva o problema
3. Inclua prints se possível

---

## ✨ Próximos Passos

Após o deploy bem-sucedido:

1. ✅ Compartilhe o link
2. ✅ Adicione aos favoritos
3. ✅ Instale como PWA
4. ✅ Teste em diferentes dispositivos
5. ✅ Configure domínio customizado (opcional)

---

**🎉 Parabéns! Sua apostila está online!**

**URL:** https://neoscienzatechnology-lgtm.github.io/apostilapremiu/
