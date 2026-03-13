# 📚 Apostila JavaScript Premium

> Guia completo de JavaScript do básico ao avançado - HTML5, CSS3, ES6+, React, Node.js e mais!

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/seu-usuario/apostila-js/graphs/commit-activity)

## ✨ Características

- 📖 **Conteúdo Completo**: 28 aulas cobrindo HTML, CSS e JavaScript
- 🎨 **Design Moderno**: Interface responsiva com tema claro/escuro
- 🔒 **Seguro**: Sanitização de HTML e playground isolado
- 📱 **PWA**: Funciona offline após primeira visita
- ♿ **Acessível**: WCAG 2.1 Level AA compliant
- 📊 **Analytics Local**: Rastreie seu progresso sem enviar dados
- 📝 **Notas Pessoais**: Anote em cada capítulo
- 🎯 **Interativo**: Quiz, playground de código e exercícios

## 🚀 Início Rápido

### Opção 1: Uso Direto (Sem Build)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/apostila-js.git

# Entre na pasta
cd apostila-js

# Abra o arquivo HTML no navegador
# Windows
start apostila-javascript-premium.html

# macOS
open apostila-javascript-premium.html

# Linux
xdg-open apostila-javascript-premium.html
```

### Opção 2: Com Build (Recomendado)

```bash
# Instalar dependências
npm install

# Desenvolvimento (com watch)
npm run dev

# Build para produção
npm run build

# Servir localmente
npm start
```

## 📁 Estrutura do Projeto

```
apostilaementa/
├── apostila-javascript-premium.html  # Arquivo principal
├── offline.html                      # Página offline (PWA)
├── manifest.json                     # Manifest PWA
├── sw.js                            # Service Worker
├── package.json                     # Dependências
├── tailwind.config.js               # Config Tailwind
├── css/
│   ├── input.css                    # CSS de entrada
│   └── output.css                   # CSS compilado (gerado)
├── js/
│   ├── app.js                       # Aplicação principal
│   ├── sanitize.js                  # Sanitização XSS
│   ├── playground.js                # Playground seguro
│   ├── progress-manager.js          # Exportar/importar progresso
│   ├── notes-system.js              # Sistema de notas
│   ├── analytics.js                 # Analytics local
│   └── accessibility.js             # Acessibilidade
├── assets/
│   └── icon-*.png                   # Ícones PWA
└── README.md
```

## 🎯 Funcionalidades

### 🔐 Segurança

- **Sanitização de HTML**: Previne ataques XSS
- **Playground Isolado**: Código executado em iframe sandbox
- **CSP Headers**: Content Security Policy configurado

### 📱 PWA (Progressive Web App)

- **Offline First**: Funciona sem internet após cache
- **Instalável**: Adicione à tela inicial
- **Service Worker**: Cache inteligente de assets
- **Sincronização**: Progresso salvo localmente

### ♿ Acessibilidade

- **ARIA Labels**: Navegação por leitores de tela
- **Skip Links**: Pular para conteúdo principal
- **Navegação por Teclado**: Atalhos completos
- **Alto Contraste**: Modo para baixa visão
- **Ajuste de Fonte**: Aumentar/diminuir texto

#### Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Alt + M` | Abrir menu |
| `Alt + S` | Focar busca |
| `Alt + T` | Alternar tema |
| `Alt + H` | Ajuda de atalhos |
| `Esc` | Fechar modais |
| `↑` `↓` | Navegar seções |

### 📊 Analytics Local

- **Sem Rastreamento Externo**: Dados ficam no seu dispositivo
- **Dashboard Completo**: Visualize seu progresso
- **Exportação**: Baixe seus dados em JSON
- **GDPR Friendly**: Privacidade total

### 📝 Sistema de Notas

- **Notas por Capítulo**: Anote em cada seção
- **Markdown Support**: Formatação básica
- **Sincronização**: Salvo no localStorage
- **Exportação**: Incluso no backup de progresso

### 🎮 Playground Interativo

- **Execução Segura**: Código isolado em sandbox
- **Console Capturado**: Veja logs, erros e warnings
- **Atalho Rápido**: `Ctrl/Cmd + Enter` para executar
- **Syntax Highlighting**: Código colorido

## 🛠️ Tecnologias

- **HTML5**: Estrutura semântica
- **CSS3**: Flexbox, Grid, Animations
- **JavaScript ES6+**: Módulos, async/await, classes
- **Tailwind CSS**: Utility-first CSS framework
- **Service Workers**: Cache e offline
- **Web Storage API**: localStorage e sessionStorage
- **Intersection Observer**: Scrollspy e lazy loading

## 📦 Instalação de Dependências

```bash
# NPM
npm install

# Yarn
yarn install

# PNPM
pnpm install
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento com watch
npm run dev

# Build para produção (minificado)
npm run build

# Servir localmente (Python)
npm run serve

# Desenvolvimento + servidor
npm start
```

## 🌐 Deploy

### GitHub Pages

```bash
# Build
npm run build

# Commit
git add .
git commit -m "Build para produção"
git push origin main

# Configurar GitHub Pages
# Settings → Pages → Source: main branch
```

### Netlify

```bash
# netlify.toml
[build]
  command = "npm run build"
  publish = "."

[[redirects]]
  from = "/*"
  to = "/apostila-javascript-premium.html"
  status = 200
```

### Vercel

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".",
  "framework": null
}
```

## 📊 Performance

- **Lighthouse Score**: 95+ em todas as categorias
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Total Bundle Size**: ~50KB (com Tailwind otimizado)

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

**William Mesquita**

- GitHub: [@seu-usuario](https://github.com/seu-usuario)
- LinkedIn: [seu-perfil](https://linkedin.com/in/seu-perfil)

## 🙏 Agradecimentos

- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)
- [Tailwind CSS](https://tailwindcss.com/)
- Comunidade JavaScript Brasil

## 📈 Roadmap

- [ ] Modo de leitura focado
- [ ] Sincronização em nuvem
- [ ] Versão mobile app (React Native)
- [ ] Gamificação (badges, conquistas)
- [ ] Fórum de discussão integrado
- [ ] Vídeos explicativos
- [ ] Exercícios com correção automática
- [ ] Certificado de conclusão

## 🐛 Reportar Bugs

Encontrou um bug? [Abra uma issue](https://github.com/seu-usuario/apostila-js/issues/new)

## 💬 Suporte

Precisa de ajuda? Entre em contato:

- Email: seu-email@exemplo.com
- Discord: [Servidor da Comunidade](#)
- Twitter: [@seu-usuario](https://twitter.com/seu-usuario)

---

⭐ Se este projeto te ajudou, considere dar uma estrela!

**Feito com ❤️ e ☕ por William Mesquita**
