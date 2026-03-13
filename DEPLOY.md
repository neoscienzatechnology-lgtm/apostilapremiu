# 🌐 Guia de Deploy para GitHub Pages

## 📋 Pré-requisitos

- [x] Conta no GitHub
- [x] Git instalado
- [x] Node.js instalado
- [x] Projeto compilado (`npm run build`)

## 🚀 Método 1: Deploy Automático (Recomendado)

### Passo 1: Criar Repositório no GitHub

1. Acesse [github.com/new](https://github.com/new)
2. Nome do repositório: `apostila-javascript`
3. Deixe **público**
4. **NÃO** marque "Add a README file"
5. Clique em **Create repository**

### Passo 2: Conectar Repositório Local

```bash
# No terminal, dentro da pasta do projeto:
cd c:\Users\PC\Downloads\apostilaementa

# Inicializar Git (se ainda não fez)
git init

# Adicionar todos os arquivos
git add .

# Primeiro commit
git commit -m "Initial commit: Apostila JavaScript Premium"

# Conectar com GitHub (substitua SEU_USUARIO e SEU_REPO)
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git

# Enviar para GitHub
git branch -M main
git push -u origin main
```

### Passo 3: Configurar GitHub Pages

1. Vá em: `https://github.com/SEU_USUARIO/SEU_REPO/settings/pages`
2. Em **Source**, selecione: `Deploy from a branch`
3. Em **Branch**, selecione: `main` → `/root`
4. Clique em **Save**
5. Aguarde 2-3 minutos

### Passo 4: Acessar Site

Seu site estará em:
```
https://SEU_USUARIO.github.io/SEU_REPO/
```

## 🔧 Método 2: Deploy com GitHub Actions (Avançado)

O projeto já tem o workflow configurado em `.github/workflows/deploy.yml`

### Ativar GitHub Actions

1. Vá em: `https://github.com/SEU_USUARIO/SEU_REPO/settings/pages`
2. Em **Source**, selecione: `GitHub Actions`
3. Faça push para `main`:
   ```bash
   git add .
   git commit -m "Update"
   git push
   ```
4. O deploy será automático!

## 📝 Método 3: Script de Deploy Rápido

### Windows (PowerShell)

```powershell
.\deploy.ps1
```

### Linux/Mac (Bash)

```bash
bash deploy.sh
```

## 🔄 Atualizações Futuras

Sempre que fizer mudanças:

```bash
# 1. Compilar CSS
npm run build

# 2. Adicionar mudanças
git add .

# 3. Commit
git commit -m "Descrição da mudança"

# 4. Push
git push
```

O site será atualizado automaticamente em 2-3 minutos!

## 🐛 Solução de Problemas

### Erro: "Failed to build"

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Erro: "Permission denied"

```bash
# Configurar credenciais Git
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

### Erro: "CSS não carrega"

Verifique se o caminho no HTML está correto:
```html
<!-- Deve ser caminho relativo -->
<link rel="stylesheet" href="./css/output.css">
```

### Erro: "Service Worker não funciona"

GitHub Pages usa HTTPS automaticamente, então o SW deve funcionar.
Se não funcionar, verifique o console (F12).

### Site mostra 404

1. Verifique se o repositório é **público**
2. Verifique se GitHub Pages está ativado
3. Aguarde 5 minutos após o primeiro deploy
4. Limpe o cache do navegador (Ctrl+Shift+R)

## 📊 Verificar Status do Deploy

1. Vá em: `https://github.com/SEU_USUARIO/SEU_REPO/actions`
2. Veja o status do último workflow
3. Se houver erro, clique para ver os logs

## 🎯 Checklist de Deploy

- [ ] Código compilado (`npm run build`)
- [ ] Arquivo `index.html` existe na raiz
- [ ] Arquivo `.nojekyll` existe
- [ ] Repositório é público
- [ ] GitHub Pages está ativado
- [ ] Branch correta selecionada (main)
- [ ] Aguardou 2-3 minutos
- [ ] Testou em modo anônimo (Ctrl+Shift+N)

## 🌟 Dicas de Otimização

### 1. Domínio Customizado

Em `Settings → Pages → Custom domain`:
```
seudominio.com
```

### 2. HTTPS Forçado

Marque: `Enforce HTTPS` ✅

### 3. Cache do Navegador

Adicione em `_headers`:
```
/css/*
  Cache-Control: public, max-age=31536000, immutable

/js/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=3600
```

## 📱 Testar em Dispositivos

### Desktop
- Chrome: `https://SEU_USUARIO.github.io/SEU_REPO/`
- Firefox: `https://SEU_USUARIO.github.io/SEU_REPO/`
- Edge: `https://SEU_USUARIO.github.io/SEU_REPO/`

### Mobile
1. Abra o site no celular
2. Menu → Adicionar à tela inicial
3. Teste como PWA

## 🔍 Monitoramento

### Google Analytics (Opcional)

Adicione no `<head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Lighthouse CI

```bash
npm install -g @lhci/cli
lhci autorun --upload.target=temporary-public-storage
```

## 📞 Suporte

Problemas? Verifique:
1. [GitHub Pages Docs](https://docs.github.com/pages)
2. [Status do GitHub](https://www.githubstatus.com/)
3. Console do navegador (F12)

## ✅ Exemplo de URL Final

```
https://williammesquita.github.io/apostila-javascript/
```

---

**Tempo estimado de deploy:** 5 minutos ⏱️  
**Custo:** Gratuito 💰  
**Limite:** 100GB bandwidth/mês 📊
