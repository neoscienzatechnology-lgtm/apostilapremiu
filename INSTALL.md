# 🚀 Guia de Instalação Rápida

## Pré-requisitos

- Node.js 16+ (para build do Tailwind)
- Navegador moderno (Chrome, Firefox, Edge, Safari)

## Instalação em 3 Passos

### 1️⃣ Instalar Dependências

```bash
npm install
```

### 2️⃣ Gerar CSS Otimizado

```bash
npm run build
```

### 3️⃣ Abrir no Navegador

Abra o arquivo `apostila-javascript-premium.html` no seu navegador.

## 🎯 Modo Desenvolvimento

Para desenvolvimento com hot reload:

```bash
npm run dev
```

Em outro terminal, sirva os arquivos:

```bash
npm run serve
```

Acesse: `http://localhost:8000`

## 📦 Estrutura Após Build

```
apostilaementa/
├── apostila-javascript-premium.html  ✅ Abrir este arquivo
├── css/
│   └── output.css                    ✅ CSS compilado
├── js/
│   └── *.js                          ✅ Módulos JavaScript
└── manifest.json                     ✅ PWA config
```

## 🔧 Solução de Problemas

### Erro: "Cannot find module 'tailwindcss'"

```bash
npm install
```

### CSS não está carregando

Certifique-se de ter executado:

```bash
npm run build
```

### Service Worker não registra

- Use HTTPS ou localhost
- Verifique se o arquivo `sw.js` existe na raiz

### Módulos ES6 não funcionam

Adicione `type="module"` nas tags script:

```html
<script type="module" src="./js/app.js"></script>
```

## 🌐 Deploy Rápido

### GitHub Pages

```bash
# 1. Build
npm run build

# 2. Commit
git add .
git commit -m "Deploy"
git push

# 3. Ativar GitHub Pages nas configurações do repo
```

### Netlify (Drag & Drop)

1. Execute `npm run build`
2. Arraste a pasta inteira para [Netlify Drop](https://app.netlify.com/drop)
3. Pronto! 🎉

## 📱 Instalar como PWA

1. Abra a apostila no navegador
2. Clique no ícone de instalação na barra de endereço
3. Ou vá em Menu → Instalar Apostila JavaScript

## ✅ Checklist de Verificação

- [ ] Node.js instalado (`node --version`)
- [ ] Dependências instaladas (`npm install`)
- [ ] CSS compilado (`npm run build`)
- [ ] Arquivo HTML abre no navegador
- [ ] Console sem erros (F12)
- [ ] Service Worker registrado (Application tab)
- [ ] Tema claro/escuro funciona
- [ ] Busca funciona
- [ ] Notas podem ser criadas
- [ ] Progresso pode ser exportado

## 🆘 Precisa de Ajuda?

- 📖 Leia o [README.md](README.md) completo
- 🐛 [Reporte bugs](https://github.com/seu-usuario/apostila-js/issues)
- 💬 Entre em contato: seu-email@exemplo.com

---

**Tempo estimado de instalação: 2 minutos** ⏱️
