# Guia de Manutenção e Arquitetura para Agentes — AdrielOS

## 1. Visão do Projeto
O **AdrielOS** é um portfólio interativo pessoal para **Adriel Morback**, desenvolvido exclusivamente em **HTML5**, **CSS3** e **JavaScript Vanilla**, projetado para rodar com alta performance e sem necessidade de etapas complexas de compilação ou frameworks como React, Angular ou Tailwind.

---

## 2. Estrutura de Arquivos
```
portfolio/
├── AGENTS.md               <- Este guia para desenvolvedores e agentes de IA
├── referencias.md          <- Documento de referências conceituais (NishantOS, etc.)
├── identidade.md           <- Guia de identidade visual, paleta de cores e tipografia
├── funcionalidades.md      <- Especificação detalhada de cada módulo do sistema
├── index.html              <- Estrutura semântica principal e templates das janelas
├── style.css               <- Estilos globais, variáveis CSS, temas e responsividade
├── script.js               <- Motor do SO: gerenciador de janelas, eventos, atalhos
├── README.md               <- Instruções de publicação e apresentação do projeto
└── assets/
    ├── wallpapers/         <- Papéis de parede em SVG e imagens de alta resolução
    ├── icons/              <- Ícones do sistema em SVG vetorial
    └── projects/           <- Imagens e banners dos projetos reais do Adriel
```

---

## 3. Padrões de Código e Diretrizes Arquiteturais

### 3.1. Gerenciamento de Janelas (`script.js`)
- Cada janela possui um elemento com a classe `.os-window` e um ID no formato `win-[app-id]`.
- A abertura de janelas deve ser feita preferencialmente pela função centralizada `openApp(appId)`.
- O empilhamento de janelas utiliza a variável `highestZIndex`, incrementada a cada foco:
  ```javascript
  function bringToFront(windowElement) {
    highestZIndex++;
    windowElement.style.zIndex = highestZIndex;
    // Atualizar estado ativo visual
  }
  ```
- O gerenciador de arraste (`initDraggable`) deve escutar tanto eventos de mouse (`mousedown`, `mousemove`, `mouseup`) quanto eventos de toque (`touchstart`, `touchmove`, `touchend`) para compatibilidade com dispositivos móveis.

### 3.2. Estilos e Tokens CSS (`style.css`)
- Todas as cores, sombras e transições devem utilizar as variáveis CSS definidas no `:root`:
  - `--bg-primary`, `--bg-surface`, `--accent-neon`, `--accent-cyber`, `--text-primary`, etc.
- O suporte a temas (ex: Dark Neon e Light) deve ser feito alterando a classe no elemento `<body>` ou atributo `data-theme` no `<html>`.

### 3.3. Adição de Novos Projetos ou Aplicativos
Ao adicionar um novo aplicativo:
1. Criar o ícone correspondente na área de trabalho dentro de `.desktop-icons` no `index.html`.
2. Adicionar a respectiva janela dentro de `#windows-container` no `index.html`.
3. Registrar o atalho no Menu Iniciar dentro de `#start-menu-apps`.
4. Incluir o ID do aplicativo no array `APP_CONFIG` no `script.js` para gerenciar título, ícone e dimensões padrão.

---

## 4. Como Executar e Testar Localmente
- Para testar localmente, pode-se utilizar qualquer servidor HTTP estático:
  ```bash
  # Via Python:
  python -m http.server 8080 --directory portfolio
  
  # Via Node (npx):
  npx -y serve portfolio
  ```
- O projeto não possui dependências de backend e pode ser hospedado diretamente no **GitHub Pages**, **Vercel** ou **Cloudflare Pages**.
